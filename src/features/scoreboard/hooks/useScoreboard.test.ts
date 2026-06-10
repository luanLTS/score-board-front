import { act, renderHook } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import type { ScoreboardConfig } from "../types";

import { useScoreboard } from "./useScoreboard";

describe("useScoreboard", () => {
  it("applies the active config when adding points", () => {
    const cappedConfig: ScoreboardConfig = {
      gameKind: "truco",
      minScore: 0,
      maxScore: 1,
      allowNegativeScore: false,
    };
    const { result } = renderHook(() => useScoreboard(cappedConfig));

    act(() => {
      result.current.addPoint("player-1");
      result.current.addPoint("player-1");
    });

    expect(result.current.players[0].score).toBe(1);
    expect(result.current.canAddPoint("player-1")).toBe(false);
  });

  it("does not reduce scores above the active maximum when adding points", () => {
    const uncappedConfig: ScoreboardConfig = {
      gameKind: "generic",
      minScore: 0,
      allowNegativeScore: false,
    };
    const cappedConfig: ScoreboardConfig = {
      gameKind: "truco",
      minScore: 0,
      maxScore: 12,
      allowNegativeScore: false,
    };
    const { result, rerender } = renderHook(
      ({ config }) => useScoreboard(config),
      { initialProps: { config: uncappedConfig } },
    );

    act(() => {
      for (let points = 0; points < 15; points += 1) {
        result.current.addPoint("player-1");
      }
    });

    rerender({ config: cappedConfig });

    expect(result.current.canAddPoint("player-1")).toBe(false);

    act(() => {
      result.current.addPoint("player-1");
    });

    expect(result.current.players[0].score).toBe(15);
  });

  it("exposes whether points can be removed by the active config", () => {
    const minZeroConfig: ScoreboardConfig = {
      gameKind: "generic",
      minScore: 0,
      allowNegativeScore: false,
    };
    const negativeConfig: ScoreboardConfig = {
      gameKind: "generic",
      minScore: 0,
      allowNegativeScore: true,
    };

    const minZero = renderHook(() => useScoreboard(minZeroConfig));
    const negative = renderHook(() => useScoreboard(negativeConfig));

    expect(minZero.result.current.canRemovePoint("player-1")).toBe(false);
    expect(negative.result.current.canRemovePoint("player-1")).toBe(true);
  });
});
