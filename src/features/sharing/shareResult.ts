import type { FinishedMatch } from "../matches/types";

import { formatResultShareText } from "./formatResultShareText";

export type ShareResultEnvironment = {
  share?: (data: { text: string; title: string }) => Promise<void>;
  writeText?: (text: string) => Promise<void>;
  copyTextLegacy?: (text: string) => boolean;
};

export type ShareResultOutcome =
  | { method: "share"; text: string }
  | { method: "clipboard"; text: string }
  | { method: "legacy-clipboard"; text: string }
  | { method: "cancelled"; text: string };

const isAbortError = (error: unknown): boolean =>
  typeof error === "object" && error !== null && "name" in error && error.name === "AbortError";

export function copyTextWithLegacyApi(text: string, targetDocument: Document): boolean {
  if (typeof targetDocument.execCommand !== "function") return false;

  const textarea = targetDocument.createElement("textarea");
  const activeElement = targetDocument.activeElement;
  const selection = targetDocument.defaultView?.getSelection();
  const selectedRanges = selection
    ? Array.from({ length: selection.rangeCount }, (_, index) => selection.getRangeAt(index).cloneRange())
    : [];

  textarea.value = text;
  textarea.readOnly = true;
  textarea.setAttribute("aria-hidden", "true");
  textarea.style.position = "fixed";
  textarea.style.opacity = "0";
  textarea.style.pointerEvents = "none";
  targetDocument.body.appendChild(textarea);

  try {
    textarea.focus();
    textarea.select();
    return targetDocument.execCommand("copy");
  } finally {
    textarea.remove();
    const HTMLElementConstructor = targetDocument.defaultView?.HTMLElement;
    if (HTMLElementConstructor && activeElement instanceof HTMLElementConstructor) activeElement.focus();
    if (selection) {
      selection.removeAllRanges();
      selectedRanges.forEach((range) => selection.addRange(range));
    }
  }
}

const browserEnvironment = (): ShareResultEnvironment => ({
  share:
    typeof navigator !== "undefined" && navigator.share
      ? navigator.share.bind(navigator)
      : undefined,
  writeText:
    typeof navigator !== "undefined" && navigator.clipboard?.writeText
      ? navigator.clipboard.writeText.bind(navigator.clipboard)
      : undefined,
  copyTextLegacy:
    typeof document !== "undefined"
      ? (text) => copyTextWithLegacyApi(text, document)
      : undefined,
});

export async function shareResult(
  match: FinishedMatch,
  environment: ShareResultEnvironment = browserEnvironment(),
): Promise<ShareResultOutcome> {
  const text = formatResultShareText(match);

  if (environment.share) {
    try {
      await environment.share({ title: "Resultado da partida", text });
      return { method: "share", text };
    } catch (error) {
      if (isAbortError(error)) return { method: "cancelled", text };
    }
  }

  if (environment.writeText) {
    try {
      await environment.writeText(text);
      return { method: "clipboard", text };
    } catch {
      // In insecure contexts the modern clipboard API may exist but reject.
    }
  }

  if (environment.copyTextLegacy?.(text)) {
    return { method: "legacy-clipboard", text };
  }

  throw new Error("Compartilhamento e área de transferência indisponíveis.");
}
