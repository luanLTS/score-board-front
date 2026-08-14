import { describe, expect, it } from "vitest";

import type { MatchParticipant } from "../types";
import { calculateMatchResult } from "./matchResult";

const participants = (firstScore: number, secondScore: number) =>
  [
    { id: "player-1", name: "Ana", score: firstScore },
    { id: "player-2", name: "Bia", score: secondScore },
  ] as [MatchParticipant, MatchParticipant];

describe("calculateMatchResult", () => {
  it("selects the first participant when their score is higher", () => {
    expect(calculateMatchResult(participants(3, 1))).toEqual({
      type: "winner",
      winnerId: "player-1",
    });
  });

  it("selects the second participant when their score is higher", () => {
    expect(calculateMatchResult(participants(1, 3))).toEqual({
      type: "winner",
      winnerId: "player-2",
    });
  });

  it("represents a draw explicitly, including a zero score draw", () => {
    expect(calculateMatchResult(participants(2, 2))).toEqual({ type: "draw" });
    expect(calculateMatchResult(participants(0, 0))).toEqual({ type: "draw" });
  });
});
