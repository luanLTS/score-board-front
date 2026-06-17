import { act, renderHook } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";

import type { ScoreboardStorage } from "../persistence/scoreboardStorage";
import type { ScoreboardState } from "../types";

import { usePersistentScoreboard } from "./usePersistentScoreboard";

const savedState: ScoreboardState = {
  gameKind: "truco",
  players: [
    { id: "player-1", name: "Ana", score: 2 },
    { id: "player-2", name: "Bruno", score: 1 },
  ],
};

describe("usePersistentScoreboard", () => {
  let storage: ScoreboardStorage;

  beforeEach(() => {
    storage = {
      load: vi.fn(() => savedState),
      save: vi.fn(),
      clear: vi.fn(),
    };
  });

  it("loads saved scoreboard state on initialization", () => {
    const { result } = renderHook(() => usePersistentScoreboard(storage));

    expect(result.current.players).toEqual(savedState.players);
    expect(result.current.gameKind).toBe("truco");
  });

  it("saves scoreboard changes", () => {
    const { result } = renderHook(() => usePersistentScoreboard(storage));

    act(() => {
      result.current.addPoint("player-2");
    });

    expect(storage.save).toHaveBeenLastCalledWith({
      gameKind: "truco",
      players: [
        { id: "player-1", name: "Ana", score: 2 },
        { id: "player-2", name: "Bruno", score: 2 },
      ],
    });
  });

  it("clears only the current scoreboard and restores initial names", () => {
    const { result } = renderHook(() => usePersistentScoreboard(storage));

    vi.mocked(storage.save).mockClear();

    act(() => {
      result.current.clearCurrentScoreboard();
    });

    expect(storage.clear).toHaveBeenCalledOnce();
    expect(storage.save).not.toHaveBeenCalled();
    expect(result.current.players).toEqual([
      { id: "player-1", name: "Jogador 1", score: 0 },
      { id: "player-2", name: "Jogador 2", score: 0 },
    ]);
    expect(result.current.gameKind).toBe("truco");
  });
});
