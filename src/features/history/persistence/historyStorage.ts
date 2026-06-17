import {
  createLocalStorageAdapter,
  HISTORY_STORAGE_KEYS,
  type StorageAdapter,
} from "../../../lib/storage";
import type { Match, MatchParticipant } from "../../matches/types";

export type HistoryStorage = {
  list: () => Match[];
  add: (match: Match) => void;
  clear: () => void;
};

const isParticipant = (value: unknown): value is MatchParticipant => {
  if (!value || typeof value !== "object") return false;

  const participant = value as Partial<MatchParticipant>;

  return (
    typeof participant.id === "string" &&
    typeof participant.name === "string" &&
    typeof participant.score === "number" &&
    Number.isInteger(participant.score) &&
    participant.score >= 0
  );
};

const isDateValue = (value: unknown): value is Date | string =>
  (value instanceof Date || typeof value === "string") &&
  !Number.isNaN(new Date(value).getTime());

const isMatch = (value: unknown): value is Match => {
  if (!value || typeof value !== "object") return false;

  const match = value as Partial<Match>;

  return (
    typeof match.id === "string" &&
    Array.isArray(match.participants) &&
    match.participants.length === 2 &&
    match.participants.every(isParticipant) &&
    (match.gameKind === "generic" ||
      match.gameKind === "truco" ||
      match.gameKind === "fifa") &&
    match.status === "finished" &&
    isDateValue(match.startedAt) &&
    isDateValue(match.finishedAt)
  );
};

export const parseMatchHistory = (value: unknown): Match[] => {
  if (!Array.isArray(value)) return [];
  if (!value.every(isMatch)) return [];

  return value.map((match) => ({
    ...match,
    participants: match.participants.map((participant) => ({
      ...participant,
    })) as Match["participants"],
  }));
};

export const createHistoryStorage = (
  adapter: StorageAdapter<unknown> = createLocalStorageAdapter<unknown>(
    HISTORY_STORAGE_KEYS.finishedMatchesV1,
  ),
): HistoryStorage => ({
  list: () => parseMatchHistory(adapter.load()),
  add: (match: Match) => {
    adapter.save([match, ...parseMatchHistory(adapter.load())]);
  },
  clear: () => {
    adapter.clear();
  },
});
