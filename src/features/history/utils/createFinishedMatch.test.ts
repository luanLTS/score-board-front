import { describe, expect, it } from "vitest";

import { createFinishedMatch } from "./createFinishedMatch";
import type { ScoreboardState } from "../../scoreboard/types";

describe("createFinishedMatch", () => {
  it("creates a finished match snapshot from the current scoreboard state", () => {
    const scoreboardState: ScoreboardState = {
      gameKind: "generic",
      players: [
        { id: "player-1", name: "Ana", score: 12 },
        { id: "player-2", name: "Bia", score: 10 },
      ],
    };
    const now = new Date("2026-06-16T12:00:00.000Z");
    const startedAt = new Date("2026-06-16T11:45:00.000Z");

    const match = createFinishedMatch(scoreboardState, {
      id: "match-1",
      now,
      startedAt,
      gameKind: "truco",
      winnerId: "player-1",
    });

    expect(match).toEqual({
      id: "match-1",
      participants: [
        { id: "player-1", name: "Ana", score: 12 },
        { id: "player-2", name: "Bia", score: 10 },
      ],
      gameKind: "truco",
      status: "finished",
      startedAt,
      finishedAt: now,
      winnerId: "player-1",
    });

    expect(match.participants[0]).not.toBe(scoreboardState.players[0]);
    expect(match.participants[1]).not.toBe(scoreboardState.players[1]);
  });

  it("uses generic game kind and generated values by default", () => {
    const scoreboardState: ScoreboardState = {
      gameKind: "generic",
      players: [
        { id: "player-1", name: "Jogador 1", score: 0 },
        { id: "player-2", name: "Jogador 2", score: 0 },
      ],
    };

    const match = createFinishedMatch(scoreboardState);

    expect(match.gameKind).toBe("generic");
    expect(match.status).toBe("finished");
    expect(match.id).not.toHaveLength(0);
    expect(match.startedAt).toBeInstanceOf(Date);
    expect(match.finishedAt).toBeInstanceOf(Date);
    expect(match.winnerId).toBeUndefined();
  });
});
