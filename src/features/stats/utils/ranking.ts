import type { FinishedMatch } from "../../matches/types";
import type { PlayerStats, RankingEntry } from "../types";
import { calculatePlayerStats } from "./playerStats";

const compareRanking = (first: PlayerStats, second: PlayerStats): number =>
  second.rankingPoints - first.rankingPoints ||
  second.wins - first.wins ||
  second.scoreDifference - first.scoreDifference ||
  first.name.localeCompare(second.name, "pt-BR", { sensitivity: "base" });

export const calculateRanking = (
  matches: readonly FinishedMatch[],
): RankingEntry[] => calculatePlayerStats(matches)
  .sort(compareRanking)
  .map((player, index) => ({ ...player, position: index + 1 }));
