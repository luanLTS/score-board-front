import { useState } from "react";

import type { ScoreboardConfig, ScoreboardPlayerId } from "../types";
import {
  applyScoreDelta,
  createInitialScoreboardState,
  decrementPlayerScore,
  incrementPlayerScore,
  resetScores,
  updatePlayerName,
} from "../utils/score";

const DEFAULT_SCOREBOARD_CONFIG: ScoreboardConfig = {
  gameKind: "generic",
  minScore: 0,
  allowNegativeScore: false,
};

export const useScoreboard = (
  config: ScoreboardConfig = DEFAULT_SCOREBOARD_CONFIG,
) => {
  const [state, setState] = useState(createInitialScoreboardState);
  const getPlayerScore = (playerId: ScoreboardPlayerId) =>
    state.players.find((player) => player.id === playerId)?.score ?? 0;

  return {
    players: state.players,
    addPoint: (playerId: ScoreboardPlayerId) => {
      setState((currentState) =>
        incrementPlayerScore(currentState, playerId, config),
      );
    },
    removePoint: (playerId: ScoreboardPlayerId) => {
      setState((currentState) =>
        decrementPlayerScore(currentState, playerId, config),
      );
    },
    canAddPoint: (playerId: ScoreboardPlayerId) => {
      const score = getPlayerScore(playerId);

      return applyScoreDelta(score, 1, config) !== score;
    },
    canRemovePoint: (playerId: ScoreboardPlayerId) => {
      const score = getPlayerScore(playerId);

      return applyScoreDelta(score, -1, config) !== score;
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
