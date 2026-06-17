import { describe, expect, it, vi } from "vitest";

import type { StorageAdapter } from "../../../lib/storage";
import type { Match } from "../../matches/types";

import { createHistoryStorage, parseMatchHistory } from "./historyStorage";

const match: Match = {
  id: "match-1",
  participants: [
    { id: "player-1", name: "Ana", score: 2 },
    { id: "player-2", name: "Bruno", score: 1 },
  ],
  gameKind: "generic",
  status: "finished",
  startedAt: "2026-06-16T20:00:00.000Z",
  finishedAt: "2026-06-16T20:10:00.000Z",
};

describe("historyStorage", () => {
  it("parses valid match history", () => {
    expect(parseMatchHistory([match])).toEqual([match]);
  });

  it("returns an empty history for invalid saved values", () => {
    expect(parseMatchHistory(null)).toEqual([]);
    expect(parseMatchHistory({ matches: [match] })).toEqual([]);
    expect(parseMatchHistory([{ ...match, status: "active" }])).toEqual([]);
    expect(parseMatchHistory([{ ...match, finishedAt: "not-a-date" }]))
      .toEqual([]);
    expect(
      parseMatchHistory([
        {
          ...match,
          participants: [
            { id: "player-1", name: "Ana", score: -1 },
            { id: "player-2", name: "Bruno", score: 1 },
          ],
        },
      ]),
    ).toEqual([]);
    expect(
      parseMatchHistory([
        {
          ...match,
          participants: [
            { id: "player-1", name: "Ana", score: 1.5 },
            { id: "player-2", name: "Bruno", score: 1 },
          ],
        },
      ]),
    ).toEqual([]);
  });

  it("lists saved matches from newest to oldest", () => {
    const olderMatch = { ...match, id: "match-0" };
    const adapter: StorageAdapter<unknown> = {
      load: () => [olderMatch, match],
      save: vi.fn(),
      clear: vi.fn(),
    };

    expect(createHistoryStorage(adapter).list()).toEqual([olderMatch, match]);
  });

  it("adds a finished match before existing matches", () => {
    const olderMatch = { ...match, id: "match-0" };
    const adapter: StorageAdapter<unknown> = {
      load: () => [olderMatch],
      save: vi.fn(),
      clear: vi.fn(),
    };

    createHistoryStorage(adapter).add(match);

    expect(adapter.save).toHaveBeenCalledWith([match, olderMatch]);
  });
});
