import { describe, expect, it } from "vitest";

import { DEFAULT_GAME_RULES } from "./gameRules";
import type { GameKind, ScoreboardConfig } from "../types";

describe("game rules", () => {
  it("registers an explicit initial config for every known game kind", () => {
    const expectedGameKinds: GameKind[] = ["generic", "truco", "fifa"];
    const configsByGameKind: Record<GameKind, ScoreboardConfig> =
      DEFAULT_GAME_RULES;

    expect(Object.keys(configsByGameKind).sort()).toEqual(
      [...expectedGameKinds].sort(),
    );
  });

  it("keeps generic scoring uncapped and non-negative by default", () => {
    expect(DEFAULT_GAME_RULES.generic).toEqual({
      gameKind: "generic",
      minScore: 0,
      allowNegativeScore: false,
    });
  });

  it("starts truco with a simple 12 point cap", () => {
    expect(DEFAULT_GAME_RULES.truco).toEqual({
      gameKind: "truco",
      minScore: 0,
      maxScore: 12,
      allowNegativeScore: false,
    });
  });

  it("starts fifa scoring uncapped and non-negative", () => {
    expect(DEFAULT_GAME_RULES.fifa).toEqual({
      gameKind: "fifa",
      minScore: 0,
      allowNegativeScore: false,
    });
  });
});
