import type {
  TennisQualifyingMatch,
  TennisTournamentParticipant,
  TennisTournamentState,
} from "./types";
import { calculateTennisRanking } from "./ranking";
import { createTennisEliminationBracket, resolveTennisByes } from "./bracketAdapter";
import { advanceBracketWinner } from "../../tournaments/utils/bracket";

const clone = <T>(value: T): T => structuredClone(value);

const ensureCanStartFirstTurn = (tournament: TennisTournamentState) => {
  if (tournament.status !== "setup" || tournament.phase !== "qualifying") {
    throw new Error("O primeiro turno só pode ser iniciado na configuração.");
  }
};

const ensureCanStartNextTurn = (tournament: TennisTournamentState) => {
  if (tournament.status !== "turn_closed" || tournament.phase !== "qualifying") {
    throw new Error("Feche o turno atual antes de iniciar outro.");
  }
};

export const createTennisTournament = (
  name: string,
  participantIds: string[],
  id = `tennis-tournament-${Date.now()}`,
): TennisTournamentState => {
  const uniqueIds = new Set(participantIds);
  if (name.trim().length === 0) throw new Error("Informe um nome para o campeonato.");
  if (participantIds.length < 2 || uniqueIds.size !== participantIds.length) {
    throw new Error("O campeonato precisa de pelo menos dois participantes únicos.");
  }

  const participants: TennisTournamentParticipant[] = participantIds.map((participantId) => ({
    id: participantId,
    name: participantId,
  }));
  const ranking = participants.map(({ id: participantId }) => ({
    participantId,
    wins: 0,
    pointDifferential: 0,
  }));

  return {
    id,
    name: name.trim(),
    phase: "qualifying",
    status: "setup",
    participants,
    currentTurn: 0,
    turns: [],
    ranking,
  };
};

export const startQualifyingTurn = (
  tournament: TennisTournamentState,
  matches: TennisQualifyingMatch[],
): TennisTournamentState => {
  ensureCanStartFirstTurn(tournament);
  return {
    ...clone(tournament),
    status: "turn_in_progress",
    currentTurn: 1,
    turns: [{ number: 1, status: "in_progress", matches: clone(matches) }],
  };
};

export const closeQualifyingTurn = (
  tournament: TennisTournamentState,
): TennisTournamentState => {
  if (tournament.status !== "turn_in_progress" || tournament.phase !== "qualifying") {
    throw new Error("Não há um turno classificatório aberto.");
  }

  const current = tournament.turns.at(-1);
  if (!current || current.matches.some((match) => match.status !== "finished")) {
    throw new Error("Finalize todas as partidas do turno antes de fechá-lo.");
  }

  const turns = clone(tournament.turns);
  turns[turns.length - 1] = { ...current, status: "closed" };
  const ranking = calculateTennisRanking(
    tournament.participants.map(({ id }) => id),
    turns,
    Math.random,
    tournament.ranking,
  );
  return { ...clone(tournament), status: "turn_closed", turns, ranking };
};

export const startAnotherQualifyingTurn = (
  tournament: TennisTournamentState,
  matches: TennisQualifyingMatch[],
): TennisTournamentState => {
  ensureCanStartNextTurn(tournament);
  const nextNumber = tournament.currentTurn + 1;
  return {
    ...clone(tournament),
    status: "turn_in_progress",
    currentTurn: nextNumber,
    turns: [...clone(tournament.turns), { number: nextNumber, status: "in_progress", matches: clone(matches) }],
  };
};

export const startEliminationPhase = (
  tournament: TennisTournamentState,
): TennisTournamentState => {
  if (tournament.status !== "turn_closed" || tournament.phase !== "qualifying") {
    throw new Error("Feche um turno classificatório antes das eliminatórias.");
  }

  return {
    ...clone(tournament),
    phase: "elimination",
    status: "elimination_in_progress",
    eliminationBracket: createTennisEliminationBracket(
      tournament.ranking.map((entry) => tournament.participants.find(({ id }) => id === entry.participantId)!).filter(Boolean),
    ),
  };
};

export const recordEliminationWinner = (
  tournament: TennisTournamentState,
  matchId: string,
  winnerId: string,
): TennisTournamentState => {
  if (tournament.phase !== "elimination" || tournament.status !== "elimination_in_progress" || !tournament.eliminationBracket) {
    throw new Error("O campeonato não está nas eliminatórias.");
  }

  const eliminationBracket = advanceBracketWinner(tournament.eliminationBracket, matchId, winnerId);
  const resolvedBracket = resolveTennisByes(eliminationBracket);
  const finalMatch = resolvedBracket.rounds.at(-1)?.matches[0];
  const finished = finalMatch?.status === "finished";
  return {
    ...clone(tournament),
    eliminationBracket: resolvedBracket,
    status: finished ? "finished" : "elimination_in_progress",
  };
};
