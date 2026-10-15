import { describe, expect, it } from "vitest";

import { calculateTennisRanking } from "./ranking";
import type { TennisQualifyingTurn } from "./types";

const turns: TennisQualifyingTurn[] = [{
  number: 1,
  status: "closed",
  matches: [
    { id: "m1", format: "super_tiebreak", participants: ["ana", "bia"], status: "finished", scores: [10, 8], winnerId: "ana" },
    { id: "m2", format: "super_tiebreak", participants: ["ana", "cai"], status: "finished", scores: [10, 9], winnerId: "ana" },
    { id: "m3", format: "super_tiebreak", participants: ["bia", "cai"], status: "finished", scores: [10, 8], winnerId: "bia" },
  ],
}];

describe("calculateTennisRanking", () => {
  it("accumulates wins and total point differential across turns", () => {
    const ranking = calculateTennisRanking(["ana", "bia", "cai"], turns);

    expect(ranking.map(({ participantId, wins, pointDifferential }) => ({ participantId, wins, pointDifferential }))).toEqual([
      { participantId: "ana", wins: 2, pointDifferential: 3 },
      { participantId: "bia", wins: 1, pointDifferential: 0 },
      { participantId: "cai", wins: 0, pointDifferential: -3 },
    ]);
  });

  it("uses direct confrontation after wins and saldo are tied", () => {
    const ranking = calculateTennisRanking(
      ["ana", "bia", "cai"],
      [{ number: 1, status: "closed", matches: [
        { id: "m1", format: "super_tiebreak", participants: ["ana", "bia"], status: "finished", scores: [10, 8], winnerId: "ana" },
        { id: "m2", format: "super_tiebreak", participants: ["bia", "cai"], status: "finished", scores: [10, 8], winnerId: "bia" },
        { id: "m3", format: "super_tiebreak", participants: ["cai", "ana"], status: "finished", scores: [10, 8], winnerId: "cai" },
      ] }],
    );

    expect(ranking[0].participantId).toBe("ana");
  });

  it("records a random draw when all previous criteria are tied", () => {
    const values = [0.8, 0.2];
    const ranking = calculateTennisRanking(
      ["ana", "bia"],
      [],
      () => values.shift() ?? 0,
    );

    expect(ranking[0]).toMatchObject({ participantId: "bia", drawOrder: expect.any(Number) });
    expect(ranking[1]).toMatchObject({ participantId: "ana", drawOrder: expect.any(Number) });
    expect(ranking[0].drawOrder).not.toBe(ranking[1].drawOrder);
  });

  it("preserves a previous draw order when the ranking is recalculated", () => {
    const first = calculateTennisRanking(["ana", "bia"], [], () => 0.2);
    const second = calculateTennisRanking(["ana", "bia"], [], () => 0.9, first);

    expect(second.map((entry) => entry.participantId)).toEqual(first.map((entry) => entry.participantId));
  });
});
