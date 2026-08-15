import { useEffect, useRef, useState } from "react";
import { createTournamentStorage, type TournamentStorage } from "../persistence/tournamentStorage";
import type { Tournament } from "../types";
import { advanceWinner } from "../utils/advanceWinner";
import { generateSingleEliminationBracket } from "../utils/bracket";
import { updateTournamentResult } from "../utils/tournamentResult";

const defaultStorage = createTournamentStorage();
const createId = () => crypto.randomUUID();

export const useTournament = (
  storage: TournamentStorage = defaultStorage,
  idFactory: () => string = createId,
) => {
  const skipNextSave = useRef(false);
  const [tournament, setTournament] = useState<Tournament | null>(() => storage.load());

  useEffect(() => {
    if (skipNextSave.current) {
      skipNextSave.current = false;
      return;
    }
    if (tournament) storage.save(tournament);
  }, [storage, tournament]);

  const createTournament = (name: string) => {
    const normalizedName = name.trim();
    if (!normalizedName) throw new Error("Informe o nome do torneio.");
    setTournament({
      id: idFactory(),
      name: normalizedName,
      format: "single_elimination",
      participants: [],
      bracket: null,
      status: "draft",
    });
  };

  const addParticipant = (name: string) => {
    const normalizedName = name.trim();
    if (!normalizedName) throw new Error("Informe o nome do participante.");
    setTournament((current) => {
      if (!current) throw new Error("Crie um torneio antes de adicionar participantes.");
      if (current.status !== "draft") throw new Error("Participantes só podem ser alterados antes do início.");
      return { ...current, participants: [...current.participants, { id: idFactory(), name: normalizedName }] };
    });
  };

  const removeParticipant = (participantId: string) => {
    setTournament((current) => {
      if (!current) return current;
      if (current.status !== "draft") throw new Error("Participantes só podem ser alterados antes do início.");
      return { ...current, participants: current.participants.filter(({ id }) => id !== participantId) };
    });
  };

  const startTournament = () => {
    setTournament((current) => {
      if (!current) throw new Error("Crie um torneio antes de gerar o chaveamento.");
      if (current.status !== "draft") return current;
      return { ...current, bracket: generateSingleEliminationBracket(current.participants), status: "in_progress" };
    });
  };

  const recordWinner = (bracketMatchId: string, winnerId: string, matchId?: string) => {
    setTournament((current) => {
      if (!current?.bracket || current.status !== "in_progress") {
        throw new Error("O torneio não está em andamento.");
      }
      const bracket = advanceWinner(current.bracket, bracketMatchId, winnerId);
      const linkedBracket = matchId
        ? { rounds: bracket.rounds.map((round) => ({ ...round, matches: round.matches.map((match) => match.id === bracketMatchId ? { ...match, matchId } : match) })) }
        : bracket;
      return updateTournamentResult({ ...current, bracket: linkedBracket });
    });
  };

  const linkMatch = (bracketMatchId: string, matchId: string) => {
    setTournament((current) => {
      if (!current?.bracket) throw new Error("Gere o chaveamento antes de vincular uma partida.");
      return {
        ...current,
        bracket: {
          rounds: current.bracket.rounds.map((round) => ({
            ...round,
            matches: round.matches.map((match) => match.id === bracketMatchId ? { ...match, matchId } : match),
          })),
        },
      };
    });
  };

  const clearTournament = () => {
    skipNextSave.current = true;
    storage.clear();
    setTournament(null);
  };

  return {
    tournament,
    createTournament,
    addParticipant,
    removeParticipant,
    startTournament,
    generateBracket: startTournament,
    recordWinner,
    linkMatch,
    clearTournament,
  };
};
