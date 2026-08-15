export type TournamentFormat = "single_elimination";

export type TournamentStatus = "draft" | "in_progress" | "finished";

export type TournamentParticipant = {
  id: string;
  name: string;
};

export type BracketMatchStatus = "pending" | "ready" | "finished";

export type BracketMatch = {
  id: string;
  round: number;
  position: number;
  participants: [TournamentParticipant | null, TournamentParticipant | null];
  status: BracketMatchStatus;
  winnerId?: TournamentParticipant["id"];
  /** A match can be associated with the match feature without requiring one up front. */
  matchId?: string;
  nextMatchId?: string;
  nextParticipantSlot?: 0 | 1;
};

export type BracketRound = {
  number: number;
  matches: BracketMatch[];
};

export type TournamentBracket = {
  rounds: BracketRound[];
};

export type Tournament = {
  id: string;
  name: string;
  format: TournamentFormat;
  participants: TournamentParticipant[];
  bracket: TournamentBracket | null;
  status: TournamentStatus;
  championId?: TournamentParticipant["id"];
};
