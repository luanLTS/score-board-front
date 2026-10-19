import {
  createLocalStorageAdapter,
  TENNIS_STORAGE_KEYS,
  type StorageAdapter,
} from "../../../lib/storage";
import type { SuperTiebreakState, TennisMatchState, TennisParticipantId } from "../domain/types";
import type { FinishedMatch } from "../../matches/types";

export type TennisHistoryFormat = "super_tiebreak" | "best_of_three_games";

export type TennisHistoryParticipant = {
  id: string;
  name: string;
};

export type TennisHistoryRecord = {
  id: string;
  format: TennisHistoryFormat;
  participants: [TennisHistoryParticipant, TennisHistoryParticipant];
  finalScore: [number, number];
  firstServerId: string;
  winnerId: string;
  startedAt: Date | string;
  finishedAt: Date | string;
  source?: "simple" | "qualifying" | "elimination";
  tournamentId?: string;
  tournamentName?: string;
  roundLabel?: string;
  games?: Array<{ score: [number, number]; points: [string, string] }>;
};

export type TennisHistoryStorage = {
  list: () => TennisHistoryRecord[];
  add: (record: TennisHistoryRecord) => void;
  clear: () => void;
};

type CreateTennisHistoryRecordInput = {
  id: string;
  match: SuperTiebreakState;
  participantNames: Record<TennisParticipantId, string>;
  startedAt: Date | string;
  finishedAt: Date | string;
};

type CreateTournamentTennisHistoryRecordInput = {
  id: string;
  match: SuperTiebreakState | TennisMatchState;
  participantNames: Record<TennisParticipantId, string>;
  startedAt?: Date | string;
  finishedAt: Date | string;
  source: "qualifying" | "elimination";
  tournamentId: string;
  tournamentName: string;
  roundLabel: string;
};

export const createTennisHistoryRecord = ({
  id,
  match,
  participantNames,
  startedAt,
  finishedAt,
}: CreateTennisHistoryRecordInput): TennisHistoryRecord => {
  if (match.status !== "finished" || !match.winnerId) {
    throw new Error("A partida de tênis precisa estar finalizada para entrar no histórico.");
  }

  return {
    id,
    format: match.format,
    participants: match.participants.map((participantId) => ({
      id: participantId,
      name: participantNames[participantId],
    })) as TennisHistoryRecord["participants"],
    finalScore: match.scores,
    firstServerId: match.firstServerId,
    winnerId: match.winnerId,
    startedAt,
    finishedAt,
    source: "simple",
  };
};

export const createTournamentTennisHistoryRecord = ({
  id, match, participantNames, startedAt, finishedAt, source, tournamentId, tournamentName, roundLabel,
}: CreateTournamentTennisHistoryRecordInput): TennisHistoryRecord => {
  if (match.status !== "finished" || !match.winnerId) throw new Error("A partida precisa estar finalizada.");
  const isSuper = match.format === "super_tiebreak";
  return {
    id,
    format: match.format,
    participants: match.participants.map((participantId) => ({ id: participantId, name: participantNames[participantId] ?? participantId })) as TennisHistoryRecord["participants"],
    finalScore: isSuper ? match.scores : match.gamesWon,
    firstServerId: match.firstServerId,
    winnerId: match.winnerId,
    startedAt: startedAt ?? match.startedAt ?? finishedAt,
    finishedAt,
    source,
    tournamentId,
    tournamentName,
    roundLabel,
    ...(!isSuper ? { games: match.games.map((game) => ({ score: game.gamesWon, points: game.points.map(String) as [string, string] })) } : {}),
  };
};

export const tennisHistoryToFinishedMatch = (record: TennisHistoryRecord): FinishedMatch => ({
  id: record.id,
  status: "finished",
  gameKind: "generic",
  participants: record.participants.map((participant, index) => ({ ...participant, score: record.finalScore[index as 0 | 1] })) as FinishedMatch["participants"],
  startedAt: record.startedAt,
  finishedAt: record.finishedAt,
  winnerId: record.winnerId,
  result: { type: "winner", winnerId: record.winnerId },
});

const isDateValue = (value: unknown): value is Date | string =>
  (value instanceof Date || typeof value === "string") &&
  !Number.isNaN(new Date(value).getTime());

const isParticipant = (value: unknown): value is TennisHistoryParticipant => {
  if (!value || typeof value !== "object") return false;
  const participant = value as Partial<TennisHistoryParticipant>;
  return (
    typeof participant.id === "string" &&
    participant.id.length > 0 &&
    typeof participant.name === "string" &&
    participant.name.trim().length > 0
  );
};

const isRecord = (value: unknown): value is TennisHistoryRecord => {
  if (!value || typeof value !== "object") return false;
  const record = value as Partial<TennisHistoryRecord>;
  return (
    typeof record.id === "string" &&
    (record.format === "super_tiebreak" || record.format === "best_of_three_games") &&
    Array.isArray(record.participants) &&
    record.participants.length === 2 &&
    record.participants.every(isParticipant) &&
    new Set(record.participants.map((participant) => participant.id)).size === 2 &&
    Array.isArray(record.finalScore) &&
    record.finalScore.length === 2 &&
    record.finalScore.every((score) => typeof score === "number" && Number.isInteger(score) && score >= 0) &&
    typeof record.firstServerId === "string" &&
    record.participants.some((participant) => participant.id === record.firstServerId) &&
    typeof record.winnerId === "string" &&
    record.participants.some((participant) => participant.id === record.winnerId) &&
    isDateValue(record.startedAt) &&
    isDateValue(record.finishedAt)
    && (record.source === undefined || ["simple", "qualifying", "elimination"].includes(record.source))
    && (record.tournamentId === undefined || typeof record.tournamentId === "string")
    && (record.tournamentName === undefined || typeof record.tournamentName === "string")
    && (record.roundLabel === undefined || typeof record.roundLabel === "string")
    && (record.games === undefined || (Array.isArray(record.games) && record.games.every((game) => Array.isArray(game.score) && game.score.length === 2 && Array.isArray(game.points) && game.points.length === 2)))
  );
};

export const parseTennisHistory = (value: unknown): TennisHistoryRecord[] => {
  if (!Array.isArray(value) || !value.every(isRecord)) return [];
  return structuredClone(value);
};

export const createTennisHistoryStorage = (
  adapter: StorageAdapter<unknown> = createLocalStorageAdapter<unknown>(
    TENNIS_STORAGE_KEYS.matchHistoryV1,
  ),
): TennisHistoryStorage => ({
  list: () => parseTennisHistory(adapter.load()),
  add: (record) => {
    const records = parseTennisHistory(adapter.load());
    if (!records.some(({ id }) => id === record.id)) adapter.save([record, ...records]);
  },
  clear: () => adapter.clear(),
});
