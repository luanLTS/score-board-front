import type { GameKind, ScoreboardPlayerId } from "../scoreboard/types";

export type MatchStatus = "pending" | "in_progress" | "finished";

export type MatchParticipant = {
  id: ScoreboardPlayerId | string;
  name: string;
  score: number;
};

export type MatchResult =
  | { type: "winner"; winnerId: MatchParticipant["id"] }
  | { type: "draw" };

type MatchBase = {
  id: string;
  participants: [MatchParticipant, MatchParticipant];
  gameKind: GameKind;
  /** Optional for compatibility with matches saved before the lifecycle existed. */
  createdAt?: Date | string;
};

export type PendingMatch = MatchBase & {
  status: "pending";
};

export type InProgressMatch = MatchBase & {
  status: "in_progress";
  startedAt: Date | string;
};

export type FinishedMatch = MatchBase & {
  status: "finished";
  startedAt: Date | string;
  finishedAt: Date | string;
  /** Kept as a denormalized field for backwards compatibility with history v1. */
  winnerId?: MatchParticipant["id"];
  /** Optional because history v1 entries did not persist an explicit result. */
  result?: MatchResult;
};

export type Match = PendingMatch | InProgressMatch | FinishedMatch;

export type NewMatchParticipant = Pick<MatchParticipant, "id" | "name">;

export type CreateMatchInput = {
  gameKind: GameKind;
  participants: readonly [NewMatchParticipant, NewMatchParticipant];
};
