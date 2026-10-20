import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it } from "vitest";

import { TennisTournamentWorkspace } from "./TennisTournamentWorkspace";
import { TENNIS_STORAGE_KEYS } from "../../../lib/storage";
import { createTennisEliminationBracket } from "../tournament/bracketAdapter";
import { createTennisTournament } from "../tournament/state";
import { advanceBracketWinner } from "../../tournaments/utils/bracket";

describe("TennisTournamentWorkspace", () => {
  beforeEach(() => window.localStorage.clear());

  it("uses the scoreboard tournament form and saves the chosen name", async () => {
    const user = userEvent.setup();
    render(<TennisTournamentWorkspace />);

    expect(screen.getByText("Novo torneio")).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "Monte o chaveamento" })).toBeInTheDocument();
    expect(screen.queryByRole("region", { name: "Histórico de torneios" })).not.toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Criar torneio" })).toBeDisabled();

    await user.type(screen.getByLabelText("Nome do torneio"), "Copa de tênis");
    await user.type(screen.getByLabelText("Participantes separados por vírgula"), "Ana, Bia");
    await user.click(screen.getByRole("button", { name: "Criar torneio" }));

    expect(screen.getByRole("heading", { name: "Copa de tênis" })).toBeInTheDocument();
    await waitFor(() => {
      const saved = JSON.parse(window.localStorage.getItem(TENNIS_STORAGE_KEYS.currentTournamentV1) ?? "null") as { name: string };
      expect(saved.name).toBe("Copa de tênis");
    });
  });

  it("creates a tournament with named participants and opens its first turn", async () => {
    const user = userEvent.setup();
    render(<TennisTournamentWorkspace />);

    await user.type(screen.getByLabelText("Nome do torneio"), "Copa local");
    await user.type(screen.getByLabelText("Participantes separados por vírgula"), "Ana, Bia, Carlos, Davi");
    await user.click(screen.getByRole("button", { name: "Criar torneio" }));

    expect(screen.getByText("Torneio de tênis")).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "Copa local" })).toBeInTheDocument();
    expect(screen.getByText("Turno 1")).toBeInTheDocument();
    expect(screen.getAllByRole("button", { name: "Jogar partida" })).toHaveLength(6);
  });

  it("cancels from the tournament screen, preserves completed matches, and archives the tournament", async () => {
    const user = userEvent.setup();
    render(<TennisTournamentWorkspace />);
    await user.type(screen.getByLabelText("Nome do torneio"), "Copa local");
    await user.type(screen.getByLabelText("Participantes separados por vírgula"), "Ana, Bia, Carlos, Davi");
    await user.click(screen.getByRole("button", { name: "Criar torneio" }));
    await user.click(screen.getAllByRole("button", { name: "Jogar partida" })[0]);
    expect(screen.queryByRole("button", { name: /^Cancelar /i })).not.toBeInTheDocument();
    for (let index = 0; index < 10; index += 1) await user.click(screen.getByRole("button", { name: "Ponto para Ana" }));
    await user.click(screen.getByRole("button", { name: "Voltar ao torneio" }));
    await user.click(screen.getAllByRole("button", { name: "Jogar partida" })[0]);
    expect(screen.queryByRole("button", { name: /^Cancelar /i })).not.toBeInTheDocument();
    await user.click(screen.getByRole("button", { name: "Voltar ao torneio" }));
    await user.click(screen.getByRole("button", { name: "Cancelar torneio" }));
    expect(screen.getByText(/Cancelar o torneio\?/)).toBeInTheDocument();
    await user.click(screen.getByRole("button", { name: "Confirmar cancelamento" }));

    const saved = JSON.parse(window.localStorage.getItem(TENNIS_STORAGE_KEYS.matchHistoryV1) ?? "[]") as Array<{ winnerId: string }>;
    const archived = JSON.parse(window.localStorage.getItem(TENNIS_STORAGE_KEYS.tournamentHistoryV1) ?? "[]") as Array<{ status: string; turns: Array<{ matches: Array<{ status: string }> }> }>;
    expect(saved).toHaveLength(1);
    expect(saved[0].winnerId).toBe("tennis-player-1");
    expect(archived[0].status).toBe("cancelled");
    expect(archived[0].turns[0].matches.filter(({ status }) => status === "finished")).toHaveLength(1);
    expect(archived[0].turns[0].matches.filter(({ status }) => status === "pending")).toHaveLength(5);
  });

  it("restores an active qualifying match after reload", async () => {
    const user = userEvent.setup();
    const { unmount } = render(<TennisTournamentWorkspace />);

    await user.type(screen.getByLabelText("Nome do torneio"), "Copa local");
    await user.type(screen.getByLabelText("Participantes separados por vírgula"), "Ana, Bia");
    await user.click(screen.getByRole("button", { name: "Criar torneio" }));
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

    await user.type(screen.getByLabelText("Nome do torneio"), "Copa local");
    await user.type(screen.getByLabelText("Participantes separados por vírgula"), "Ana, Bia");
    await user.click(screen.getByRole("button", { name: "Criar torneio" }));
    await user.click(screen.getByRole("button", { name: "Jogar partida" }));
    await user.click(screen.getByRole("button", { name: "Ponto para Ana" }));
    await user.click(screen.getByRole("button", { name: "Voltar ao torneio" }));
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
    await waitFor(() => {
      const history = JSON.parse(window.localStorage.getItem(TENNIS_STORAGE_KEYS.tournamentHistoryV1) ?? "[]") as Array<{ id: string; status: string }>;
      expect(history).toHaveLength(1);
      expect(history[0]).toMatchObject({ id: "t1", status: "finished" });
    });
  });

  it("cancels an elimination tournament from its overview, discards the active score, and allows a new tournament", async () => {
    const user = userEvent.setup();
    window.localStorage.setItem(TENNIS_STORAGE_KEYS.currentTournamentV1, JSON.stringify({
      id: "cup-elim", name: "Copa", phase: "elimination", status: "elimination_in_progress",
      participants: [{ id: "a", name: "Ana" }, { id: "b", name: "Bia" }], currentTurn: 1, turns: [],
      ranking: [{ participantId: "a", wins: 0, pointDifferential: 0 }, { participantId: "b", wins: 0, pointDifferential: 0 }],
      activeMatchId: "final", activeMatch: { format: "best_of_three_games", status: "in_progress", participants: ["a", "b"], firstServerId: "a", serverId: "a", gamesWon: [1, 1], games: [{ participants: ["a", "b"], points: [40, 0], gamesWon: [1, 1], status: "in_progress" }] },
      eliminationBracket: { rounds: [{ number: 1, matches: [{ id: "final", round: 1, position: 0, participants: [{ id: "a", name: "Ana" }, { id: "b", name: "Bia" }], status: "ready" }] }] },
    }));
    render(<TennisTournamentWorkspace />);
    expect(screen.queryByRole("button", { name: /^Cancelar /i })).not.toBeInTheDocument();
    await user.click(screen.getByRole("button", { name: "Voltar ao torneio" }));
    await user.click(screen.getByRole("button", { name: "Cancelar torneio" }));
    await user.click(screen.getByRole("button", { name: "Confirmar cancelamento" }));
    const archive = JSON.parse(window.localStorage.getItem(TENNIS_STORAGE_KEYS.tournamentHistoryV1) ?? "[]") as Array<{ status: string; activeMatch?: unknown }>;
    expect(archive[0]).toMatchObject({ status: "cancelled" });
    expect(archive[0].activeMatch).toBeUndefined();
    expect(JSON.parse(window.localStorage.getItem(TENNIS_STORAGE_KEYS.matchHistoryV1) ?? "[]")).toEqual([]);
    await user.click(screen.getByRole("button", { name: "Iniciar novo torneio" }));
    expect(screen.getByLabelText("Participantes separados por vírgula")).toBeInTheDocument();
    expect(screen.getByRole("region", { name: "Histórico de torneios" })).toBeInTheDocument();
    expect(screen.getByText(/Copa · Cancelado/)).toBeInTheDocument();
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

  it("finishes a five-player tournament only after all four elimination matches", async () => {
    const user = userEvent.setup();
    const ids = ["a", "b", "c", "d", "e"];
    const names = ["Ana", "Bia", "Carlos", "Davi", "Eva"];
    const created = createTennisTournament("Copa cinco", ids);
    const participants = created.participants.map((participant, index) => ({ ...participant, name: names[index] }));
    window.localStorage.setItem(TENNIS_STORAGE_KEYS.currentTournamentV1, JSON.stringify({
      ...created,
      phase: "elimination",
      status: "elimination_in_progress",
      participants,
      eliminationBracket: createTennisEliminationBracket(participants),
    }));

    render(<TennisTournamentWorkspace />);

    for (const [index, winner] of ["Ana", "Bia", "Ana", "Ana"].entries()) {
      await user.click(screen.getAllByRole("button", { name: "Jogar confronto" })[0]);
      for (let point = 0; point < 8; point += 1) {
        await user.click(screen.getByRole("button", { name: `Ponto para ${winner}` }));
      }

      const saved = JSON.parse(window.localStorage.getItem(TENNIS_STORAGE_KEYS.currentTournamentV1) ?? "null") as {
        status: string;
        eliminationBracket: { rounds: Array<{ matches: Array<{ status: string }> }> };
      };
      expect(saved.status).toBe(index === 3 ? "finished" : "elimination_in_progress");
      expect(saved.eliminationBracket.rounds[2].matches[0].status).toBe(index === 3 ? "finished" : index === 2 ? "ready" : "pending");
      if (index < 3) expect(screen.getByText("Eliminatórias")).toBeInTheDocument();
    }

    expect(screen.getByText("Finalizado")).toBeInTheDocument();
    const matchHistory = JSON.parse(window.localStorage.getItem(TENNIS_STORAGE_KEYS.matchHistoryV1) ?? "[]") as unknown[];
    expect(matchHistory).toHaveLength(4);
    await waitFor(() => {
      const archive = JSON.parse(window.localStorage.getItem(TENNIS_STORAGE_KEYS.tournamentHistoryV1) ?? "[]") as unknown[];
      expect(archive).toHaveLength(1);
    });
  });

  it("reopens a saved five-player tournament whose final was finished by a premature bye", async () => {
    const user = userEvent.setup();
    const ids = ["a", "b", "c", "d", "e"];
    const names = ["Ana", "Bia", "Carlos", "Davi", "Eva"];
    const created = createTennisTournament("Copa cinco", ids);
    const participants = created.participants.map((participant, index) => ({ ...participant, name: names[index] }));
    const bracket = advanceBracketWinner(createTennisEliminationBracket(participants), "tennis-round-1-match-1", "a");
    const prematureBracket = structuredClone(bracket);
    prematureBracket.rounds[2].matches[0].status = "finished";
    prematureBracket.rounds[2].matches[0].winnerId = "c";
    const saved = {
      ...created,
      phase: "elimination",
      status: "finished",
      terminalAt: "2026-10-19T12:00:00Z",
      participants,
      eliminationBracket: prematureBracket,
    };
    window.localStorage.setItem(TENNIS_STORAGE_KEYS.currentTournamentV1, JSON.stringify(saved));
    window.localStorage.setItem(TENNIS_STORAGE_KEYS.tournamentHistoryV1, JSON.stringify([saved]));

    render(<TennisTournamentWorkspace />);

    expect(screen.getByText("Eliminatórias")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Jogar confronto" })).toBeInTheDocument();
    expect(screen.queryByRole("region", { name: "Histórico de torneios" })).not.toBeInTheDocument();
    await waitFor(() => {
      const restored = JSON.parse(window.localStorage.getItem(TENNIS_STORAGE_KEYS.currentTournamentV1) ?? "null") as {
        status: string;
        eliminationBracket: { rounds: Array<{ matches: Array<{ status: string; winnerId?: string }> }> };
      };
      expect(restored.status).toBe("elimination_in_progress");
      expect(restored.eliminationBracket.rounds[0].matches[0].winnerId).toBe("a");
      expect(restored.eliminationBracket.rounds[2].matches[0].status).toBe("pending");
    });

    for (const winner of ["Bia", "Ana", "Ana"]) {
      await user.click(screen.getByRole("button", { name: "Jogar confronto" }));
      for (let point = 0; point < 8; point += 1) {
        await user.click(screen.getByRole("button", { name: `Ponto para ${winner}` }));
      }
    }

    expect(screen.getByText("Finalizado")).toBeInTheDocument();
    await waitFor(() => {
      const archive = JSON.parse(window.localStorage.getItem(TENNIS_STORAGE_KEYS.tournamentHistoryV1) ?? "[]") as Array<{
        status: string;
        eliminationBracket: { rounds: Array<{ matches: Array<{ participants: unknown[] }> }> };
      }>;
      expect(archive).toHaveLength(1);
      expect(archive[0].status).toBe("finished");
      expect(archive[0].eliminationBracket.rounds[2].matches[0].participants.every(Boolean)).toBe(true);
    });
  });
});
