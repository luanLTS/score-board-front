import {
  createLocalStorageAdapter,
  HISTORY_STORAGE_KEYS,
  type StorageAdapter,
} from "../../../lib/storage";
import type { FinishedMatch, MatchParticipant } from "../../matches/types";

export type HistoryStorage = {
  list: () => FinishedMatch[];
  add: (match: FinishedMatch) => void;
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

const hasValidResult = (match: Partial<FinishedMatch>): boolean => {
  if (match.result === undefined) {
    return match.winnerId === undefined ||
      (typeof match.winnerId === "string" && match.participants?.some(({ id }) => id === match.winnerId) === true);
  }

  if (match.result.type === "draw") return match.winnerId === undefined;

  if (match.result.type !== "winner") return false;

  const winnerId = match.result.winnerId;
  return (
    typeof winnerId === "string" &&
    match.participants?.some((participant) => participant.id === winnerId) ===
      true &&
    (match.winnerId === undefined || match.winnerId === winnerId)
  );
};

const isMatch = (value: unknown): value is FinishedMatch => {
  if (!value || typeof value !== "object") return false;

  const match = value as Partial<FinishedMatch>;

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
    isDateValue(match.finishedAt) &&
    hasValidResult(match)
  );
};

export const parseMatchHistory = (value: unknown): FinishedMatch[] => {
  if (!Array.isArray(value)) return [];
  if (!value.every(isMatch)) return [];

  return value.map((match) => {
    const [first, second] = match.participants;
    const legacyWinnerId = match.winnerId ??
      (first.score === second.score
        ? undefined
        : first.score > second.score ? first.id : second.id);

    return {
      ...match,
      result: match.result ?? (legacyWinnerId
        ? { type: "winner" as const, winnerId: legacyWinnerId }
        : { type: "draw" as const }),
      participants: match.participants.map((participant) => ({
        ...participant,
      })) as FinishedMatch["participants"],
    };
  });
};

export const createHistoryStorage = (
  adapter: StorageAdapter<unknown> = createLocalStorageAdapter<unknown>(
    HISTORY_STORAGE_KEYS.finishedMatchesV1,
  ),
): HistoryStorage => ({
  list: () => parseMatchHistory(adapter.load()),
  add: (match: FinishedMatch) => {
    adapter.save([match, ...parseMatchHistory(adapter.load())]);
  },
  clear: () => {
    adapter.clear();
  },
});
