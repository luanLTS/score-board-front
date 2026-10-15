import {
  createLocalStorageAdapter,
  TENNIS_STORAGE_KEYS,
  type StorageAdapter,
} from "../../../lib/storage";
import type { SuperTiebreakState, TennisParticipantId } from "../domain/types";

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
  };
};

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
  add: (record) => adapter.save([record, ...parseTennisHistory(adapter.load())]),
  clear: () => adapter.clear(),
});
