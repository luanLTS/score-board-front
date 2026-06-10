import { describe, expect, it } from "vitest";

import { getGameRules } from "./getGameRules";

describe("getGameRules", () => {
  it("returns the configured rules for a known game kind", () => {
    expect(getGameRules("truco")).toEqual({
      gameKind: "truco",
      minScore: 0,
      maxScore: 12,
      allowNegativeScore: false,
    });
  });

  it("falls back to generic rules for an unknown game kind", () => {
    expect(getGameRules("unknown-game")).toEqual({
      gameKind: "generic",
      minScore: 0,
      allowNegativeScore: false,
    });
  });

  it("falls back to generic rules for inherited object keys", () => {
    expect(getGameRules("toString")).toEqual({
      gameKind: "generic",
      minScore: 0,
      allowNegativeScore: false,
    });
  });
});
