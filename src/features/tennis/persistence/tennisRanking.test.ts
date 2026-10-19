import { describe, expect, it } from "vitest";
import { calculateRanking } from "../../stats/utils/ranking";
import { calculatePlayerStats } from "../../stats/utils/playerStats";
import type { TennisHistoryRecord } from "./tennisHistory";
import { tennisHistoryToFinishedMatch } from "./tennisHistory";

const match = (id: string, a: string, b: string, score: [number, number], winnerId: string): TennisHistoryRecord => ({
  id, format: "super_tiebreak", participants: [{ id: a, name: a }, { id: b, name: b }], finalScore: score, firstServerId: a, winnerId,
  startedAt: "2026-01-01T10:00:00.000Z", finishedAt: "2026-01-01T10:10:00.000Z",
});

describe("tennis ranking adapter", () => {
  it("reuses generic ranking rules and normalizes participant names", () => {
    const records = [match("1", "a", "b", [10, 4], "a"), match("2", "a2", "c", [8, 10], "c")];
    records[0].participants[0].name = " Ana ";
    records[1].participants[0].name = "ana";
    const ranking = calculateRanking(records.map(tennisHistoryToFinishedMatch));
    const ana = ranking.find(({ name }) => name.toLocaleLowerCase() === "ana");
    expect(ana).toMatchObject({ games: 2, wins: 1, losses: 1, rankingPoints: 3, pointsFor: 18, pointsAgainst: 14, scoreDifference: 4, successRate: 50 });
    expect(ranking[0].name).toBe("Ana");
    expect(calculatePlayerStats(records.map(tennisHistoryToFinishedMatch))).toHaveLength(3);
    expect(tennisHistoryToFinishedMatch(records[0]).gameKind).toBe("generic");
  });
});
