import { act, renderHook } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import type { TournamentStorage } from "../persistence/tournamentStorage";
import { useTournament } from "./useTournament";

const createStorage = (): TournamentStorage => ({ load: vi.fn(() => null), save: vi.fn(), clear: vi.fn() });

describe("useTournament", () => {
  it("creates a draft, adds participants and generates its bracket", () => {
    const storage = createStorage();
    const ids = ["t-1", "p-1", "p-2"];
    const { result } = renderHook(() => useTournament(storage, () => ids.shift()!));
    act(() => result.current.createTournament(" Copa "));
    act(() => result.current.addParticipant("Ana"));
    act(() => result.current.addParticipant("Bia"));
    act(() => result.current.startTournament());
    expect(result.current.tournament).toMatchObject({ id: "t-1", name: "Copa", status: "in_progress" });
    expect(result.current.tournament?.bracket?.rounds[0].matches[0].status).toBe("ready");
    expect(storage.save).toHaveBeenLastCalledWith(result.current.tournament);
  });

  it("advances the winner and identifies the champion", () => {
    const storage = createStorage();
    const ids = ["t-1", "p-1", "p-2"];
    const { result } = renderHook(() => useTournament(storage, () => ids.shift()!));
    act(() => result.current.createTournament("Copa"));
    act(() => result.current.addParticipant("Ana"));
    act(() => result.current.addParticipant("Bia"));
    act(() => result.current.startTournament());
    act(() => result.current.recordWinner("round-1-match-1", "p-1", "game-1"));
    expect(result.current.tournament).toMatchObject({ status: "finished", championId: "p-1" });
    expect(result.current.tournament?.bracket?.rounds[0].matches[0].matchId).toBe("game-1");
  });

  it("restores saved state and clears without saving null", () => {
    const storage = createStorage();
    vi.mocked(storage.load).mockReturnValue({ id: "t", name: "Copa", format: "single_elimination", participants: [], bracket: null, status: "draft" });
    const { result } = renderHook(() => useTournament(storage));
    vi.mocked(storage.save).mockClear();
    act(() => result.current.clearTournament());
    expect(result.current.tournament).toBeNull();
    expect(storage.clear).toHaveBeenCalledOnce();
    expect(storage.save).not.toHaveBeenCalled();
  });
});
