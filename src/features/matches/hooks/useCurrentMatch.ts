import { useState } from "react";

import type { Match, MatchParticipant } from "../types";
import type { GameKind } from "../../scoreboard/types";
import {
  createPendingMatch,
  finishMatch,
  startMatch,
  updateMatchScores,
} from "../utils/matchLifecycle";

type CreateMatchInput = Parameters<typeof createPendingMatch>[0];

export const useCurrentMatch = (initialMatch: Match | null = null) => {
  const [currentMatch, setCurrentMatch] = useState<Match | null>(initialMatch);

  const createMatch = (input: CreateMatchInput) => {
    setCurrentMatch(createPendingMatch(input));
  };

  const startCurrentMatch = () => {
    setCurrentMatch((match) => (match ? startMatch(match) : match));
  };

  const updateCurrentMatchScores = (scores: [number, number]) => {
    setCurrentMatch((match) =>
      match ? updateMatchScores(match, scores) : match,
    );
  };

  const updateCurrentMatchScore = (
    participantId: MatchParticipant["id"],
    score: number,
  ) => {
    setCurrentMatch((match) => {
      if (!match) {
        return match;
      }

      const participantIndex = match.participants.findIndex(
        (participant) => participant.id === participantId,
      );

      if (participantIndex === -1) {
        return match;
      }

      const scores: [number, number] = [
        match.participants[0].score,
        match.participants[1].score,
      ];
      scores[participantIndex] = score;

      return updateMatchScores(match, scores);
    });
  };

  const finishCurrentMatch = () => {
    setCurrentMatch((match) => (match ? finishMatch(match) : match));
  };

  const renameCurrentMatchParticipant = (participantId: string, name: string) => {
    setCurrentMatch((match) => match ? {
      ...match,
      participants: match.participants.map((participant) =>
        participant.id === participantId ? { ...participant, name } : participant,
      ) as Match["participants"],
    } : match);
  };

  const changeCurrentMatchGameKind = (gameKind: GameKind) => {
    setCurrentMatch((match) => match ? { ...match, gameKind } : match);
  };

  const prepareNewMatch = () => {
    setCurrentMatch(null);
  };

  return {
    currentMatch,
    createMatch,
    startCurrentMatch,
    updateCurrentMatchScore,
    updateCurrentMatchScores,
    finishCurrentMatch,
    renameCurrentMatchParticipant,
    changeCurrentMatchGameKind,
    prepareNewMatch,
  };
};
