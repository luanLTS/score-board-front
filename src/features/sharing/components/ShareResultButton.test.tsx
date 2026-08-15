import { act, fireEvent, render, screen, waitFor } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";

import type { FinishedMatch } from "../../matches/types";
import type { ShareResultOutcome } from "../shareResult";
import { ShareResultButton } from "./ShareResultButton";

const match = {
  id: "match-1",
  status: "finished",
  gameKind: "generic",
  startedAt: "2026-08-15T12:00:00.000Z",
  finishedAt: "2026-08-15T12:30:00.000Z",
  participants: [
    { id: "a", name: "Ana", score: 2 },
    { id: "b", name: "Bia", score: 1 },
  ],
  result: { type: "winner", winnerId: "a" },
} satisfies FinishedMatch;

afterEach(() => {
  vi.useRealTimers();
});

describe("ShareResultButton", () => {
  it("keeps its label and appearance while sharing and prevents concurrent clicks", async () => {
    let resolveShare!: (outcome: ShareResultOutcome) => void;
    const onShare = vi.fn(() => new Promise<ShareResultOutcome>((resolve) => {
      resolveShare = resolve;
    }));
    render(<ShareResultButton match={match} onShare={onShare} />);
    const button = screen.getByRole("button", { name: "Compartilhar resultado" });

    fireEvent.click(button);
    fireEvent.click(button);

    expect(button).toHaveTextContent("Compartilhar resultado");
    expect(button).not.toBeDisabled();
    expect(onShare).toHaveBeenCalledOnce();
    expect(button.parentElement).toHaveTextContent(/^Compartilhar resultado$/);

    await act(async () => resolveShare({ method: "share", text: "result" }));
  });

  it("shows a temporary viewport toast after clipboard success", async () => {
    vi.useFakeTimers();
    render(<ShareResultButton match={match} onShare={vi.fn().mockResolvedValue({ method: "clipboard", text: "result" })} />);

    await act(async () => {
      fireEvent.click(screen.getByRole("button", { name: "Compartilhar resultado" }));
    });
    const toast = screen.getByRole("status");

    expect(toast).toHaveTextContent("Resultado copiado.");
    expect(toast).toHaveClass("fixed");
    act(() => vi.advanceTimersByTime(3_000));
    expect(screen.queryByRole("status")).not.toBeInTheDocument();
  });

  it("shows a temporary accessible error toast", async () => {
    vi.useFakeTimers();
    render(<ShareResultButton match={match} onShare={vi.fn().mockRejectedValue(new Error("failed"))} />);

    await act(async () => {
      fireEvent.click(screen.getByRole("button", { name: "Compartilhar resultado" }));
    });
    expect(screen.getByRole("alert")).toHaveTextContent("Não foi possível compartilhar");

    act(() => vi.advanceTimersByTime(3_000));
    expect(screen.queryByRole("alert")).not.toBeInTheDocument();
  });

  it("does not show feedback when sharing is cancelled", async () => {
    render(<ShareResultButton match={match} onShare={vi.fn().mockResolvedValue({ method: "cancelled", text: "result" })} />);

    await act(async () => {
      fireEvent.click(screen.getByRole("button", { name: "Compartilhar resultado" }));
    });

    expect(screen.queryByRole("status")).not.toBeInTheDocument();
    expect(screen.queryByRole("alert")).not.toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Compartilhar resultado" })).toBeInTheDocument();
  });

  it("does not carry toast or stale async feedback to a new result", async () => {
    let resolveShare!: (outcome: ShareResultOutcome) => void;
    const onShare = vi.fn(() => new Promise<ShareResultOutcome>((resolve) => {
      resolveShare = resolve;
    }));
    const { rerender } = render(<ShareResultButton match={match} onShare={onShare} />);

    fireEvent.click(screen.getByRole("button", { name: "Compartilhar resultado" }));
    rerender(<ShareResultButton match={{ ...match, id: "match-2" }} onShare={onShare} />);
    await act(async () => resolveShare({ method: "share", text: "old result" }));

    await waitFor(() => expect(screen.queryByRole("status")).not.toBeInTheDocument());
    expect(screen.getByRole("button", { name: "Compartilhar resultado" })).toBeInTheDocument();
  });
});
