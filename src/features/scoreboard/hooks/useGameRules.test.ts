import { act, renderHook } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { useGameRules } from "./useGameRules";

describe("useGameRules", () => {
  it("starts with generic rules by default", () => {
    const { result } = renderHook(() => useGameRules());

    expect(result.current.gameKind).toBe("generic");
    expect(result.current.config).toEqual({
      gameKind: "generic",
      minScore: 0,
      allowNegativeScore: false,
    });
  });

  it("returns the matching config when the selected game changes", () => {
    const { result } = renderHook(() => useGameRules());

    act(() => {
      result.current.selectGameKind("truco");
    });

    expect(result.current.gameKind).toBe("truco");
    expect(result.current.config).toEqual({
      gameKind: "truco",
      minScore: 0,
      maxScore: 12,
      allowNegativeScore: false,
    });
  });
});
