import { INITIAL_SCOREBOARD_STATE } from "../constants";
import type {
  ScoreboardPlayer,
  ScoreboardPlayerId,
  ScoreboardState,
} from "../types";

const updatePlayer = (
  state: ScoreboardState,
  playerId: ScoreboardPlayerId,
  update: (player: ScoreboardPlayer) => ScoreboardPlayer,
): ScoreboardState => ({
  ...state,
  players: state.players.map((player) =>
    player.id === playerId ? update(player) : player,
  ) as ScoreboardState["players"],
});

export const createInitialScoreboardState = (): ScoreboardState => ({
  gameKind: INITIAL_SCOREBOARD_STATE.gameKind,
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

export const updateGameKind = (
  state: ScoreboardState,
  gameKind: ScoreboardState["gameKind"],
): ScoreboardState => ({
  ...state,
  gameKind,
});

export const incrementPlayerScore = (
  state: ScoreboardState,
  playerId: ScoreboardPlayerId,
): ScoreboardState =>
  updatePlayer(state, playerId, (player) => ({
    ...player,
    score: player.score + 1,
  }));

export const decrementPlayerScore = (
  state: ScoreboardState,
  playerId: ScoreboardPlayerId,
): ScoreboardState =>
  updatePlayer(state, playerId, (player) => ({
    ...player,
    score: Math.max(0, player.score - 1),
  }));

export const resetScores = (state: ScoreboardState): ScoreboardState => ({
  ...state,
  players: state.players.map((player) => ({
    ...player,
    score: 0,
  })) as ScoreboardState["players"],
});
