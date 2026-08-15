import { describe, expect, it } from "vitest";

import type { FinishedMatch } from "../matches/types";
import { formatResultShareText } from "./formatResultShareText";

const match: FinishedMatch = {
  id: "match-1",
  status: "finished",
  gameKind: "truco",
  startedAt: "2026-08-15T12:00:00.000Z",
  finishedAt: "2026-08-15T12:30:00.000Z",
  participants: [
    { id: "a", name: "Ana", score: 12 },
    { id: "b", name: "Bia", score: 8 },
  ],
  result: { type: "winner", winnerId: "a" },
};

describe("formatResultShareText", () => {
  it("formats every relevant result field predictably", () => {
    expect(formatResultShareText(match, () => "15/08/2026 09:30")).toBe(
      "Resultado da partida\nAna 12 x 8 Bia\nJogo: Truco\nData: 15/08/2026 09:30\nVencedor: Ana",
    );
  });

  it("describes a draw explicitly", () => {
    expect(
      formatResultShareText(
        { ...match, result: { type: "draw" } },
        () => "15/08/2026",
      ),
    ).toContain("Resultado: empate");
  });

  it("supports the legacy winner field", () => {
    const { result: _result, ...legacyMatch } = match;
    expect(
      formatResultShareText(
        { ...legacyMatch, winnerId: "b" },
        () => "15/08/2026",
      ),
    ).toContain("Vencedor: Bia");
  });
});
