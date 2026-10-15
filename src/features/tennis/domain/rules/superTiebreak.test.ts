import { describe, expect, it } from "vitest";

import type { SuperTiebreakState } from "../types";
import { advanceSuperTiebreak, getSuperTiebreakServer } from "./superTiebreak";

const state = (scores: [number, number]): SuperTiebreakState => ({
  format: "super_tiebreak",
  status: "in_progress",
  participants: ["ana", "bia"],
  scores,
  firstServerId: "ana",
  serverId: "ana",
  pointsPlayed: scores[0] + scores[1],
  sidesChangedAt: [],
});

describe("advanceSuperTiebreak", () => {
  it("uses one serve for the first point and then alternates blocks of two", () => {
    let current = state([0, 0]);
    const servers = [] as string[];

    for (let point = 0; point < 5; point += 1) {
      servers.push(getSuperTiebreakServer(current));
      current = advanceSuperTiebreak(current, "ana");
    }

    expect(servers).toEqual(["ana", "bia", "bia", "ana", "ana"]);
  });

  it("records a side change after every six disputed points", () => {
    let current = state([0, 0]);

    for (let point = 0; point < 6; point += 1) {
      current = advanceSuperTiebreak(current, "ana");
    }

    expect(current.sidesChangedAt).toEqual([6]);
  });

  it("finishes at 10-8", () => {
    const result = advanceSuperTiebreak(state([9, 8]), "ana");

    expect(result).toMatchObject({
      scores: [10, 8],
      status: "finished",
      winnerId: "ana",
    });
  });

  it("keeps 9-9 in progress until there is a two-point difference", () => {
    const result = advanceSuperTiebreak(state([9, 8]), "bia");

    expect(result).toMatchObject({ scores: [9, 9], status: "in_progress" });
    expect(result.winnerId).toBeUndefined();
  });

  it("finishes at 11-9 after going beyond ten points", () => {
    const result = advanceSuperTiebreak(state([10, 9]), "ana");

    expect(result).toMatchObject({
      scores: [11, 9],
      status: "finished",
      winnerId: "ana",
    });
  });

  it("does not finish a prolonged tie without two points of difference", () => {
    const result = advanceSuperTiebreak(state([20, 20]), "bia");

    expect(result).toMatchObject({ scores: [20, 21], status: "in_progress" });
  });
});
