import { createLocalStorageAdapter, TENNIS_STORAGE_KEYS, type StorageAdapter } from "../../../lib/storage";
import { parseTennisTournament } from "./tournamentStorage";
import type { TennisTournamentState } from "../tournament/types";

export type ArchivedTennisTournament = TennisTournamentState & { terminalAt: Date | string };

export const parseTennisTournamentHistory = (value: unknown): ArchivedTennisTournament[] => {
  if (!Array.isArray(value)) return [];
  return value.filter((entry) => {
    const tournament = parseTennisTournament(entry);
    return tournament !== null && (tournament.status === "finished" || tournament.status === "cancelled") && Boolean(tournament.terminalAt);
  }).map((entry) => structuredClone(entry as ArchivedTennisTournament))
    .sort((a, b) => new Date(b.terminalAt).getTime() - new Date(a.terminalAt).getTime());
};

export type TennisTournamentHistoryStorage = { list: () => ArchivedTennisTournament[]; archive: (item: ArchivedTennisTournament) => void };

export const createTennisTournamentHistoryStorage = (
  adapter: StorageAdapter<unknown> = createLocalStorageAdapter<unknown>(TENNIS_STORAGE_KEYS.tournamentHistoryV1),
): TennisTournamentHistoryStorage => ({
  list: () => parseTennisTournamentHistory(adapter.load()),
  archive: (item) => {
    const items = parseTennisTournamentHistory(adapter.load());
    adapter.save([item, ...items.filter(({ id }) => id !== item.id)]);
  },
});
