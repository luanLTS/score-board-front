import type { GameKind, ScoreboardConfig } from "../types";

export const DEFAULT_GAME_RULES = {
  generic: {
    gameKind: "generic",
    minScore: 0,
    allowNegativeScore: false,
  },
  truco: {
    gameKind: "truco",
    minScore: 0,
    maxScore: 12,
    allowNegativeScore: false,
  },
  fifa: {
    gameKind: "fifa",
    minScore: 0,
    allowNegativeScore: false,
  },
} satisfies Record<GameKind, ScoreboardConfig>;
