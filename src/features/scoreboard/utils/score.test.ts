import { describe, expect, it } from "vitest";

import {
  createInitialScoreboardState,
  decrementPlayerScore,
  incrementPlayerScore,
  resetScores,
  updatePlayerName,
} from "./score";
import type { ScoreboardConfig, ScoreboardState } from "../types";

const uncappedConfig: ScoreboardConfig = {
  gameKind: "generic",
  minScore: 0,
  allowNegativeScore: false,
};

describe("score utilities", () => {
  it("creates exactly two players with editable names and zero scores", () => {
    const state = createInitialScoreboardState();

    expect(state.players).toEqual([
      { id: "player-1", name: "Jogador 1", score: 0 },
      { id: "player-2", name: "Jogador 2", score: 0 },
    ]);
  });

  it("increments only the selected player's score", () => {
    const state = createInitialScoreboardState();

    const nextState = incrementPlayerScore(state, "player-2", uncappedConfig);

    expect(nextState.players[0].score).toBe(0);
    expect(nextState.players[1].score).toBe(1);
  });

  it("decrements scores without going below zero", () => {
    const state = incrementPlayerScore(
      createInitialScoreboardState(),
      "player-1",
      uncappedConfig,
    );

    const afterFirstDecrement = decrementPlayerScore(
      state,
      "player-1",
      uncappedConfig,
    );
    const afterSecondDecrement = decrementPlayerScore(
      afterFirstDecrement,
      "player-1",
      uncappedConfig,
    );

    expect(afterFirstDecrement.players[0].score).toBe(0);
    expect(afterSecondDecrement.players[0].score).toBe(0);
  });

  it("caps increments at the configured maximum score", () => {
    const cappedConfig: ScoreboardConfig = {
      gameKind: "truco",
      minScore: 0,
      maxScore: 1,
      allowNegativeScore: false,
    };
    const state = incrementPlayerScore(
      createInitialScoreboardState(),
      "player-1",
      cappedConfig,
    );

    const nextState = incrementPlayerScore(state, "player-1", cappedConfig);

    expect(nextState.players[0].score).toBe(1);
  });

  it("does not reduce an above-maximum score while incrementing", () => {
    const cappedConfig: ScoreboardConfig = {
      gameKind: "truco",
      minScore: 0,
      maxScore: 12,
      allowNegativeScore: false,
    };
    const state: ScoreboardState = {
      players: [
        { id: "player-1", name: "Jogador 1", score: 15 },
        { id: "player-2", name: "Jogador 2", score: 0 },
      ],
    };

    const nextState = incrementPlayerScore(state, "player-1", cappedConfig);

    expect(nextState.players[0].score).toBe(15);
  });

  it("allows decrement below the minimum when negative scores are enabled", () => {
    const negativeConfig: ScoreboardConfig = {
      gameKind: "generic",
      minScore: 0,
      allowNegativeScore: true,
    };

    const nextState = decrementPlayerScore(
      createInitialScoreboardState(),
      "player-1",
      negativeConfig,
    );

    expect(nextState.players[0].score).toBe(-1);
  });

  it("does not clamp an above-maximum score while decrementing", () => {
    const cappedConfig: ScoreboardConfig = {
      gameKind: "truco",
      minScore: 0,
      maxScore: 12,
      allowNegativeScore: false,
    };
    const state: ScoreboardState = {
      players: [
        { id: "player-1", name: "Jogador 1", score: 20 },
        { id: "player-2", name: "Jogador 2", score: 0 },
      ],
    };

    const nextState = decrementPlayerScore(state, "player-1", cappedConfig);

    expect(nextState.players[0].score).toBe(19);
  });

  it("resets scores while preserving player names", () => {
    const namedState = updatePlayerName(
      createInitialScoreboardState(),
      "player-1",
      "Ana",
    );
    const scoringState = incrementPlayerScore(
      namedState,
      "player-1",
      uncappedConfig,
    );

    const resetState = resetScores(scoringState);

    expect(resetState.players).toEqual([
      { id: "player-1", name: "Ana", score: 0 },
      { id: "player-2", name: "Jogador 2", score: 0 },
    ]);
  });
});
