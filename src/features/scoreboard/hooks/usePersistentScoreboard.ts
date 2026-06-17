import { useEffect, useRef, useState } from "react";

import type { GameKind, ScoreboardPlayerId, ScoreboardState } from "../types";
import { createScoreboardStorage } from "../persistence/scoreboardStorage";
import type { ScoreboardStorage } from "../persistence/scoreboardStorage";
import {
  createInitialScoreboardState,
  decrementPlayerScore,
  incrementPlayerScore,
  resetScores,
  updateGameKind,
  updatePlayerName,
} from "../utils/score";

const defaultScoreboardStorage = createScoreboardStorage();

export const usePersistentScoreboard = (
  storage: ScoreboardStorage = defaultScoreboardStorage,
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

  return {
    gameKind: state.gameKind,
    players: state.players,
    state,
    addPoint: (playerId: ScoreboardPlayerId) => {
      setState((currentState) => incrementPlayerScore(currentState, playerId));
    },
    removePoint: (playerId: ScoreboardPlayerId) => {
      setState((currentState) => decrementPlayerScore(currentState, playerId));
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
