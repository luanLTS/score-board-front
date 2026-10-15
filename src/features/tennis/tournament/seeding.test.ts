import { describe, expect, it } from "vitest";

import { generateTennisEliminationPairings } from "./seeding";

describe("generateTennisEliminationPairings", () => {
  it.each([3, 4, 5, 6, 8])("pairs the best-ranked participant with the worst for %i participants", (count) => {
    const ranking = Array.from({ length: count }, (_, index) => `p${index + 1}`);
    const pairings = generateTennisEliminationPairings(ranking);

    expect(pairings[0]).toEqual({ format: "best_of_three_games", participants: ["p1", `p${count}`], bye: false });
    expect(pairings.every(({ participants }) => participants.filter(Boolean).length > 0)).toBe(true);
    expect(new Set(pairings.flatMap(({ participants }) => participants.filter(Boolean))).size).toBe(count);
  });

  it("uses a bye for the middle participant when the count is odd", () => {
    expect(generateTennisEliminationPairings(["p1", "p2", "p3"])).toEqual([
      { format: "best_of_three_games", participants: ["p1", "p3"], bye: false },
      { format: "best_of_three_games", participants: ["p2", null], bye: true },
    ]);
  });
});
