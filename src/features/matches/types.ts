import type { GameKind, ScoreboardPlayerId } from "../scoreboard/types";

export type MatchParticipant = {
  id: ScoreboardPlayerId | string;
  name: string;
  score: number;
};

export type Match = {
  id: string;
  participants: [MatchParticipant, MatchParticipant];
  gameKind: GameKind;
  status: "finished";
  startedAt: Date | string;
  finishedAt: Date | string;
  winnerId?: MatchParticipant["id"];
};
