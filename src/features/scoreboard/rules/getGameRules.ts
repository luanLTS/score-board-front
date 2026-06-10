import type { GameKind, ScoreboardConfig } from "../types";

import { DEFAULT_GAME_RULES } from "./gameRules";

const isGameKind = (gameKind: string): gameKind is GameKind =>
  Object.hasOwn(DEFAULT_GAME_RULES, gameKind);

export const getGameRules = (gameKind: GameKind | string): ScoreboardConfig => {
  if (isGameKind(gameKind)) {
    return DEFAULT_GAME_RULES[gameKind];
  }

  return DEFAULT_GAME_RULES.generic;
};
