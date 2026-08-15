import { describe, expect, it, vi } from "vitest";

import type { StorageAdapter } from "../../../lib/storage";
import type { FinishedMatch } from "../../matches/types";

import { createHistoryStorage, parseMatchHistory } from "./historyStorage";

const match: FinishedMatch = {
  id: "match-1",
  participants: [
    { id: "player-1", name: "Ana", score: 2 },
    { id: "player-2", name: "Bruno", score: 1 },
  ],
  gameKind: "generic",
  status: "finished",
  startedAt: "2026-06-16T20:00:00.000Z",
  finishedAt: "2026-06-16T20:10:00.000Z",
  winnerId: "player-1",
  result: { type: "winner", winnerId: "player-1" },
};

describe("historyStorage", () => {
  it("parses valid match history", () => {
    expect(parseMatchHistory([match])).toEqual([match]);
  });

  it("keeps backwards compatibility with history v1 entries without result", () => {
    const { result: _result, ...v1Match } = match;

    expect(parseMatchHistory([v1Match])).toEqual([{ ...v1Match, result: match.result }]);
  });

  it("derives the winner for legacy entries without result metadata", () => {
    const { result: _result, winnerId: _winnerId, ...legacyMatch } = match;

    expect(parseMatchHistory([legacyMatch])[0].result).toEqual({
      type: "winner",
      winnerId: match.participants[0].id,
    });
  });

  it("parses an explicit draw", () => {
    const draw = {
      ...match,
      participants: [
        { id: "player-1", name: "Ana", score: 2 },
        { id: "player-2", name: "Bruno", score: 2 },
      ],
      winnerId: undefined,
      result: { type: "draw" },
    };

    expect(parseMatchHistory([draw])).toEqual([draw]);
  });

  it("rejects result metadata that references an unknown winner", () => {
    expect(
      parseMatchHistory([
        { ...match, result: { type: "winner", winnerId: "unknown" } },
      ]),
    ).toEqual([]);
  });

  it("rejects legacy winner metadata that references an unknown participant", () => {
    const { result: _result, ...v1Match } = match;
    expect(parseMatchHistory([{ ...v1Match, winnerId: "unknown" }])).toEqual([]);
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
