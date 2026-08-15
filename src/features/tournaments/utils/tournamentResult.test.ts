import { describe, expect, it } from "vitest";
import type { Tournament } from "../types";
import { advanceBracketWinner, generateSingleEliminationBracket } from "./bracket";
import { getTournamentChampion, updateTournamentResult } from "./tournamentResult";

const players = [
  { id: "a", name: "Ana" },
  { id: "b", name: "Bia" },
];

const createTournament = (): Tournament => ({
  id: "cup",
  name: "Copa",
  format: "single_elimination",
  participants: players,
  bracket: generateSingleEliminationBracket(players),
  status: "in_progress",
});

describe("tournament result", () => {
  it("returns no champion before the final is finished", () => {
    expect(getTournamentChampion(createTournament())).toBeNull();
  });

  it("detects the champion and immutably finishes the tournament", () => {
    const tournament = createTournament();
    const finishedBracket = advanceBracketWinner(tournament.bracket!, "round-1-match-1", "b");
    const finished = updateTournamentResult({ ...tournament, bracket: finishedBracket });

    expect(finished).not.toBe(tournament);
    expect(getTournamentChampion(finished)).toEqual(players[1]);
    expect(finished).toMatchObject({ status: "finished", championId: "b" });
    expect(tournament.status).toBe("in_progress");
    expect(tournament.championId).toBeUndefined();
  });
});
