import { describe, expect, it, vi } from "vitest";

import type { FinishedMatch } from "../matches/types";
import { copyTextWithLegacyApi, shareResult } from "./shareResult";

const match: FinishedMatch = {
  id: "match-1",
  status: "finished",
  gameKind: "fifa",
  startedAt: "2026-08-15T12:00:00.000Z",
  finishedAt: "2026-08-15T12:30:00.000Z",
  participants: [
    { id: "a", name: "Ana", score: 2 },
    { id: "b", name: "Bia", score: 1 },
  ],
  result: { type: "winner", winnerId: "a" },
};

describe("shareResult", () => {
  it("prefers the Web Share API", async () => {
    const share = vi.fn().mockResolvedValue(undefined);
    const writeText = vi.fn().mockResolvedValue(undefined);

    await expect(shareResult(match, { share, writeText })).resolves.toMatchObject({ method: "share" });
    expect(share).toHaveBeenCalledWith(expect.objectContaining({
      title: "Resultado da partida",
      text: expect.stringContaining("Ana 2 x 1 Bia"),
    }));
    expect(writeText).not.toHaveBeenCalled();
  });

  it("copies the text when Web Share is unavailable", async () => {
    const writeText = vi.fn().mockResolvedValue(undefined);

    await expect(shareResult(match, { writeText })).resolves.toMatchObject({ method: "clipboard" });
    expect(writeText).toHaveBeenCalledWith(expect.stringContaining("Jogo: Fifa"));
  });

  it("falls back to clipboard when Web Share rejects", async () => {
    const share = vi.fn().mockRejectedValue(new Error("unavailable"));
    const writeText = vi.fn().mockResolvedValue(undefined);

    await expect(shareResult(match, { share, writeText })).resolves.toMatchObject({ method: "clipboard" });
    expect(writeText).toHaveBeenCalledOnce();
  });

  it("falls back to the legacy API when modern clipboard rejects", async () => {
    const copyTextLegacy = vi.fn().mockReturnValue(true);

    await expect(shareResult(match, {
      writeText: vi.fn().mockRejectedValue(new Error("insecure context")),
      copyTextLegacy,
    })).resolves.toMatchObject({ method: "legacy-clipboard" });
    expect(copyTextLegacy).toHaveBeenCalledWith(expect.stringContaining("Ana 2 x 1 Bia"));
  });

  it("uses the legacy API in an HTTP-like environment without modern APIs", async () => {
    const copyTextLegacy = vi.fn().mockReturnValue(true);
    await expect(shareResult(match, { copyTextLegacy })).resolves.toMatchObject({ method: "legacy-clipboard" });
  });

  it("does not copy when the user cancels Web Share", async () => {
    const aborted = new Error("cancelled");
    aborted.name = "AbortError";
    const writeText = vi.fn();
    const copyTextLegacy = vi.fn();

    await expect(shareResult(match, {
      share: vi.fn().mockRejectedValue(aborted),
      writeText,
      copyTextLegacy,
    })).resolves.toMatchObject({ method: "cancelled" });
    expect(writeText).not.toHaveBeenCalled();
    expect(copyTextLegacy).not.toHaveBeenCalled();
  });

  it("rejects after every copy strategy fails", async () => {
    await expect(shareResult(match, {
      share: vi.fn().mockRejectedValue(new Error("share failed")),
      writeText: vi.fn().mockRejectedValue(new Error("clipboard failed")),
      copyTextLegacy: vi.fn().mockReturnValue(false),
    })).rejects.toThrow("indisponíveis");
  });

  it("cleans up the temporary textarea and restores focus", () => {
    const input = document.createElement("input");
    document.body.appendChild(input);
    input.focus();
    const execCommand = vi.fn().mockReturnValue(true);
    Object.defineProperty(document, "execCommand", { configurable: true, value: execCommand });

    expect(copyTextWithLegacyApi("resultado", document)).toBe(true);
    expect(execCommand).toHaveBeenCalledWith("copy");
    expect(document.querySelector("textarea")).not.toBeInTheDocument();
    expect(document.activeElement).toBe(input);
    input.remove();
  });

  it("rejects when neither capability exists", async () => {
    await expect(shareResult(match, {})).rejects.toThrow("indisponíveis");
  });
});
