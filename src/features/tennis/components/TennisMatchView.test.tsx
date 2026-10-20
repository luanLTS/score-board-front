import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import type { SuperTiebreakState, TennisMatchState } from "../domain/types";
import { TennisMatchView } from "./TennisMatchView";

const match: SuperTiebreakState = {
  format: "super_tiebreak",
  status: "in_progress",
  participants: ["ana", "bia"],
  scores: [6, 4],
  firstServerId: "ana",
  serverId: "bia",
  pointsPlayed: 10,
  sidesChangedAt: [6],
};

describe("TennisMatchView", () => {
  it("shows the super tie-break score, server, side change and point actions", () => {
    render(<TennisMatchView match={match} participantNames={{ ana: "Ana", bia: "Bia" }} onPoint={vi.fn()} />);

    expect(screen.getByRole("heading", { name: "Super tie-break" })).toBeInTheDocument();
    expect(screen.getByText("6 × 4")).toBeInTheDocument();
    expect(screen.getByText("Sacando: Bia")).toBeInTheDocument();
    expect(screen.getByText("Troca de lado após 6 pontos")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Ponto para Ana" })).toHaveClass("bg-teal-300");
    expect(screen.getByRole("button", { name: "Ponto para Bia" })).toBeInTheDocument();
  });

  it("shows a best-of-three elimination match with game score actions", () => {
    const eliminationMatch: TennisMatchState = {
      format: "best_of_three_games",
      status: "in_progress",
      participants: ["ana", "bia"],
      firstServerId: "ana",
      serverId: "ana",
      gamesWon: [1, 0],
      games: [{
        participants: ["ana", "bia"],
        points: [30, 15],
        gamesWon: [1, 0],
        status: "in_progress",
      }],
    };

    render(<TennisMatchView match={eliminationMatch} participantNames={{ ana: "Ana", bia: "Bia" }} onPoint={vi.fn()} />);

    expect(screen.getByRole("heading", { name: "Melhor de 3 games" })).toBeInTheDocument();
    expect(screen.getByText("Games: 1 × 0")).toBeInTheDocument();
    expect(screen.getByText("30 × 15")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Ponto para Ana" })).toBeInTheDocument();
  });
});
