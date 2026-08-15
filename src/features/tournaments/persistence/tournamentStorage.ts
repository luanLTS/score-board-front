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
  return typeof participant.id === "string" && participant.id.trim().length > 0 &&
    typeof participant.name === "string" && participant.name.trim().length > 0;
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

  const participantIds = new Set(tournament.participants.map(({ id }) => id));
  if (participantIds.size !== tournament.participants.length) return null;
  if (tournament.championId !== undefined && !participantIds.has(tournament.championId)) return null;

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
    if (!validRounds || tournament.bracket.rounds.length === 0) return null;

    const rounds = tournament.bracket.rounds;
    if (rounds.some((round, index) => round.number !== index + 1)) return null;
    const matches = rounds.flatMap((round) => round.matches);
    const matchIds = new Set(matches.map(({ id }) => id));
    if (matchIds.size !== matches.length) return null;

    for (const round of rounds) {
      const positions = new Set(round.matches.map(({ position }) => position));
      if (positions.size !== round.matches.length) return null;
      for (const match of round.matches) {
        if (match.round !== round.number) return null;
        const ids = match.participants.filter((participant): participant is TournamentParticipant => participant !== null).map(({ id }) => id);
        if (ids.some((id) => !participantIds.has(id)) || new Set(ids).size !== ids.length) return null;
        if (match.status === "ready" && ids.length !== 2) return null;
        if (match.status === "pending" && ids.length === 2) return null;
        if (match.status === "finished" && (!match.winnerId || !ids.includes(match.winnerId))) return null;
        if (match.status !== "finished" && match.winnerId !== undefined) return null;
        const hasNextLink = match.nextMatchId !== undefined || match.nextParticipantSlot !== undefined;
        if (hasNextLink && (match.nextMatchId === undefined || match.nextParticipantSlot === undefined)) return null;
        if (match.nextMatchId !== undefined) {
          const target = matches.find(({ id }) => id === match.nextMatchId);
          if (!target || target.round !== match.round + 1) return null;
        }
      }
    }
  }

  if (tournament.status === "draft" && (tournament.bracket !== null || tournament.championId !== undefined)) return null;
  if (tournament.status !== "draft" && tournament.bracket === null) return null;
  if (tournament.status === "in_progress" && tournament.championId !== undefined) return null;
  if (tournament.status === "finished") {
    const finalMatch = tournament.bracket?.rounds.at(-1)?.matches[0];
    if (!tournament.championId || finalMatch?.status !== "finished" || finalMatch.winnerId !== tournament.championId) return null;
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
