import type { TennisMatchState, TennisGameState, TennisParticipantId } from "../types";
import { advanceTennisGame } from "./game";

export const advanceBestOfThree = (
  state: TennisMatchState,
  pointWinnerId: TennisParticipantId,
): TennisMatchState => {
  if (state.status === "finished") {
    throw new Error("A partida já foi finalizada.");
  }

  const currentGameIndex = state.games.length - 1;
  const currentGame = state.games[currentGameIndex];
  if (!currentGame) {
    throw new Error("A partida precisa ter um game em andamento.");
  }

  const nextGame = advanceTennisGame(currentGame, pointWinnerId);
  const games = [...state.games];

  if (nextGame.status !== "finished" || !nextGame.winnerId) {
    games[currentGameIndex] = nextGame;
    return { ...state, games };
  }

  const winnerIndex = state.participants.indexOf(nextGame.winnerId);
  if (winnerIndex === -1) {
    throw new Error("O vencedor do game deve participar da partida.");
  }

  const gamesWon: [number, number] = [...state.gamesWon];
  gamesWon[winnerIndex as 0 | 1] += 1;
  games[currentGameIndex] = { ...nextGame, gamesWon };

  if (gamesWon[winnerIndex as 0 | 1] >= 2) {
    return {
      ...state,
      games,
      gamesWon,
      status: "finished",
      winnerId: nextGame.winnerId,
    };
  }

  const newGame: TennisGameState = {
    participants: state.participants,
    points: [0, 0],
    gamesWon,
    status: "in_progress",
  };

  return {
    ...state,
    games: [...games, newGame],
    gamesWon,
  };
};
