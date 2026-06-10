import { INITIAL_SCOREBOARD_STATE } from "../constants";
import type {
  ScoreboardConfig,
  ScoreboardPlayer,
  ScoreboardPlayerId,
  ScoreboardState,
} from "../types";

const DEFAULT_SCOREBOARD_CONFIG: ScoreboardConfig = {
  gameKind: "generic",
  minScore: 0,
  allowNegativeScore: false,
};

const updatePlayer = (
  state: ScoreboardState,
  playerId: ScoreboardPlayerId,
  update: (player: ScoreboardPlayer) => ScoreboardPlayer,
): ScoreboardState => ({
  players: state.players.map((player) =>
    player.id === playerId ? update(player) : player,
  ) as ScoreboardState["players"],
});

export const createInitialScoreboardState = (): ScoreboardState => ({
  players: INITIAL_SCOREBOARD_STATE.players.map((player) => ({ ...player })) as
    ScoreboardState["players"],
});

export const updatePlayerName = (
  state: ScoreboardState,
  playerId: ScoreboardPlayerId,
  name: string,
): ScoreboardState =>
  updatePlayer(state, playerId, (player) => ({
    ...player,
    name,
  }));

export const incrementPlayerScore = (
  state: ScoreboardState,
  playerId: ScoreboardPlayerId,
  config = DEFAULT_SCOREBOARD_CONFIG,
): ScoreboardState =>
  updatePlayer(state, playerId, (player) => ({
    ...player,
    score: applyScoreDelta(player.score, 1, config),
  }));

export const decrementPlayerScore = (
  state: ScoreboardState,
  playerId: ScoreboardPlayerId,
  config = DEFAULT_SCOREBOARD_CONFIG,
): ScoreboardState =>
  updatePlayer(state, playerId, (player) => ({
    ...player,
    score: applyScoreDelta(player.score, -1, config),
  }));

export const resetScores = (state: ScoreboardState): ScoreboardState => ({
  players: state.players.map((player) => ({
    ...player,
    score: 0,
  })) as ScoreboardState["players"],
});

export const applyScoreDelta = (
  currentScore: number,
  delta: number,
  config: ScoreboardConfig,
): number => {
  const nextScore = currentScore + delta;
  const withMinimum = config.allowNegativeScore
    ? nextScore
    : Math.max(config.minScore, nextScore);

  if (delta > 0 && typeof config.maxScore === "number") {
    if (currentScore >= config.maxScore) {
      return currentScore;
    }

    return Math.min(config.maxScore, withMinimum);
  }

  return withMinimum;
};
