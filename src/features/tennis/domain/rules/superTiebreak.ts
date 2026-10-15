import type { SuperTiebreakState, TennisParticipantId } from "../types";

const hasTwoPointLead = (scores: [number, number]): boolean =>
  Math.abs(scores[0] - scores[1]) >= 2;

const isWinner = (scores: [number, number], index: 0 | 1): boolean =>
  scores[index] >= 10 && hasTwoPointLead(scores);

export const getSuperTiebreakServer = (
  state: SuperTiebreakState,
): TennisParticipantId => {
  if (state.pointsPlayed === 0) return state.firstServerId;

  const firstServerIndex = state.participants.indexOf(state.firstServerId);
  const serverIndex = (firstServerIndex + Math.floor((state.pointsPlayed + 1) / 2)) % 2;
  return state.participants[serverIndex as 0 | 1];
};

export const advanceSuperTiebreak = (
  state: SuperTiebreakState,
  pointWinnerId: TennisParticipantId,
): SuperTiebreakState => {
  if (state.status === "finished") {
    throw new Error("O super tie-break já foi finalizado.");
  }

  const winnerIndex = state.participants.indexOf(pointWinnerId);
  if (winnerIndex === -1) {
    throw new Error("O vencedor do ponto deve participar do super tie-break.");
  }

  const scores: [number, number] = [...state.scores];
  scores[winnerIndex as 0 | 1] += 1;
  const finished = isWinner(scores, winnerIndex as 0 | 1);
  const pointsPlayed = state.pointsPlayed + 1;
  const sidesChangedAt =
    pointsPlayed > 0 && pointsPlayed % 6 === 0
      ? [...state.sidesChangedAt, pointsPlayed]
      : state.sidesChangedAt;

  return {
    ...state,
    scores,
    pointsPlayed,
    serverId: getSuperTiebreakServer({ ...state, pointsPlayed }),
    sidesChangedAt,
    status: finished ? "finished" : "in_progress",
    winnerId: finished ? pointWinnerId : undefined,
  };
};
