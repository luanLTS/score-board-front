import { describe, expect, it } from "vitest";

import {
  createPendingMatch,
  finishMatch,
  MatchLifecycleError,
  startMatch,
  updateMatchScores,
} from "./matchLifecycle";

const input = {
  gameKind: "truco" as const,
  participants: [
    { id: "player-1", name: "Ana" },
    { id: "player-2", name: "Bia" },
  ] as const,
};

describe("match lifecycle", () => {
  it("creates an independent pending match with a clean score", () => {
    const now = new Date("2026-08-13T12:00:00.000Z");
    const match = createPendingMatch(input, { id: "match-1", now });

    expect(match).toEqual({
      id: "match-1",
      gameKind: "truco",
      participants: [
        { id: "player-1", name: "Ana", score: 0 },
        { id: "player-2", name: "Bia", score: 0 },
      ],
      status: "pending",
      createdAt: now,
    });
    expect(match.participants[0]).not.toBe(input.participants[0]);
  });

  it("starts only a pending match without mutating it", () => {
    const pending = createPendingMatch(input, { id: "match-1" });
    const startedAt = new Date("2026-08-13T12:01:00.000Z");
    const active = startMatch(pending, startedAt);

    expect(active).toMatchObject({ status: "in_progress", startedAt });
    expect(pending.status).toBe("pending");
    expect(() => startMatch(active)).toThrow(MatchLifecycleError);
  });

  it("updates scores only while in progress and validates them", () => {
    const pending = createPendingMatch(input);
    const active = startMatch(pending);
    const updated = updateMatchScores(active, [12, 8]);

    expect(updated.participants.map(({ score }) => score)).toEqual([12, 8]);
    expect(active.participants.map(({ score }) => score)).toEqual([0, 0]);
    expect(() => updateMatchScores(pending, [1, 0])).toThrow(MatchLifecycleError);
    expect(() => updateMatchScores(active, [-1, 0])).toThrow(MatchLifecycleError);
    expect(() => updateMatchScores(active, [1.5, 0])).toThrow(MatchLifecycleError);
  });

  it("finishes an active match with its result and preserves its snapshot", () => {
    const active = updateMatchScores(startMatch(createPendingMatch(input)), [12, 8]);
    const finishedAt = new Date("2026-08-13T12:30:00.000Z");
    const finished = finishMatch(active, finishedAt);

    expect(finished).toMatchObject({
      status: "finished",
      finishedAt,
      result: { type: "winner", winnerId: "player-1" },
      winnerId: "player-1",
    });
    expect(active.status).toBe("in_progress");
    expect(() => finishMatch(finished)).toThrow(MatchLifecycleError);
  });

  it("finishes a draw without assigning a legacy winner id", () => {
    const active = updateMatchScores(startMatch(createPendingMatch(input)), [3, 3]);
    const finished = finishMatch(active);

    expect(finished.result).toEqual({ type: "draw" });
    expect(finished.winnerId).toBeUndefined();
  });
});
