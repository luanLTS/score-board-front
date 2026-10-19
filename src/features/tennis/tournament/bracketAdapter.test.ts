import { describe, expect, it } from "vitest";

import { createTennisEliminationBracket, resolveTennisByes } from "./bracketAdapter";
import { advanceBracketWinner } from "../../tournaments/utils/bracket";

const participants = (count: number) =>
  Array.from({ length: count }, (_, index) => ({ id: `p${index + 1}`, name: `Pessoa ${index + 1}` }));

describe("createTennisEliminationBracket", () => {
  it("keeps the ranking seeding in the first round", () => {
    const bracket = createTennisEliminationBracket(participants(4));

    expect(bracket.rounds[0].matches.map(({ participants: pair }) => pair.map((participant) => participant?.id))).toEqual([
      ["p1", "p4"],
      ["p2", "p3"],
    ]);
    expect(bracket.rounds[0].matches[0].nextMatchId).toBe("tennis-round-2-match-1");
  });

  it("preserves byes and advances the bye participant", () => {
    const bracket = createTennisEliminationBracket(participants(5));
    const firstRound = bracket.rounds[0].matches;

    expect(firstRound.flatMap(({ participants: pair }) => pair.map((participant) => participant?.id).filter((id): id is string => Boolean(id)))).toEqual(
      ["p1", "p5", "p2", "p4", "p3"],
    );
    expect(firstRound.some(({ participants: pair }) => pair[0]?.id === "p3" && pair[1] === null)).toBe(true);
  });

  it.each([5, 6])("resolves all byes for %i participants", (count) => {
    const bracket = createTennisEliminationBracket(participants(count));

    expect(bracket.rounds.flatMap((round) => round.matches).some((match) =>
      match.participants.filter(Boolean).length === 1 && match.status !== "finished",
    )).toBe(false);
  });

  it("resolves a bye created after the first-round winner advances for six participants", () => {
    let bracket = createTennisEliminationBracket(participants(6));
    for (const match of bracket.rounds[0].matches.filter((candidate) => candidate.status === "ready")) {
      bracket = advanceBracketWinner(bracket, match.id, match.participants[0]!.id);
      bracket = resolveTennisByes(bracket);
    }

    expect(bracket.rounds[1].matches[1]).toMatchObject({
      participants: [{ id: "p3", name: "Pessoa 3" }, null],
      status: "finished",
      winnerId: "p3",
    });
    expect(bracket.rounds[2].matches[0]).toMatchObject({
      participants: [null, { id: "p3", name: "Pessoa 3" }],
      status: "pending",
    });
  });

  it("does not resolve the final before both semifinal winners are known", () => {
    let bracket = createTennisEliminationBracket(participants(4));
    const firstSemifinal = bracket.rounds[0].matches[0];

    bracket = resolveTennisByes(advanceBracketWinner(bracket, firstSemifinal.id, "p1"));

    expect(bracket.rounds[1].matches[0]).toMatchObject({
      participants: [{ id: "p1", name: "Pessoa 1" }, null],
      status: "pending",
    });
  });
});
