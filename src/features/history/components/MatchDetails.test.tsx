import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import type { FinishedMatch } from "../../matches/types";

import { MatchDetails } from "./MatchDetails";

const match = {
  id: "match-1",
  gameKind: "truco",
  status: "finished",
  startedAt: "2026-06-15T20:00:00.000Z",
  finishedAt: "2026-06-15T20:35:00.000Z",
  participants: [
    { id: "ana", name: "Ana", score: 12 },
    { id: "bruno", name: "Bruno", score: 8 },
  ],
  winnerId: "ana",
  result: { type: "winner", winnerId: "ana" },
} as FinishedMatch;

describe("MatchDetails", () => {
  it("renders an empty state when no match is selected", () => {
    render(<MatchDetails match={null} />);

    expect(screen.getByText("Selecione uma partida")).toBeInTheDocument();
  });

  it("renders participants, score, type, finished status, start, and finish times", () => {
    render(<MatchDetails match={match} />);

    expect(screen.getByRole("heading", { name: "Ana x Bruno" }))
      .toBeInTheDocument();
    expect(screen.getByLabelText("Placar final")).toHaveTextContent("12 x 8");
    expect(screen.getByText("Truco")).toBeInTheDocument();
    expect(screen.getByText("Finalizada")).toBeInTheDocument();
    expect(screen.getByText("Vencedor: Ana")).toBeInTheDocument();
    expect(screen.getByText("15/06/2026 17:00")).toBeInTheDocument();
    expect(screen.getByText("15/06/2026 17:35")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Compartilhar resultado" })).toBeVisible();
  });

  it("renders an explicit draw result", () => {
    render(
      <MatchDetails
        match={{
          ...match,
          participants: [
            { id: "ana", name: "Ana", score: 3 },
            { id: "bruno", name: "Bruno", score: 3 },
          ],
          winnerId: undefined,
          result: { type: "draw" },
        }}
      />,
    );

    expect(screen.getByText("Empate")).toBeInTheDocument();
  });
});
