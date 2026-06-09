export type ScoreboardPlayerId = "player-1" | "player-2";

export type ScoreboardPlayer = {
  id: ScoreboardPlayerId;
  name: string;
  score: number;
};

export type ScoreboardState = {
  players: [ScoreboardPlayer, ScoreboardPlayer];
};
