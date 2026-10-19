import { describe, expect, it, vi } from "vitest";

import {
  createTennisHistoryStorage,
  createTennisHistoryRecord,
  createTournamentTennisHistoryRecord,
  parseTennisHistory,
  type TennisHistoryRecord,
} from "./tennisHistory";

const record: TennisHistoryRecord = {
  id: "match-1",
  format: "super_tiebreak",
  participants: [
    { id: "ana", name: "Ana" },
    { id: "bia", name: "Bia" },
  ],
  finalScore: [10, 8],
  firstServerId: "ana",
  winnerId: "ana",
  startedAt: "2026-10-14T12:00:00.000Z",
  finishedAt: "2026-10-14T12:20:00.000Z",
};

describe("tennis history storage", () => {
  it("adds and reads a detailed tennis result", () => {
    const adapter = { load: vi.fn(() => []), save: vi.fn(), clear: vi.fn() };
    const storage = createTennisHistoryStorage(adapter);

    storage.add(record);

    expect(adapter.save).toHaveBeenCalledWith([record]);
    expect(parseTennisHistory([record])).toEqual([record]);
  });

  it("keeps old records readable and deduplicates by stable id", () => {
    const adapter = { load: vi.fn(() => [record]), save: vi.fn(), clear: vi.fn() };
    const storage = createTennisHistoryStorage(adapter);
    const { source: _source, ...legacy } = record;
    expect(parseTennisHistory([legacy])).toEqual([legacy]);
    storage.add(record);
    expect(adapter.save).not.toHaveBeenCalled();
  });

  it("rejects incomplete records without affecting the generic history", () => {
    expect(parseTennisHistory([{ ...record, finalScore: [10] }])).toEqual([]);
  });

  it("creates a history record from a finished super tie-break", () => {
    expect(createTennisHistoryRecord({
      id: "match-2",
      match: {
        format: "super_tiebreak",
        status: "finished",
        participants: ["ana", "bia"],
        scores: [10, 8],
        firstServerId: "ana",
        serverId: "bia",
        pointsPlayed: 18,
        sidesChangedAt: [6, 12, 18],
        winnerId: "ana",
      },
      participantNames: { ana: "Ana", bia: "Bia" },
      startedAt: record.startedAt,
      finishedAt: record.finishedAt,
    })).toEqual(recordFor("match-2"));
  });

  it("creates a tournament elimination record with per-game score and source metadata", () => {
    const record = createTournamentTennisHistoryRecord({
      id: "cup:final",
      match: {
        format: "best_of_three_games", status: "finished", participants: ["ana", "bia"], firstServerId: "ana", serverId: "bia",
        gamesWon: [2, 1], winnerId: "ana", startedAt: "2026-10-19T12:00:00.000Z",
        games: [
          { participants: ["ana", "bia"], points: [40, 0], gamesWon: [1, 0], status: "finished", winnerId: "ana" },
          { participants: ["ana", "bia"], points: [0, 40], gamesWon: [1, 1], status: "finished", winnerId: "bia" },
          { participants: ["ana", "bia"], points: [40, 15], gamesWon: [2, 1], status: "finished", winnerId: "ana" },
        ],
      },
      participantNames: { ana: "Ana", bia: "Bia" }, source: "elimination", tournamentId: "cup", tournamentName: "Copa", roundLabel: "Final", finishedAt: "2026-10-19T12:30:00.000Z",
    });
    expect(record).toMatchObject({ finalScore: [2, 1], winnerId: "ana", startedAt: "2026-10-19T12:00:00.000Z", source: "elimination", tournamentId: "cup", roundLabel: "Final" });
    expect(record.games).toHaveLength(3);
    expect(parseTennisHistory([record])).toEqual([record]);
  });
});

const recordFor = (id: string): TennisHistoryRecord => ({ ...record, id, source: "simple" });
