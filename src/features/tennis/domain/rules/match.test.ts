import { describe, expect, it } from "vitest";

import type { TennisMatchState } from "../types";
import { advanceBestOfThree } from "./match";

const match = (gamesWon: [number, number]): TennisMatchState => ({
  format: "best_of_three_games",
  status: "in_progress",
  participants: ["ana", "bia"],
  firstServerId: "ana",
  serverId: "ana",
  gamesWon,
  games: [
    {
      participants: ["ana", "bia"],
      points: [40, 0],
      gamesWon,
      status: "in_progress",
    },
  ],
});

describe("advanceBestOfThree", () => {
  it("starts the next game after a game is won", () => {
    const result = advanceBestOfThree(match([0, 0]), "ana");

    expect(result).toMatchObject({ gamesWon: [1, 0], status: "in_progress" });
    expect(result.games).toHaveLength(2);
    expect(result.games[1].points).toEqual([0, 0]);
  });

  it("finishes when a participant wins two games", () => {
    const result = advanceBestOfThree(match([1, 0]), "ana");

    expect(result).toMatchObject({
      gamesWon: [2, 0],
      status: "finished",
      winnerId: "ana",
    });
  });
});
