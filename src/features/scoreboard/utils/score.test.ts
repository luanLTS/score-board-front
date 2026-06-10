import { describe, expect, it } from "vitest";

import {
  createInitialScoreboardState,
  decrementPlayerScore,
  incrementPlayerScore,
  resetScores,
  updatePlayerName,
} from "./score";

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

    const nextState = incrementPlayerScore(state, "player-2");

    expect(nextState.players[0].score).toBe(0);
    expect(nextState.players[1].score).toBe(1);
  });

  it("decrements scores without going below zero", () => {
    const state = incrementPlayerScore(
      createInitialScoreboardState(),
      "player-1",
    );

    const afterFirstDecrement = decrementPlayerScore(state, "player-1");
    const afterSecondDecrement = decrementPlayerScore(
      afterFirstDecrement,
      "player-1",
    );

    expect(afterFirstDecrement.players[0].score).toBe(0);
    expect(afterSecondDecrement.players[0].score).toBe(0);
  });

  it("resets scores while preserving player names", () => {
    const namedState = updatePlayerName(
      createInitialScoreboardState(),
      "player-1",
      "Ana",
    );
    const scoringState = incrementPlayerScore(namedState, "player-1");

    const resetState = resetScores(scoringState);

    expect(resetState.players).toEqual([
      { id: "player-1", name: "Ana", score: 0 },
      { id: "player-2", name: "Jogador 2", score: 0 },
    ]);
  });
});
