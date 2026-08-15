import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";

import type { FinishedMatch } from "../../matches/types";
import { shareResult, type ShareResultOutcome } from "../shareResult";

type ShareResultButtonProps = {
  match: FinishedMatch;
  onShare?: (match: FinishedMatch) => Promise<ShareResultOutcome>;
};

type Feedback = { kind: "success" | "error"; message: string } | null;

const TOAST_DURATION_MS = 3_000;

export function ShareResultButton({
  match,
  onShare = shareResult,
}: ShareResultButtonProps) {
  const [feedback, setFeedback] = useState<Feedback>(null);
  const sharingRef = useRef(false);
  const resultVersionRef = useRef(0);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const clearToast = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    timeoutRef.current = null;
    setFeedback(null);
  };

  useEffect(() => {
    resultVersionRef.current += 1;
    sharingRef.current = false;
    clearToast();

    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, [match.id]);

  const showToast = (nextFeedback: Exclude<Feedback, null>) => {
    clearToast();
    setFeedback(nextFeedback);
    timeoutRef.current = setTimeout(() => {
      timeoutRef.current = null;
      setFeedback(null);
    }, TOAST_DURATION_MS);
  };

  const handleShare = async () => {
    if (sharingRef.current) return;

    sharingRef.current = true;
    const resultVersion = resultVersionRef.current;

    try {
      const outcome = await onShare(match);
      if (outcome.method !== "cancelled" && resultVersion === resultVersionRef.current) {
        showToast({
          kind: "success",
          message:
            outcome.method === "clipboard" || outcome.method === "legacy-clipboard"
              ? "Resultado copiado."
              : "Resultado compartilhado.",
        });
      }
    } catch {
      if (resultVersion === resultVersionRef.current) {
        showToast({
          kind: "error",
          message: "Não foi possível compartilhar o resultado.",
        });
      }
    } finally {
      if (resultVersion === resultVersionRef.current) {
        sharingRef.current = false;
      }
    }
  };

  return (
    <>
      <button
        className="min-h-11 rounded-md border border-teal-400 px-4 py-2 font-semibold text-teal-200 transition hover:bg-teal-400/10"
        onClick={handleShare}
        type="button"
      >
        Compartilhar resultado
      </button>
      {feedback
        ? createPortal(
            <div
              aria-live={feedback.kind === "error" ? "assertive" : "polite"}
              className={`fixed right-4 top-4 z-50 max-w-sm rounded-md border bg-zinc-900 px-4 py-3 shadow-xl ${
                feedback.kind === "error"
                  ? "border-red-400 text-red-200"
                  : "border-teal-400 text-teal-200"
              }`}
              role={feedback.kind === "error" ? "alert" : "status"}
            >
              {feedback.message}
            </div>,
            document.body,
          )
        : null}
    </>
  );
}
