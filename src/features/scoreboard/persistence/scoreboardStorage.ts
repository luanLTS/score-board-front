import {
  createLocalStorageAdapter,
  SCOREBOARD_STORAGE_KEYS,
  type StorageAdapter,
} from "../../../lib/storage";
import type {
  GameKind,
  ScoreboardPlayer,
  ScoreboardState,
} from "../types";

export type ScoreboardStorage = StorageAdapter<ScoreboardState>;

const gameKinds: GameKind[] = ["generic", "truco", "fifa"];

const isScoreboardPlayer = (value: unknown): value is ScoreboardPlayer => {
  if (!value || typeof value !== "object") return false;

  const player = value as Partial<ScoreboardPlayer>;

  return (
    typeof player.id === "string" && player.id.trim().length > 0 &&
    typeof player.name === "string" &&
    typeof player.score === "number" &&
    Number.isInteger(player.score) &&
    player.score >= 0
  );
};

export const parseScoreboardState = (
  value: unknown,
): ScoreboardState | null => {
  if (!value || typeof value !== "object") return null;

  const state = value as Partial<ScoreboardState>;

  if (!Array.isArray(state.players) || state.players.length !== 2) {
    return null;
  }

  if (!state.players.every(isScoreboardPlayer)) return null;
  if (state.players[0].id === state.players[1].id) return null;

  if (
    typeof state.gameKind !== "undefined" &&
    !gameKinds.includes(state.gameKind)
  ) {
    return null;
  }

  return {
    gameKind: state.gameKind ?? "generic",
    players: state.players.map((player) => ({ ...player })) as
      ScoreboardState["players"],
  };
};

export const createScoreboardStorage = (
  adapter: StorageAdapter<unknown> = createLocalStorageAdapter<unknown>(
    SCOREBOARD_STORAGE_KEYS.currentScoreboardV1,
  ),
): ScoreboardStorage => ({
  load: () => parseScoreboardState(adapter.load()),
  save: (state: ScoreboardState) => {
    adapter.save(state);
  },
  clear: () => {
    adapter.clear();
  },
});
