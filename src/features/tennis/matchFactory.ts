import {
  createLocalStorageAdapter,
  TENNIS_STORAGE_KEYS,
  type StorageAdapter,
} from "../../lib/storage";
import type { SuperTiebreakState, TennisMatchState, TennisParticipantId } from "./domain/types";

export type TennisMatchStorage = StorageAdapter<SuperTiebreakState>;

export const createSuperTiebreakMatch = (
  participants: [TennisParticipantId, TennisParticipantId],
  random: () => number = Math.random,
): SuperTiebreakState => {
  const firstServerId = random() < 0.5 ? participants[0] : participants[1];

  return {
    format: "super_tiebreak",
    status: "in_progress",
    participants,
    scores: [0, 0],
    firstServerId,
    serverId: firstServerId,
    pointsPlayed: 0,
    sidesChangedAt: [],
    startedAt: new Date(),
  };
};

export const createBestOfThreeMatch = (
  participants: [TennisParticipantId, TennisParticipantId],
  random: () => number = Math.random,
): TennisMatchState => {
  const firstServerId = random() < 0.5 ? participants[0] : participants[1];
  return {
    format: "best_of_three_games",
    status: "in_progress",
    participants,
    firstServerId,
    serverId: firstServerId,
    gamesWon: [0, 0],
    games: [{
      participants,
      points: [0, 0],
      gamesWon: [0, 0],
      status: "in_progress",
    }],
    startedAt: new Date(),
  };
};

export const parseTennisMatch = (
  value: unknown,
): SuperTiebreakState | null => {
  if (!value || typeof value !== "object") return null;
  const match = value as Partial<SuperTiebreakState>;

  if (
    match.format !== "super_tiebreak" ||
    (match.status !== "in_progress" && match.status !== "finished") ||
    !Array.isArray(match.participants) ||
    match.participants.length !== 2 ||
    !match.participants.every((participant) => typeof participant === "string") ||
    new Set(match.participants).size !== 2 ||
    !Array.isArray(match.scores) ||
    match.scores.length !== 2 ||
    !match.scores.every((score) => typeof score === "number" && Number.isInteger(score) && score >= 0) ||
    typeof match.firstServerId !== "string" ||
    typeof match.serverId !== "string" ||
    !match.participants.includes(match.firstServerId) ||
    !match.participants.includes(match.serverId) ||
    typeof match.pointsPlayed !== "number" ||
    !Number.isInteger(match.pointsPlayed) ||
    match.pointsPlayed < 0 ||
    match.pointsPlayed !== match.scores[0] + match.scores[1] ||
    !Array.isArray(match.sidesChangedAt) ||
    !match.sidesChangedAt.every((point) => typeof point === "number" && Number.isInteger(point) && point > 0 && point % 6 === 0)
  ) {
    return null;
  }

  return structuredClone(match as SuperTiebreakState);
};

export const createTennisMatchStorage = (
  adapter: StorageAdapter<unknown> = createLocalStorageAdapter<unknown>(
    TENNIS_STORAGE_KEYS.currentMatchV1,
  ),
): TennisMatchStorage => ({
  load: () => parseTennisMatch(adapter.load()),
  save: (match) => adapter.save(match),
  clear: () => adapter.clear(),
});
