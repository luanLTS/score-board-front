import { describe, expect, it } from "vitest";

import {
  closeQualifyingTurn,
  createTennisTournament,
  recordEliminationWinner,
  startAnotherQualifyingTurn,
  startEliminationPhase,
  startQualifyingTurn,
} from "./state";
import type { TennisQualifyingMatch } from "./types";

const match = (id: string, status: TennisQualifyingMatch["status"]): TennisQualifyingMatch => ({
  id,
  format: "super_tiebreak",
  participants: ["ana", "bia"],
  status,
  scores: status === "finished" ? [10, 8] : undefined,
  winnerId: status === "finished" ? "ana" : undefined,
});

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
});
