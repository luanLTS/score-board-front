import type { ScoreboardState } from "./types";

export const INITIAL_SCOREBOARD_STATE: ScoreboardState = {
  gameKind: "generic",
  players: [
    { id: "player-1", name: "Jogador 1", score: 0 },
    { id: "player-2", name: "Jogador 2", score: 0 },
  ],
};
