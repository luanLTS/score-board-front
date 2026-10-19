import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it } from "vitest";

import { TennisTournamentWorkspace } from "./TennisTournamentWorkspace";
import { TENNIS_STORAGE_KEYS } from "../../../lib/storage";

describe("TennisTournamentWorkspace", () => {
  beforeEach(() => window.localStorage.clear());

  it("creates a championship with named participants and opens its first turn", async () => {
    const user = userEvent.setup();
    render(<TennisTournamentWorkspace />);

    await user.clear(screen.getByLabelText("Participantes"));
    await user.type(screen.getByLabelText("Participantes"), "Ana, Bia, Carlos, Davi");
    await user.click(screen.getByRole("button", { name: "Iniciar campeonato" }));

    expect(screen.getByRole("heading", { name: "Campeonato de tênis" })).toBeInTheDocument();
    expect(screen.getByText("Turno 1")).toBeInTheDocument();
    expect(screen.getAllByRole("button", { name: "Jogar partida" })).toHaveLength(6);
  });

  it("restores an active qualifying match after reload", async () => {
    const user = userEvent.setup();
    const { unmount } = render(<TennisTournamentWorkspace />);

    await user.clear(screen.getByLabelText("Participantes"));
    await user.type(screen.getByLabelText("Participantes"), "Ana, Bia");
    await user.click(screen.getByRole("button", { name: "Iniciar campeonato" }));
    await user.click(screen.getByRole("button", { name: "Jogar partida" }));
    await user.click(screen.getByRole("button", { name: "Ponto para Ana" }));

    await waitFor(() => {
      const saved = JSON.parse(window.localStorage.getItem(TENNIS_STORAGE_KEYS.currentTournamentV1) ?? "null") as { activeMatch?: { scores: number[] } };
      expect(saved.activeMatch?.scores).toEqual([1, 0]);
    });

    unmount();
    render(<TennisTournamentWorkspace />);
    expect(screen.getByLabelText("Placar do super tie-break")).toHaveTextContent("1 × 0");
  });

  it("resumes the active qualifying match after returning to the tournament", async () => {
    const user = userEvent.setup();
    render(<TennisTournamentWorkspace />);

    await user.clear(screen.getByLabelText("Participantes"));
    await user.type(screen.getByLabelText("Participantes"), "Ana, Bia");
    await user.click(screen.getByRole("button", { name: "Iniciar campeonato" }));
    await user.click(screen.getByRole("button", { name: "Jogar partida" }));
    await user.click(screen.getByRole("button", { name: "Ponto para Ana" }));
    await user.click(screen.getByRole("button", { name: "Voltar ao campeonato" }));
    await user.click(screen.getByRole("button", { name: "Jogar partida" }));

    expect(screen.getByLabelText("Placar do super tie-break")).toHaveTextContent("1 × 0");
  });

  it("does not crash when the tournament was already finished before the final point is rendered", async () => {
    const user = userEvent.setup();
    window.localStorage.setItem(TENNIS_STORAGE_KEYS.currentTournamentV1, JSON.stringify({
      id: "t1",
      name: "Copa",
      phase: "elimination",
      status: "finished",
      participants: [{ id: "a", name: "Ana" }, { id: "b", name: "Bia" }],
      currentTurn: 1,
      turns: [],
      ranking: [{ participantId: "a", wins: 0, pointDifferential: 0 }, { participantId: "b", wins: 0, pointDifferential: 0 }],
      activeMatchId: "tennis-round-1-match-1",
      activeMatch: {
        format: "best_of_three_games",
        status: "in_progress",
        participants: ["a", "b"],
        firstServerId: "a",
        serverId: "a",
        gamesWon: [1, 1],
        games: [{ participants: ["a", "b"], points: [40, 0], gamesWon: [1, 1], status: "in_progress" }],
      },
      eliminationBracket: {
        rounds: [{ number: 1, matches: [{ id: "tennis-round-1-match-1", round: 1, position: 0, participants: [{ id: "a", name: "Ana" }, { id: "b", name: "Bia" }], status: "ready" }] }],
      },
    }));

    render(<TennisTournamentWorkspace />);

    await user.click(screen.getByRole("button", { name: "Ponto para Ana" }));

    expect(screen.getByText("Finalizado")).toBeInTheDocument();
  });

  it("advances the second semifinal winner without restoring the first match score", async () => {
    const user = userEvent.setup();
    window.localStorage.setItem(TENNIS_STORAGE_KEYS.currentTournamentV1, JSON.stringify({
      id: "t1",
      name: "Copa",
      phase: "elimination",
      status: "elimination_in_progress",
      participants: [
        { id: "a", name: "Ana" },
        { id: "b", name: "Bia" },
        { id: "c", name: "Carlos" },
        { id: "d", name: "Davi" },
      ],
      currentTurn: 1,
      turns: [],
      ranking: [
        { participantId: "a", wins: 0, pointDifferential: 0 },
        { participantId: "b", wins: 0, pointDifferential: 0 },
        { participantId: "c", wins: 0, pointDifferential: 0 },
        { participantId: "d", wins: 0, pointDifferential: 0 },
      ],
      eliminationBracket: {
        rounds: [
          { number: 1, matches: [
            { id: "tennis-round-1-match-1", round: 1, position: 0, participants: [{ id: "a", name: "Ana" }, { id: "d", name: "Davi" }], status: "ready", nextMatchId: "tennis-round-2-match-1", nextParticipantSlot: 0 },
            { id: "tennis-round-1-match-2", round: 1, position: 1, participants: [{ id: "b", name: "Bia" }, { id: "c", name: "Carlos" }], status: "ready", nextMatchId: "tennis-round-2-match-1", nextParticipantSlot: 1 },
          ] },
          { number: 2, matches: [
            { id: "tennis-round-2-match-1", round: 2, position: 0, participants: [null, null], status: "pending" },
          ] },
        ],
      },
    }));

    render(<TennisTournamentWorkspace />);

    await user.click(screen.getAllByRole("button", { name: "Jogar confronto" })[0]);
    for (let index = 0; index < 8; index += 1) await user.click(screen.getByRole("button", { name: "Ponto para Ana" }));

    expect(screen.getAllByRole("button", { name: "Jogar confronto" })).toHaveLength(1);
    await user.click(screen.getByRole("button", { name: "Jogar confronto" }));
    expect(screen.getByText("0 × 0")).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: "Ponto para Bia" }));
    expect(screen.getByText("15 × 0")).toBeInTheDocument();

    for (let index = 0; index < 7; index += 1) await user.click(screen.getByRole("button", { name: "Ponto para Bia" }));

    expect(screen.getByRole("button", { name: "Jogar confronto" })).toBeInTheDocument();
    expect(screen.getAllByText("Ana", { exact: true }).length).toBeGreaterThan(1);
    expect(screen.getAllByText("Bia", { exact: true }).length).toBeGreaterThan(1);
  });
});
