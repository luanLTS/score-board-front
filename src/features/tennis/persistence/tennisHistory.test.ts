import { describe, expect, it, vi } from "vitest";

import {
  createTennisHistoryStorage,
  createTennisHistoryRecord,
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
});

const recordFor = (id: string): TennisHistoryRecord => ({ ...record, id });
