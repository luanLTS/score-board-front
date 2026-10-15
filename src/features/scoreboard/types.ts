/**
 * Legacy discriminator kept in persisted scoreboard and match records.
 * The generic scoreboard no longer exposes this selector; sport-specific
 * rules belong to their own workspace while old records remain readable.
 */
export type GameKind = "generic" | "truco" | "fifa";

export type ScoreboardConfig = {
  gameKind: GameKind;
  minScore: number;
  maxScore?: number;
  allowNegativeScore: boolean;
};

export type ScoreboardPlayerId = string;

export type ScoreboardPlayer = {
  id: ScoreboardPlayerId;
  name: string;
  score: number;
};

export type ScoreboardState = {
  gameKind: GameKind;
  players: [ScoreboardPlayer, ScoreboardPlayer];
};
