import { useEffect, useRef, useState } from "react";

import type {
  GameKind,
  ScoreboardConfig,
  ScoreboardPlayerId,
  ScoreboardState,
} from "../types";
import { createScoreboardStorage } from "../persistence/scoreboardStorage";
import type { ScoreboardStorage } from "../persistence/scoreboardStorage";
import {
  applyScoreDelta,
  createInitialScoreboardState,
  decrementPlayerScore,
  incrementPlayerScore,
  resetScores,
  updateGameKind,
  updatePlayerName,
} from "../utils/score";

const defaultScoreboardStorage = createScoreboardStorage();
const defaultGetConfig = (gameKind: GameKind): ScoreboardConfig => ({
  gameKind,
  minScore: 0,
  allowNegativeScore: false,
});

export const usePersistentScoreboard = (
  storage: ScoreboardStorage = defaultScoreboardStorage,
  getConfig: (gameKind: GameKind) => ScoreboardConfig = defaultGetConfig,
) => {
  const skipNextSave = useRef(false);
  const [state, setState] = useState<ScoreboardState>(
    () => storage.load() ?? createInitialScoreboardState(),
  );

  useEffect(() => {
    if (skipNextSave.current) {
      skipNextSave.current = false;
      return;
    }

    storage.save(state);
  }, [storage, state]);

  const config = getConfig(state.gameKind);
  const getPlayerScore = (playerId: ScoreboardPlayerId) =>
    state.players.find((player) => player.id === playerId)?.score ?? 0;

  return {
    gameKind: state.gameKind,
    players: state.players,
    state,
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
    clearCurrentScoreboard: () => {
      skipNextSave.current = true;
      storage.clear();
      setState((currentState) => ({
        ...createInitialScoreboardState(),
        gameKind: currentState.gameKind,
      }));
    },
    setGameKind: (gameKind: GameKind) => {
      setState((currentState) => updateGameKind(currentState, gameKind));
    },
    renamePlayer: (playerId: ScoreboardPlayerId, name: string) => {
      setState((currentState) =>
        updatePlayerName(currentState, playerId, name),
      );
    },
  };
};
