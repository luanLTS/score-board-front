import {
  createLocalStorageAdapter,
  TENNIS_STORAGE_KEYS,
  type StorageAdapter,
} from "../../../lib/storage";
import type {
  TennisQualifyingMatch,
  TennisTournamentState,
} from "../tournament/types";

export type TennisTournamentStorage = StorageAdapter<TennisTournamentState>;

const statuses = new Set<TennisTournamentState["status"]>([
  "setup",
  "turn_in_progress",
  "turn_closed",
  "elimination_in_progress",
  "finished",
]);

const isMatch = (value: unknown): value is TennisQualifyingMatch => {
  if (!value || typeof value !== "object") return false;
  const match = value as Partial<TennisQualifyingMatch>;
  return (
    typeof match.id === "string" &&
    match.format === "super_tiebreak" &&
    Array.isArray(match.participants) &&
    match.participants.length === 2 &&
    match.participants.every((participant) => typeof participant === "string") &&
    (match.status === "pending" || match.status === "finished") &&
    (match.scores === undefined || (
      Array.isArray(match.scores) &&
      match.scores.length === 2 &&
      match.scores.every((score) => typeof score === "number" && Number.isInteger(score) && score >= 0)
    )) &&
    (match.winnerId === undefined || typeof match.winnerId === "string")
  );
};

export const parseTennisTournament = (
  value: unknown,
): TennisTournamentState | null => {
  if (!value || typeof value !== "object") return null;
  const tournament = value as Partial<TennisTournamentState>;
  if (
    typeof tournament.id !== "string" ||
    typeof tournament.name !== "string" ||
    tournament.name.trim().length === 0 ||
    tournament.phase !== "qualifying" && tournament.phase !== "elimination" ||
    !statuses.has(tournament.status as TennisTournamentState["status"]) ||
    !Array.isArray(tournament.participants) ||
    tournament.participants.length < 2 ||
    !tournament.participants.every((participant) => Boolean(participant) && typeof participant.id === "string" && typeof participant.name === "string") ||
    !Array.isArray(tournament.turns) ||
    !tournament.turns.every((turn) => Boolean(turn) && typeof turn.number === "number" && (turn.status === "in_progress" || turn.status === "closed") && Array.isArray(turn.matches) && turn.matches.every(isMatch)) ||
    !Array.isArray(tournament.ranking) ||
    !tournament.ranking.every((entry) => Boolean(entry) && typeof entry.participantId === "string" && typeof entry.wins === "number" && typeof entry.pointDifferential === "number") ||
    typeof tournament.currentTurn !== "number" ||
    !Number.isInteger(tournament.currentTurn) ||
    tournament.currentTurn < 0
  ) return null;

  return structuredClone(tournament as TennisTournamentState);
};

export const createTennisTournamentStorage = (
  adapter: StorageAdapter<unknown> = createLocalStorageAdapter<unknown>(
    TENNIS_STORAGE_KEYS.currentTournamentV1,
  ),
): TennisTournamentStorage => ({
  load: () => parseTennisTournament(adapter.load()),
  save: (tournament) => adapter.save(tournament),
  clear: () => adapter.clear(),
});
