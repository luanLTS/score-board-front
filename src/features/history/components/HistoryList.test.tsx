import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

import type { FinishedMatch } from "../../matches/types";

import { HistoryList } from "./HistoryList";

const matches = [
  {
    id: "match-1",
    gameKind: "truco",
    status: "finished",
    startedAt: "2026-06-15T20:00:00.000Z",
    finishedAt: "2026-06-15T20:35:00.000Z",
    participants: [
      { id: "ana", name: "Ana", score: 12 },
      { id: "bruno", name: "Bruno", score: 8 },
    ],
  },
  {
    id: "match-2",
    gameKind: "fifa",
    status: "finished",
    startedAt: "2026-06-16T18:00:00.000Z",
    finishedAt: "2026-06-16T18:18:00.000Z",
    participants: [
      { id: "bia", name: "Bia", score: 3 },
      { id: "caio", name: "Caio", score: 2 },
    ],
  },
] as FinishedMatch[];

describe("HistoryList", () => {
  it("renders an empty state when there are no matches", () => {
    render(<HistoryList matches={[]} onSelectMatch={vi.fn()} />);

    expect(screen.getByText("Nenhuma partida finalizada")).toBeInTheDocument();
  });

  it("renders finished matches with names, score, game kind, and finished date", () => {
    render(<HistoryList matches={matches} onSelectMatch={vi.fn()} />);

    expect(screen.getByRole("button", { name: /Ana 12 x 8 Bruno/i }))
      .toBeInTheDocument();
    expect(screen.getByText("Truco")).toBeInTheDocument();
    expect(screen.getByText("15/06/2026")).toBeInTheDocument();

    expect(screen.getByRole("button", { name: /Bia 3 x 2 Caio/i }))
      .toBeInTheDocument();
    expect(screen.getByText("Fifa")).toBeInTheDocument();
    expect(screen.getByText("16/06/2026")).toBeInTheDocument();
  });

  it("selects a match from an accessible item and highlights the selected match", async () => {
    const user = userEvent.setup();
    const onSelectMatch = vi.fn();

    render(
      <HistoryList
        matches={matches}
        onSelectMatch={onSelectMatch}
        selectedMatchId="match-2"
      />,
    );

    await user.click(screen.getByRole("button", { name: /Ana 12 x 8 Bruno/i }));

    expect(onSelectMatch).toHaveBeenCalledWith("match-1");
    expect(screen.getByRole("button", { name: /Bia 3 x 2 Caio/i }))
      .toHaveAttribute("aria-pressed", "true");
  });

  it("keeps long histories scrollable inside the history panel", () => {
    render(<HistoryList matches={matches} onSelectMatch={vi.fn()} />);

    expect(screen.getByRole("list", { name: "Partidas finalizadas" }))
      .toHaveClass("max-h-[min(52vh,32rem)]", "overflow-y-auto");
  });
});
