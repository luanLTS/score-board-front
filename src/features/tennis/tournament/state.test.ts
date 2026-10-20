import { describe, expect, it } from "vitest";

import {
  closeQualifyingTurn,
  createTennisTournament,
  recordEliminationWinner,
  startAnotherQualifyingTurn,
  startEliminationPhase,
  startQualifyingTurn,
  reopenPrematureTennisFinal,
} from "./state";
import type { TennisQualifyingMatch } from "./types";
import { generateQualifyingMatches } from "./schedule";

const match = (id: string, status: TennisQualifyingMatch["status"]): TennisQualifyingMatch => ({
  id,
  format: "super_tiebreak",
  participants: ["ana", "bia"],
  status,
  scores: status === "finished" ? [10, 8] : undefined,
  winnerId: status === "finished" ? "ana" : undefined,
});

const eliminationWithPlayers = (count: number) => {
  const ids = Array.from({ length: count }, (_, index) => `p${index + 1}`);
  const qualifyingMatches = generateQualifyingMatches(ids, 1).map((game): TennisQualifyingMatch => ({
    ...game,
    status: "finished",
    scores: [10, 0],
    winnerId: game.participants[0],
  }));
  const closed = closeQualifyingTurn(startQualifyingTurn(
    createTennisTournament("Copa local", ids),
    qualifyingMatches,
  ));
  return startEliminationPhase(closed);
};

describe("tennis tournament state", () => {
  it("moves from setup to a qualifying turn", () => {
    const tournament = createTennisTournament("Copa local", ["ana", "bia"]);
    const active = startQualifyingTurn(tournament, [match("m1", "pending")]);

    expect(active).toMatchObject({
      status: "turn_in_progress",
      phase: "qualifying",
      currentTurn: 1,
    });
  });

  it("rejects closing a turn with pending matches", () => {
    const tournament = startQualifyingTurn(
      createTennisTournament("Copa local", ["ana", "bia"]),
      [match("m1", "pending")],
    );

    expect(() => closeQualifyingTurn(tournament)).toThrow(
      "Finalize todas as partidas do turno antes de fechá-lo.",
    );
  });

  it("allows another turn or elimination only after closing the current turn", () => {
    const initial = startQualifyingTurn(
      createTennisTournament("Copa local", ["ana", "bia"]),
      [match("m1", "finished")],
    );
    const closed = closeQualifyingTurn(initial);

    expect(closed.status).toBe("turn_closed");
    expect(closed.ranking[0]).toMatchObject({ participantId: "ana", wins: 1 });
    expect(startAnotherQualifyingTurn(closed, [match("m2", "pending")])).toMatchObject({
      currentTurn: 2,
      ranking: closed.ranking,
    });
    expect(startEliminationPhase(closed).status).toBe("elimination_in_progress");
    expect(() => startEliminationPhase(initial)).toThrow();
  });

  it("advances an elimination winner and finishes the tournament at the final", () => {
    const closed = closeQualifyingTurn(startQualifyingTurn(
      createTennisTournament("Copa local", ["ana", "bia"]),
      [match("m1", "finished")],
    ));
    const elimination = startEliminationPhase(closed);
    const finished = recordEliminationWinner(
      elimination,
      elimination.eliminationBracket!.rounds[0].matches[0].id,
      "ana",
    );

    expect(finished.status).toBe("finished");
    expect(finished.eliminationBracket?.rounds[0].matches[0].winnerId).toBe("ana");
  });

  it("keeps a five-player tournament open until its real final is played", () => {
    let tournament = eliminationWithPlayers(5);

    expect(tournament.eliminationBracket?.rounds[2].matches[0].status).toBe("pending");

    tournament = recordEliminationWinner(tournament, "tennis-round-1-match-1", "p1");
    expect(tournament.status).toBe("elimination_in_progress");
    expect(tournament.eliminationBracket?.rounds[2].matches[0].status).toBe("pending");

    tournament = recordEliminationWinner(tournament, "tennis-round-1-match-2", "p2");
    expect(tournament.eliminationBracket?.rounds[1].matches[0].status).toBe("ready");

    tournament = recordEliminationWinner(tournament, "tennis-round-2-match-1", "p1");
    expect(tournament.status).toBe("elimination_in_progress");
    expect(tournament.eliminationBracket?.rounds[2].matches[0].status).toBe("ready");

    tournament = recordEliminationWinner(tournament, "tennis-round-3-match-1", "p3");
    expect(tournament.status).toBe("finished");
    expect(tournament.eliminationBracket?.rounds[2].matches[0].winnerId).toBe("p3");
  });

  it.each([2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16])("requires exactly %i-player elimination results before finishing", (count) => {
    let tournament = eliminationWithPlayers(count);
    let played = 0;

    while (tournament.status === "elimination_in_progress") {
      const ready = tournament.eliminationBracket?.rounds
        .flatMap((round) => round.matches)
        .find((candidate) => candidate.status === "ready");
      expect(ready).toBeDefined();
      tournament = recordEliminationWinner(tournament, ready!.id, ready!.participants[0]!.id);
      played += 1;
      expect(played).toBeLessThanOrEqual(count - 1);
      if (played < count - 1) expect(tournament.status).toBe("elimination_in_progress");
    }

    expect(played).toBe(count - 1);
    expect(tournament.status).toBe("finished");
    expect(tournament.eliminationBracket?.rounds.at(-1)?.matches[0].status).toBe("finished");
  });

  it("does not reopen a cancelled tournament that contains an old malformed final", () => {
    const cancelled = eliminationWithPlayers(5);
    cancelled.status = "cancelled";
    cancelled.eliminationBracket!.rounds[2].matches[0].status = "finished";
    cancelled.eliminationBracket!.rounds[2].matches[0].winnerId = "p3";

    const restored = reopenPrematureTennisFinal(cancelled);

    expect(restored.status).toBe("cancelled");
  });
});
