import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

import type { TournamentBracket } from "../types";
import { BracketView } from "./BracketView";

describe("BracketView", () => {
  it("shows rounds and starts only ready matches", async () => {
    const user = userEvent.setup();
    const onPlayMatch = vi.fn();
    const bracket: TournamentBracket = {
      rounds: [{ number: 1, matches: [{ id: "m1", round: 1, position: 0, participants: [{ id: "a", name: "Ana" }, { id: "b", name: "Bia" }], status: "ready" }] }],
    };

    render(<BracketView bracket={bracket} onPlayMatch={onPlayMatch} />);
    expect(screen.getByText("Final")).toBeInTheDocument();
    await user.click(screen.getByRole("button", { name: "Jogar confronto" }));
    expect(onPlayMatch).toHaveBeenCalledWith(bracket.rounds[0].matches[0]);
  });
});
