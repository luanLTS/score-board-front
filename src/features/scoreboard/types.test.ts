import { describe, expect, it } from "vitest";

import type { GameKind, ScoreboardConfig } from "./types";

describe("scoreboard domain types", () => {
  it("represents configurable score rules without React", () => {
    const knownGameKinds: GameKind[] = ["generic", "truco", "fifa"];
    const genericConfig: ScoreboardConfig = {
      gameKind: "generic",
      minScore: 0,
      allowNegativeScore: false,
    };
    const cappedConfig: ScoreboardConfig = {
      gameKind: "truco",
      minScore: 0,
      maxScore: 12,
      allowNegativeScore: false,
    };

    expect(knownGameKinds).toEqual(["generic", "truco", "fifa"]);
    expect(genericConfig.maxScore).toBeUndefined();
    expect(cappedConfig.maxScore).toBe(12);
  });
});
