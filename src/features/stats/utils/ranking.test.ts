import { describe, expect, it } from "vitest";

import type { FinishedMatch } from "../../matches/types";
import { calculateRanking } from "./ranking";

const finished = (
  id: string,
  firstName: string,
  firstScore: number,
  secondName: string,
  secondScore: number,
): FinishedMatch => ({
  id,
  gameKind: "generic",
  status: "finished",
  startedAt: "2026-08-15T10:00:00Z",
  finishedAt: "2026-08-15T10:10:00Z",
  participants: [
    { id: `${id}-1`, name: firstName, score: firstScore },
    { id: `${id}-2`, name: secondName, score: secondScore },
  ],
  result: firstScore === secondScore
    ? { type: "draw" }
    : { type: "winner", winnerId: firstScore > secondScore ? `${id}-1` : `${id}-2` },
});

describe("calculateRanking", () => {
  it("uses points, wins, score difference and name as tie-breakers", () => {
    const ranking = calculateRanking([
      finished("1", "Davi", 1, "X", 0),
      finished("2", "Davi", 0, "Y", 1),
      finished("3", "Bruno", 5, "Z", 0),
      finished("4", "Bruno", 0, "W", 1),
      finished("5", "Ana", 5, "Q", 0),
      finished("6", "Ana", 0, "R", 1),
    ]);

    expect(ranking.filter(({ name }) => ["Ana", "Bruno", "Davi"].includes(name)).map(({ name }) => name))
      .toEqual(["Ana", "Bruno", "Davi"]);
  });

  it("returns an empty ranking for empty history", () => {
    expect(calculateRanking([])).toEqual([]);
  });
});
