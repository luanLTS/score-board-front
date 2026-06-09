import { useState } from "react";

import type { ScoreboardPlayerId } from "../types";
import {
  createInitialScoreboardState,
  decrementPlayerScore,
  incrementPlayerScore,
  resetScores,
  updatePlayerName,
} from "../utils/score";

export const useScoreboard = () => {
  const [state, setState] = useState(createInitialScoreboardState);

  return {
    players: state.players,
    addPoint: (playerId: ScoreboardPlayerId) => {
      setState((currentState) => incrementPlayerScore(currentState, playerId));
    },
    removePoint: (playerId: ScoreboardPlayerId) => {
      setState((currentState) => decrementPlayerScore(currentState, playerId));
    },
    reset: () => {
      setState((currentState) => resetScores(currentState));
    },
    renamePlayer: (playerId: ScoreboardPlayerId, name: string) => {
      setState((currentState) =>
        updatePlayerName(currentState, playerId, name),
      );
    },
  };
};
