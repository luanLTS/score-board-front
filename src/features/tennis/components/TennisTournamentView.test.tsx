import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

import type { TennisTournamentState } from "../tournament/types";
import { TennisTournamentView } from "./TennisTournamentView";

const tournament: TennisTournamentState = {
  id: "t1",
  name: "Copa local",
  phase: "qualifying",
  status: "turn_closed",
  participants: [
    { id: "ana", name: "Ana" },
    { id: "bia", name: "Bia" },
  ],
  currentTurn: 1,
  turns: [{
    number: 1,
    status: "closed",
    matches: [{
      id: "m1",
      format: "super_tiebreak",
      participants: ["ana", "bia"],
      status: "finished",
      scores: [10, 8],
      winnerId: "ana",
    }],
  }],
  ranking: [
    { participantId: "ana", wins: 1, pointDifferential: 2, position: 1 },
    { participantId: "bia", wins: 0, pointDifferential: -2, position: 2 },
  ],
};

describe("TennisTournamentView", () => {
  it("shows ranking and allows choosing the next phase", async () => {
    const user = userEvent.setup();
    const onStartNextTurn = vi.fn();
    const onStartElimination = vi.fn();

    render(
      <TennisTournamentView
        onCloseTurn={vi.fn()}
        onStartElimination={onStartElimination}
        onStartNextTurn={onStartNextTurn}
        onStartTurn={vi.fn()}
        tournament={tournament}
      />,
    );

    expect(screen.getByRole("heading", { name: "Copa local" })).toBeInTheDocument();
    expect(screen.getByText("Ranking acumulado")).toBeInTheDocument();
    expect(screen.queryAllByRole("heading", { name: "Chaveamento" })).toHaveLength(0);
    expect(screen.getAllByText(/Ana/).length).toBeGreaterThan(0);
    expect(screen.getByText("Turno 1")).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: "Jogar próximo turno" }));
    await user.click(screen.getByRole("button", { name: "Ir para eliminatórias" }));

    expect(onStartNextTurn).toHaveBeenCalledOnce();
    expect(onStartElimination).toHaveBeenCalledOnce();
  });

  it("offers ready elimination matches to play", async () => {
    const user = userEvent.setup();
    const onPlayEliminationMatch = vi.fn();
    const eliminationTournament: TennisTournamentState = {
      ...tournament,
      phase: "elimination",
      status: "elimination_in_progress",
      eliminationBracket: {
        rounds: [{
          number: 1,
          matches: [{
            id: "tennis-round-1-match-1",
            round: 1,
            position: 0,
            participants: [{ id: "ana", name: "Ana" }, { id: "bia", name: "Bia" }],
            status: "ready",
          }],
        }],
      },
    };

    render(
      <TennisTournamentView
        onCloseTurn={vi.fn()}
        onPlayEliminationMatch={onPlayEliminationMatch}
        onStartElimination={vi.fn()}
        onStartNextTurn={vi.fn()}
        onStartTurn={vi.fn()}
        tournament={eliminationTournament}
      />,
    );

    expect(screen.getAllByRole("heading", { name: "Chaveamento" })).toHaveLength(1);

    await user.click(screen.getByRole("button", { name: "Jogar confronto" }));

    expect(onPlayEliminationMatch).toHaveBeenCalledWith(expect.objectContaining({ id: "tennis-round-1-match-1" }));
  });
});
