import { describe, expect, it, vi } from "vitest";

import type { StorageAdapter } from "../../../lib/storage";
import type { ScoreboardState } from "../types";

import {
  createScoreboardStorage,
  parseScoreboardState,
} from "./scoreboardStorage";

const validState: ScoreboardState = {
  gameKind: "truco",
  players: [
    { id: "player-1", name: "Ana", score: 2 },
    { id: "player-2", name: "Bruno", score: 1 },
  ],
};

describe("scoreboardStorage", () => {
  it("parses valid persisted scoreboard state", () => {
    expect(parseScoreboardState(validState)).toEqual(validState);
  });

  it("accepts unique dynamic participant ids used by tournament matches", () => {
    const tournamentState: ScoreboardState = {
      gameKind: "generic",
      players: [
        { id: "participant-uuid-a", name: "Ana", score: 3 },
        { id: "participant-uuid-b", name: "Bia", score: 1 },
      ],
    };

    expect(parseScoreboardState(tournamentState)).toEqual(tournamentState);
  });

  it("returns null for invalid persisted scoreboard state", () => {
    expect(parseScoreboardState(null)).toBeNull();
    expect(parseScoreboardState({ players: [] })).toBeNull();
    expect(
      parseScoreboardState({
        players: [
          { id: "player-1", name: "Ana", score: "2" },
          { id: "player-2", name: "Bruno", score: 1 },
        ],
      }),
    ).toBeNull();
    expect(
      parseScoreboardState({
        players: [
          { id: "same-id", name: "Ana", score: 1 },
          { id: "same-id", name: "Bruno", score: 1 },
        ],
      }),
    ).toBeNull();
    expect(
      parseScoreboardState({
        players: [
          { id: "player-1", name: "Ana", score: -1 },
          { id: "player-2", name: "Bruno", score: 1 },
        ],
      }),
    ).toBeNull();
    expect(
      parseScoreboardState({
        players: [
          { id: "player-1", name: "Ana", score: 1.5 },
          { id: "player-2", name: "Bruno", score: 1 },
        ],
      }),
    ).toBeNull();
  });

  it("loads null when adapter returns invalid data", () => {
    const adapter: StorageAdapter<unknown> = {
      load: () => ({ players: [] }),
      save: vi.fn(),
      clear: vi.fn(),
    };

    expect(createScoreboardStorage(adapter).load()).toBeNull();
  });

  it("saves and clears the current scoreboard state", () => {
    const adapter: StorageAdapter<unknown> = {
      load: vi.fn(),
      save: vi.fn(),
      clear: vi.fn(),
    };
    const storage = createScoreboardStorage(adapter);

    storage.save(validState);
    storage.clear();

    expect(adapter.save).toHaveBeenCalledWith(validState);
    expect(adapter.clear).toHaveBeenCalledOnce();
  });
});
