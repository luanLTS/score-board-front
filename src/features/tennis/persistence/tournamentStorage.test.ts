import { describe, expect, it, vi } from "vitest";

import {
  createTennisTournamentStorage,
  parseTennisTournament,
} from "./tournamentStorage";

const tournament = {
  id: "t1",
  name: "Copa local",
  phase: "qualifying" as const,
  status: "setup" as const,
  participants: [{ id: "ana", name: "Ana" }, { id: "bia", name: "Bia" }],
  currentTurn: 0,
  turns: [],
  ranking: [
    { participantId: "ana", wins: 0, pointDifferential: 0 },
    { participantId: "bia", wins: 0, pointDifferential: 0 },
  ],
};

describe("tennis tournament storage", () => {
  it("restores a valid tournament and saves it through its own adapter", () => {
    const adapter = { load: vi.fn(() => tournament), save: vi.fn(), clear: vi.fn() };
    const storage = createTennisTournamentStorage(adapter);

    expect(storage.load()).toEqual(tournament);
    storage.save(tournament);
    expect(adapter.save).toHaveBeenCalledWith(tournament);
  });

  it("rejects incomplete tournament data", () => {
    expect(parseTennisTournament({ ...tournament, participants: [] })).toBeNull();
    expect(parseTennisTournament({ ...tournament, status: "unknown" })).toBeNull();
  });
});
