import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

import type { Match, PendingMatch } from "../types";

import { CurrentMatchView } from "./CurrentMatchView";

const baseMatch: Omit<PendingMatch, "status"> = {
  id: "match-1",
  gameKind: "generic" as const,
  participants: [
    { id: "player-1", name: "Ana", score: 0 },
    { id: "player-2", name: "Bia", score: 0 },
  ],
};

describe("CurrentMatchView", () => {
  it("shows a pending match and offers to start it", async () => {
    const onStart = vi.fn();
    const match: Match = { ...baseMatch, status: "pending" };

    render(
      <CurrentMatchView
        match={match}
        onFinish={vi.fn()}
        onNewMatch={vi.fn()}
        onStart={onStart}
        onUpdateScores={vi.fn()}
      />,
    );

    expect(screen.getByText("Pendente")).toBeVisible();
    expect(screen.getByRole("heading", { name: "Ana × Bia" })).toBeVisible();
    await userEvent.click(screen.getByRole("button", { name: "Iniciar partida" }));
    expect(onStart).toHaveBeenCalledOnce();
  });

  it("composes the scoreboard during a match and reports its final scores", async () => {
    const onFinish = vi.fn();
    const onUpdateScores = vi.fn();
    const match: Match = {
      ...baseMatch,
      status: "in_progress",
      startedAt: new Date(),
    };
    render(
      <CurrentMatchView
        match={match}
        onFinish={onFinish}
        onNewMatch={vi.fn()}
        onStart={vi.fn()}
        onUpdateScores={onUpdateScores}
      />,
    );

    await userEvent.click(
      screen.getByRole("button", { name: "Adicionar ponto para Ana" }),
    );
    await userEvent.click(screen.getByRole("button", { name: "Finalizar partida" }));

    expect(onUpdateScores).toHaveBeenCalledWith([1, 0]);
    expect(onFinish).toHaveBeenCalledOnce();
  });

  it("does not render mutable scoreboard controls after finishing", () => {
    const match: Match = {
      ...baseMatch,
      status: "finished",
      startedAt: new Date(0),
      finishedAt: new Date(1),
      result: { type: "draw" },
    };
    render(
      <CurrentMatchView
        match={match}
        onFinish={vi.fn()}
        onNewMatch={vi.fn()}
        onStart={vi.fn()}
        onUpdateScores={vi.fn()}
      />,
    );

    expect(screen.getByRole("heading", { name: "Empate" })).toBeVisible();
    expect(screen.queryByRole("button", { name: /Adicionar ponto/ })).toBeNull();
  });
});
