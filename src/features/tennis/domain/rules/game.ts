import type {
  TennisGamePoint,
  TennisGameState,
  TennisParticipantId,
} from "../types";

const nextPoint: Partial<Record<Exclude<TennisGamePoint, "deuce" | "advantage">, TennisGamePoint>> = {
  0: 15,
  15: 30,
  30: 40,
};

export const advanceTennisGame = (
  state: TennisGameState,
  pointWinnerId: TennisParticipantId,
): TennisGameState => {
  if (state.status === "finished") {
    throw new Error("O game já foi finalizado.");
  }

  const winnerIndex = state.participants.indexOf(pointWinnerId);
  if (winnerIndex === -1) {
    throw new Error("O vencedor do ponto deve participar do game.");
  }

  const index = winnerIndex as 0 | 1;
  const opponentIndex = index === 0 ? 1 : 0;
  const points: [TennisGamePoint, TennisGamePoint] = [...state.points];
  const winnerPoint = points[index];
  const opponentPoint = points[opponentIndex];

  if (winnerPoint === "advantage") {
    return {
      ...state,
      points,
      status: "finished",
      winnerId: pointWinnerId,
    };
  }

  if (opponentPoint === "advantage") {
    points[0] = "deuce";
    points[1] = "deuce";
    return { ...state, points };
  }

  if (winnerPoint === "deuce" || (winnerPoint === 40 && opponentPoint === 40)) {
    points[index] = "advantage";
    points[opponentIndex] = 40;
    return { ...state, points };
  }

  if (winnerPoint === 40) {
    return {
      ...state,
      points,
      status: "finished",
      winnerId: pointWinnerId,
    };
  }

  points[index] = nextPoint[winnerPoint] ?? winnerPoint;
  return { ...state, points };
};
