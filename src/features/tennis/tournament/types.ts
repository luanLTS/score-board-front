export type TennisTournamentParticipant = {
  id: string;
  name: string;
};

export type TennisQualifyingMatchStatus = "pending" | "finished";

export type TennisQualifyingMatch = {
  id: string;
  format: "super_tiebreak";
  participants: [string, string];
  status: TennisQualifyingMatchStatus;
  scores?: [number, number];
  winnerId?: string;
};

export type TennisQualifyingTurn = {
  number: number;
  status: "in_progress" | "closed";
  matches: TennisQualifyingMatch[];
};

export type TennisTournamentRankingEntry = {
  participantId: string;
  wins: number;
  pointDifferential: number;
  drawOrder?: number;
  position?: number;
};

export type TennisTournamentState = {
  id: string;
  name: string;
  phase: "qualifying" | "elimination";
  status:
    | "setup"
    | "turn_in_progress"
    | "turn_closed"
    | "elimination_in_progress"
    | "finished";
  participants: TennisTournamentParticipant[];
  currentTurn: number;
  turns: TennisQualifyingTurn[];
  ranking: TennisTournamentRankingEntry[];
  eliminationBracket?: TournamentBracket;
  activeMatch?: TennisMatch;
  activeMatchId?: string;
};
import type { TournamentBracket } from "../../tournaments/types";

import type { TennisMatch } from "../domain/types";

