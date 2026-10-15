export type TennisParticipantId = string;

export type TennisMatchStatus = "in_progress" | "finished";

export type TennisMatchFormat =
  | "super_tiebreak"
  | "best_of_three_games";

export type TennisGamePoint = 0 | 15 | 30 | 40 | "deuce" | "advantage";

export type TennisGameStatus = "in_progress" | "finished";

export type TennisGameState = {
  participants: [TennisParticipantId, TennisParticipantId];
  points: [TennisGamePoint, TennisGamePoint];
  gamesWon: [number, number];
  status: TennisGameStatus;
  winnerId?: TennisParticipantId;
};

export type SuperTiebreakState = {
  format: "super_tiebreak";
  status: TennisMatchStatus;
  participants: [TennisParticipantId, TennisParticipantId];
  scores: [number, number];
  firstServerId: TennisParticipantId;
  serverId: TennisParticipantId;
  pointsPlayed: number;
  sidesChangedAt: number[];
  participantNames?: Record<TennisParticipantId, string>;
  winnerId?: TennisParticipantId;
};

export type TennisMatchState = {
  format: "best_of_three_games";
  status: TennisMatchStatus;
  participants: [TennisParticipantId, TennisParticipantId];
  firstServerId: TennisParticipantId;
  serverId: TennisParticipantId;
  gamesWon: [number, number];
  games: TennisGameState[];
  winnerId?: TennisParticipantId;
};

export type TennisMatch = SuperTiebreakState | TennisMatchState;

export type TennisTournamentPhase = "qualifying" | "elimination";

export type TennisTournamentStatus =
  | "setup"
  | "turn_in_progress"
  | "turn_closed"
  | "elimination_in_progress"
  | "finished";

export type TennisRankingEntry = {
  participantId: TennisParticipantId;
  wins: number;
  pointDifferential: number;
  rankingPosition?: number;
};

export type TennisTournamentState = {
  phase: TennisTournamentPhase;
  status: TennisTournamentStatus;
  participants: TennisParticipantId[];
  currentTurn: number;
  ranking: TennisRankingEntry[];
};
