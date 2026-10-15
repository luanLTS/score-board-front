import { describe, expect, it } from "vitest";

import type { TennisGameState } from "../types";
import { advanceTennisGame } from "./game";

const game = (points: TennisGameState["points"]): TennisGameState => ({
  participants: ["ana", "bia"],
  points,
  gamesWon: [0, 0],
  status: "in_progress",
});

describe("advanceTennisGame", () => {
  it("progresses points from love to 40", () => {
    let current = game([0, 0]);
    current = advanceTennisGame(current, "ana");
    current = advanceTennisGame(current, "ana");
    current = advanceTennisGame(current, "ana");

    expect(current.points).toEqual([40, 0]);
    expect(current.status).toBe("in_progress");
  });

  it("enters deuce and requires advantage", () => {
    let current = game([40, 40]);
    current = advanceTennisGame(current, "ana");

    expect(current.points).toEqual(["advantage", 40]);
    current = advanceTennisGame(current, "bia");
    expect(current.points).toEqual(["deuce", "deuce"]);
  });

  it("finishes the game from advantage", () => {
    const result = advanceTennisGame(game(["advantage", 40]), "ana");

    expect(result).toMatchObject({
      status: "finished",
      winnerId: "ana",
    });
  });
});
