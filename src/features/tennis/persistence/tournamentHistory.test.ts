import { describe, expect, it, vi } from "vitest";
import { createTennisTournamentHistoryStorage, parseTennisTournamentHistory } from "./tournamentHistory";

const item = (id: string, terminalAt: string, status: "finished" | "cancelled" = "finished") => ({
  id, name: id, phase: "qualifying" as const, status, terminalAt, participants: [{ id: "a", name: "Ana" }, { id: "b", name: "Bia" }],
  currentTurn: 0, turns: [], ranking: [{ participantId: "a", wins: 0, pointDifferential: 0 }, { participantId: "b", wins: 0, pointDifferential: 0 }],
});

describe("tennis tournament archive", () => {
  it("filters invalid/active entries and sorts newest first", () => {
    expect(parseTennisTournamentHistory([item("old", "2026-01-01"), item("new", "2026-02-01", "cancelled"), { nope: true }]).map(({ id }) => id)).toEqual(["new", "old"]);
  });

  it("archives idempotently by tournament id", () => {
    const adapter = { load: vi.fn(() => [item("cup", "2026-01-01")]), save: vi.fn(), clear: vi.fn() };
    createTennisTournamentHistoryStorage(adapter).archive(item("cup", "2026-02-01"));
    expect(adapter.save).toHaveBeenCalledWith([item("cup", "2026-02-01")]);
  });
});
