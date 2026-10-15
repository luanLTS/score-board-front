import { describe, expect, it } from "vitest";

import { generateQualifyingMatches } from "./schedule";

describe("generateQualifyingMatches", () => {
  it.each([
    [3, 3],
    [4, 6],
  ])("generates one match for each pair with %i participants", (count, expectedMatches) => {
    const participants = Array.from({ length: count }, (_, index) => `p${index + 1}`);
    const matches = generateQualifyingMatches(participants, 2);
    const pairs = matches.map(({ participants: pair }) => pair.slice().sort().join("-"));

    expect(matches).toHaveLength(expectedMatches);
    expect(new Set(pairs).size).toBe(expectedMatches);
    expect(matches.every((match) => match.status === "pending")).toBe(true);
    expect(matches[0].id).toBe("turn-2-match-1");
  });
});
