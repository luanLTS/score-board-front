import {
  createLocalStorageAdapter,
  TOURNAMENT_STORAGE_KEYS,
  type StorageAdapter,
} from "../../../lib/storage";
import type {
  BracketMatch,
  Tournament,
  TournamentParticipant,
} from "../types";

export type TournamentStorage = StorageAdapter<Tournament>;

const isParticipant = (value: unknown): value is TournamentParticipant => {
  if (!value || typeof value !== "object") return false;
  const participant = value as Partial<TournamentParticipant>;
  return typeof participant.id === "string" && typeof participant.name === "string";
};

const isBracketMatch = (value: unknown): value is BracketMatch => {
  if (!value || typeof value !== "object") return false;
  const match = value as Partial<BracketMatch>;
  return (
    typeof match.id === "string" &&
    typeof match.round === "number" &&
    Number.isInteger(match.round) &&
    match.round >= 1 &&
    typeof match.position === "number" &&
    Number.isInteger(match.position) &&
    match.position >= 0 &&
    Array.isArray(match.participants) &&
    match.participants.length === 2 &&
    match.participants.every((participant) => participant === null || isParticipant(participant)) &&
    (match.status === "pending" || match.status === "ready" || match.status === "finished") &&
    (match.winnerId === undefined || typeof match.winnerId === "string") &&
    (match.matchId === undefined || typeof match.matchId === "string") &&
    (match.nextMatchId === undefined || typeof match.nextMatchId === "string") &&
    (match.nextParticipantSlot === undefined || match.nextParticipantSlot === 0 || match.nextParticipantSlot === 1)
  );
};

export const parseTournament = (value: unknown): Tournament | null => {
  if (!value || typeof value !== "object") return null;
  const tournament = value as Partial<Tournament>;
  if (
    typeof tournament.id !== "string" ||
    typeof tournament.name !== "string" ||
    tournament.format !== "single_elimination" ||
    !Array.isArray(tournament.participants) ||
    !tournament.participants.every(isParticipant) ||
    (tournament.status !== "draft" && tournament.status !== "in_progress" && tournament.status !== "finished") ||
    (tournament.championId !== undefined && typeof tournament.championId !== "string")
  ) return null;

  if (tournament.bracket !== null) {
    if (!tournament.bracket || !Array.isArray(tournament.bracket.rounds)) return null;
    const validRounds = tournament.bracket.rounds.every((round) =>
      Boolean(round) &&
      typeof round.number === "number" &&
      Number.isInteger(round.number) &&
      round.number >= 1 &&
      Array.isArray(round.matches) &&
      round.matches.every(isBracketMatch),
    );
    if (!validRounds) return null;
  }

  return structuredClone(tournament as Tournament);
};

export const createTournamentStorage = (
  adapter: StorageAdapter<unknown> = createLocalStorageAdapter<unknown>(
    TOURNAMENT_STORAGE_KEYS.currentTournamentV1,
  ),
): TournamentStorage => ({
  load: () => parseTournament(adapter.load()),
  save: (tournament) => adapter.save(tournament),
  clear: () => adapter.clear(),
});
