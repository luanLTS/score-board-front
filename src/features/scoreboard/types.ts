export type GameKind = "generic" | "truco" | "fifa";

export type ScoreboardConfig = {
  gameKind: GameKind;
  minScore: number;
  maxScore?: number;
  allowNegativeScore: boolean;
};

export type ScoreboardPlayerId = "player-1" | "player-2";

export type ScoreboardPlayer = {
  id: ScoreboardPlayerId;
  name: string;
  score: number;
};

export type ScoreboardState = {
  gameKind: GameKind;
  players: [ScoreboardPlayer, ScoreboardPlayer];
};
