import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

import type { FinishedMatch } from "../types";

import { MatchFinishedActions } from "./MatchFinishedActions";

const finishedMatch = (draw = false): FinishedMatch => ({
  id: "match-1",
  gameKind: "generic",
  status: "finished",
  startedAt: new Date(0),
  finishedAt: new Date(1),
  participants: [
    { id: "player-1", name: "Ana", score: draw ? 2 : 3 },
    { id: "player-2", name: "Bia", score: 2 },
  ],
  result: draw
    ? { type: "draw" }
    : { type: "winner", winnerId: "player-1" },
  winnerId: draw ? undefined : "player-1",
});

describe("MatchFinishedActions", () => {
  it("shows the winner and starts the new-match flow", async () => {
    const onNewMatch = vi.fn();
    render(
      <MatchFinishedActions match={finishedMatch()} onNewMatch={onNewMatch} />,
    );

    expect(screen.getByRole("heading", { name: "Ana venceu" })).toBeVisible();
    expect(screen.getByText("Ana 3 × 2 Bia")).toBeVisible();

    await userEvent.click(
      screen.getByRole("button", { name: "Novo confronto" }),
    );
    expect(onNewMatch).toHaveBeenCalledOnce();
  });

  it("shows a draw explicitly", () => {
    render(
      <MatchFinishedActions match={finishedMatch(true)} onNewMatch={vi.fn()} />,
    );

    expect(screen.getByRole("heading", { name: "Empate" })).toBeVisible();
  });
});
