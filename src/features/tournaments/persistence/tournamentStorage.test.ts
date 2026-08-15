import { describe, expect, it, vi } from "vitest";
import type { StorageAdapter } from "../../../lib/storage";
import type { Tournament } from "../types";
import { createTournamentStorage, parseTournament } from "./tournamentStorage";

const tournament: Tournament = {
  id: "t-1",
  name: "Copa",
  format: "single_elimination",
  participants: [{ id: "p-1", name: "Ana" }, { id: "p-2", name: "Bia" }],
  bracket: {
    rounds: [{ number: 1, matches: [{ id: "m-1", round: 1, position: 0, participants: [{ id: "p-1", name: "Ana" }, { id: "p-2", name: "Bia" }], status: "ready" }] }],
  },
  status: "in_progress",
};

describe("tournamentStorage", () => {
  it("accepts and clones a valid tournament", () => {
    const parsed = parseTournament(tournament);
    expect(parsed).toEqual(tournament);
    expect(parsed).not.toBe(tournament);
  });

  it("rejects malformed tournament data", () => {
    expect(parseTournament(null)).toBeNull();
    expect(parseTournament({ ...tournament, format: "round_robin" })).toBeNull();
    expect(parseTournament({ ...tournament, participants: [{ id: 1, name: "Ana" }] })).toBeNull();
    expect(parseTournament({ ...tournament, bracket: { rounds: [{ number: 1, matches: [{ status: "ready" }] }] } })).toBeNull();
  });

  it("rejects inconsistent bracket lifecycle and references", () => {
    expect(parseTournament({ ...tournament, championId: "unknown" })).toBeNull();
    expect(parseTournament({ ...tournament, status: "finished" })).toBeNull();
    expect(parseTournament({
      ...tournament,
      bracket: { rounds: [{ number: 1, matches: [{ ...tournament.bracket!.rounds[0].matches[0], status: "finished", winnerId: "unknown" }] }] },
    })).toBeNull();
    expect(parseTournament({
      ...tournament,
      bracket: { rounds: [{ number: 1, matches: [{ ...tournament.bracket!.rounds[0].matches[0], nextMatchId: "missing", nextParticipantSlot: 0 }] }] },
    })).toBeNull();
  });

  it("loads safely and delegates save and clear", () => {
    const adapter: StorageAdapter<unknown> = { load: vi.fn(() => tournament), save: vi.fn(), clear: vi.fn() };
    const storage = createTournamentStorage(adapter);
    expect(storage.load()).toEqual(tournament);
    storage.save(tournament);
    storage.clear();
    expect(adapter.save).toHaveBeenCalledWith(tournament);
    expect(adapter.clear).toHaveBeenCalledOnce();
  });
});
