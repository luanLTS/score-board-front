import { describe, expect, it } from "vitest";
import type { TournamentParticipant } from "../types";
import { advanceBracketWinner, generateSingleEliminationBracket } from "./bracket";

const participants = (count: number): TournamentParticipant[] =>
  Array.from({ length: count }, (_, index) => ({ id: `p${index + 1}`, name: `Pessoa ${index + 1}` }));

const keepOriginalOrder = () => 0.999999;

describe("generateSingleEliminationBracket", () => {
  it("creates predictable rounds and links for a power of two", () => {
    const bracket = generateSingleEliminationBracket(participants(4), keepOriginalOrder);

    expect(bracket.rounds.map((round) => round.matches.length)).toEqual([2, 1]);
    expect(bracket.rounds[0].matches[0]).toMatchObject({
      id: "round-1-match-1",
      status: "ready",
      nextMatchId: "round-2-match-1",
      nextParticipantSlot: 0,
    });
    expect(bracket.rounds[1].matches[0].participants).toEqual([null, null]);
  });

  it("creates and automatically resolves byes", () => {
    const bracket = generateSingleEliminationBracket(participants(5), keepOriginalOrder);
    const firstRound = bracket.rounds[0].matches;

    expect(firstRound).toHaveLength(4);
    expect(firstRound.slice(0, 3).map((match) => match.winnerId)).toEqual(["p1", "p2", "p3"]);
    expect(firstRound[3].participants.map((participant) => participant?.id)).toEqual(["p4", "p5"]);
    expect(bracket.rounds[1].matches[0].participants.map((participant) => participant?.id)).toEqual([
      "p1",
      "p2",
    ]);
    expect(bracket.rounds[1].matches[0].status).toBe("ready");
  });

  it("rejects an insufficient list", () => {
    expect(() => generateSingleEliminationBracket(participants(1))).toThrow(
      "Adicione pelo menos 2 participantes.",
    );
  });

  it("randomizes the initial distribution with an injectable RNG", () => {
    const original = participants(4);
    const bracket = generateSingleEliminationBracket(original, () => 0);
    const initialDistribution = bracket.rounds[0].matches.flatMap((match) =>
      match.participants.map((participant) => participant?.id),
    );

    expect(initialDistribution).toEqual(["p2", "p3", "p4", "p1"]);
    expect(initialDistribution).not.toEqual(original.map((participant) => participant.id));
  });

  it("does not mutate the participant input while shuffling", () => {
    const original = participants(5);
    const snapshot = structuredClone(original);

    generateSingleEliminationBracket(original, () => 0);

    expect(original).toEqual(snapshot);
  });
});

describe("advanceBracketWinner", () => {
  it("finishes a match and advances its winner without mutating the bracket", () => {
    const bracket = generateSingleEliminationBracket(participants(4), keepOriginalOrder);
    const advanced = advanceBracketWinner(bracket, "round-1-match-1", "p2");

    expect(bracket.rounds[0].matches[0].status).toBe("ready");
    expect(bracket.rounds[0].matches[0].winnerId).toBeUndefined();
    expect(bracket.rounds[1].matches[0].participants[0]?.id).toBeUndefined();
    expect(advanced.rounds[0].matches[0]).toMatchObject({ status: "finished", winnerId: "p2" });
    expect(advanced.rounds[1].matches[0].participants[0]?.id).toBe("p2");
  });

  it("does not accept a non-participant or finish the same match twice", () => {
    const bracket = generateSingleEliminationBracket(participants(2), keepOriginalOrder);
    expect(() => advanceBracketWinner(bracket, "round-1-match-1", "other")).toThrow(
      "O vencedor deve participar do confronto.",
    );
    const finished = advanceBracketWinner(bracket, "round-1-match-1", "p1");
    expect(() => advanceBracketWinner(finished, "round-1-match-1", "p1")).toThrow(
      "Este confronto já foi finalizado.",
    );
  });
});
