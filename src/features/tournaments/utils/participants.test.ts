import { describe, expect, it } from "vitest";
import { validateTournamentParticipants } from "./participants";

describe("validateTournamentParticipants", () => {
  it("requires at least two participants", () => {
    expect(validateTournamentParticipants([{ id: "1", name: "Ana" }])).toMatchObject({
      valid: false,
      error: "minimum_participants",
    });
  });

  it("rejects duplicate identifiers and empty names", () => {
    expect(
      validateTournamentParticipants([
        { id: "1", name: "Ana" },
        { id: "1", name: "Bia" },
      ]),
    ).toMatchObject({ valid: false, error: "duplicate_id" });
    expect(
      validateTournamentParticipants([
        { id: "1", name: "Ana" },
        { id: "2", name: "  " },
      ]),
    ).toMatchObject({ valid: false, error: "empty_name" });
  });

  it("accepts a valid participant list", () => {
    expect(
      validateTournamentParticipants([
        { id: "1", name: "Ana" },
        { id: "2", name: "Bia" },
      ]),
    ).toEqual({ valid: true });
  });
});
