import { describe, expect, it } from "vitest";

import type { FinishedMatch } from "../../matches/types";
import { calculatePlayerStats, getPlayerStats, normalizePlayerName } from "./playerStats";

const match = (
  id: string,
  first: [string, string, number],
  second: [string, string, number],
): FinishedMatch => ({
  id,
  gameKind: "generic",
  status: "finished",
  startedAt: "2026-08-15T10:00:00.000Z",
  finishedAt: "2026-08-15T10:10:00.000Z",
  participants: [
    { id: first[0], name: first[1], score: first[2] },
    { id: second[0], name: second[1], score: second[2] },
  ],
  result: first[2] === second[2]
    ? { type: "draw" }
    : { type: "winner", winnerId: first[2] > second[2] ? first[0] : second[0] },
});

describe("calculatePlayerStats", () => {
  it("calculates games, results, score totals and success rate", () => {
    const matches = [
      match("1", ["ana-1", "Ana", 10], ["bia-1", "Bia", 5]),
      match("2", ["ana-2", "ANA", 2], ["caio", "Caio", 2]),
      match("3", ["bia-2", "Bia", 8], ["ana-3", "ana", 3]),
    ];

    expect(getPlayerStats(matches, "  aNa ")).toEqual({
      playerKey: "ana",
      name: "Ana",
      games: 3,
      wins: 1,
      draws: 1,
      losses: 1,
      pointsFor: 15,
      pointsAgainst: 15,
      scoreDifference: 0,
      rankingPoints: 4,
      successRate: 4 / 9 * 100,
    });
  });

  it("returns an empty collection for empty history and ignores blank names", () => {
    expect(calculatePlayerStats([])).toEqual([]);
    expect(calculatePlayerStats([
      match("1", ["blank", "   ", 1], ["ana", "Ana", 0]),
    ])).toHaveLength(1);
    expect(getPlayerStats([], "Ana")).toBeUndefined();
  });

  it("normalizes external whitespace and casing while preserving the first display name", () => {
    expect(normalizePlayerName("  ÁLVARO ")).toBe("álvaro");
    const stats = calculatePlayerStats([
      match("1", ["1", "  Álvaro ", 1], ["2", "Bia", 0]),
      match("2", ["3", "ÁLVARO", 1], ["4", "Caio", 0]),
    ]);

    expect(stats.find(({ playerKey }) => playerKey === "álvaro")?.name).toBe("Álvaro");
  });
});
