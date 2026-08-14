import { act, renderHook } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import type { CreateMatchInput } from "../types";
import { MatchLifecycleError } from "../utils/matchLifecycle";

import { useCurrentMatch } from "./useCurrentMatch";

const matchInput: CreateMatchInput = {
  gameKind: "truco",
  participants: [
    { id: "player-1", name: "Ana" },
    { id: "player-2", name: "Bia" },
  ],
};

describe("useCurrentMatch", () => {
  it("creates and starts the current match", () => {
    const { result } = renderHook(useCurrentMatch);

    act(() => result.current.createMatch(matchInput));

    expect(result.current.currentMatch).toMatchObject({
      gameKind: "truco",
      status: "pending",
      participants: [
        { id: "player-1", name: "Ana", score: 0 },
        { id: "player-2", name: "Bia", score: 0 },
      ],
    });

    act(() => result.current.startCurrentMatch());

    expect(result.current.currentMatch?.status).toBe("in_progress");
  });

  it("updates scores while the match is in progress", () => {
    const { result } = renderHook(useCurrentMatch);

    act(() => result.current.createMatch(matchInput));
    act(() => result.current.startCurrentMatch());
    act(() => result.current.updateCurrentMatchScore("player-1", 3));

    expect(result.current.currentMatch?.participants[0].score).toBe(3);
  });

  it("finishes with a winner and prevents later score mutations", () => {
    const { result } = renderHook(useCurrentMatch);

    act(() => result.current.createMatch(matchInput));
    act(() => result.current.startCurrentMatch());
    act(() => result.current.updateCurrentMatchScores([12, 7]));
    act(() => result.current.finishCurrentMatch());

    expect(result.current.currentMatch).toMatchObject({
      status: "finished",
      winnerId: "player-1",
      result: { type: "winner", winnerId: "player-1" },
    });

    expect(() => {
      act(() => result.current.updateCurrentMatchScore("player-2", 8));
    }).toThrow(MatchLifecycleError);
    expect(result.current.currentMatch?.participants[1].score).toBe(7);
  });

  it("represents a draw explicitly when finishing", () => {
    const { result } = renderHook(useCurrentMatch);

    act(() => result.current.createMatch(matchInput));
    act(() => result.current.startCurrentMatch());
    act(() => result.current.updateCurrentMatchScores([5, 5]));
    act(() => result.current.finishCurrentMatch());

    expect(result.current.currentMatch).toMatchObject({
      status: "finished",
      result: { type: "draw" },
    });
    expect(
      result.current.currentMatch?.status === "finished"
        ? result.current.currentMatch.winnerId
        : "not-finished",
    ).toBeUndefined();
  });

  it("prepares a clean slot for a new match", () => {
    const { result } = renderHook(useCurrentMatch);

    act(() => result.current.createMatch(matchInput));
    act(() => result.current.startCurrentMatch());
    act(() => result.current.updateCurrentMatchScores([2, 1]));
    act(() => result.current.finishCurrentMatch());
    act(() => result.current.prepareNewMatch());

    expect(result.current.currentMatch).toBeNull();

    act(() => result.current.createMatch(matchInput));

    expect(result.current.currentMatch?.participants.map(({ score }) => score)).toEqual([
      0, 0,
    ]);
  });

  it("keeps no-op actions safe when there is no current match", () => {
    const { result } = renderHook(useCurrentMatch);

    act(() => {
      result.current.startCurrentMatch();
      result.current.updateCurrentMatchScores([1, 2]);
      result.current.finishCurrentMatch();
    });

    expect(result.current.currentMatch).toBeNull();
  });
});
