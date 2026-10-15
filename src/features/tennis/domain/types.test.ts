import { describe, expect, it } from "vitest";

import type {
  TennisGameState,
  TennisMatchState,
  TennisTournamentState,
  SuperTiebreakState,
} from "./types";

describe("tennis domain types", () => {
  it("represents a super tie-break and an elimination match without ambiguous state", () => {
    const superTiebreak: SuperTiebreakState = {
      format: "super_tiebreak",
      status: "in_progress",
      participants: ["ana", "bia"],
      scores: [9, 9],
      firstServerId: "ana",
      serverId: "bia",
      pointsPlayed: 18,
      sidesChangedAt: [6, 12, 18],
    };
    const game: TennisGameState = {
      participants: ["ana", "bia"],
      points: ["deuce", "deuce"],
      gamesWon: [1, 0],
      status: "in_progress",
    };
    const match: TennisMatchState = {
      format: "best_of_three_games",
      status: "in_progress",
      participants: ["ana", "bia"],
      firstServerId: "bia",
      serverId: "ana",
      gamesWon: [1, 0],
      games: [game],
    };
    const tournament: TennisTournamentState = {
      phase: "qualifying",
      status: "turn_in_progress",
      participants: ["ana", "bia"],
      currentTurn: 1,
      ranking: [],
    };

    expect(superTiebreak.scores).toEqual([9, 9]);
    expect(match.games[0].status).toBe("in_progress");
    expect(tournament.currentTurn).toBe(1);
  });
});
