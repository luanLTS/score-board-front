import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it } from "vitest";

import { TennisWorkspace } from "./TennisWorkspace";
import { TENNIS_STORAGE_KEYS } from "../../../lib/storage";

describe("TennisWorkspace", () => {
  beforeEach(() => window.localStorage.clear());

  it("shows the entry points for the tennis experience", () => {
    render(<TennisWorkspace />);

    expect(screen.getByRole("heading", { name: "Tênis" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Partida" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Ranking" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Campeonato" })).toBeInTheDocument();
  });

  it("starts and scores a simple tennis match", async () => {
    const user = userEvent.setup();
    render(<TennisWorkspace />);

    await user.click(screen.getByRole("button", { name: "Partida" }));
    await user.clear(screen.getByLabelText("Nome do jogador 1"));
    await user.type(screen.getByLabelText("Nome do jogador 1"), "Ana");
    await user.clear(screen.getByLabelText("Nome do jogador 2"));
    await user.type(screen.getByLabelText("Nome do jogador 2"), "Bia");
    await user.click(screen.getByRole("button", { name: "Iniciar super tie-break" }));

    expect(screen.getByRole("heading", { name: "Super tie-break" })).toBeInTheDocument();
    await user.click(screen.getByRole("button", { name: "Ponto para Ana" }));
    expect(screen.getByLabelText("Placar do super tie-break")).toHaveTextContent("1 × 0");
  });

  it("saves a finished simple match in the tennis history", async () => {
    const user = userEvent.setup();
    render(<TennisWorkspace />);

    await user.click(screen.getByRole("button", { name: "Partida" }));
    await user.clear(screen.getByLabelText("Nome do jogador 1"));
    await user.type(screen.getByLabelText("Nome do jogador 1"), "Ana");
    await user.clear(screen.getByLabelText("Nome do jogador 2"));
    await user.type(screen.getByLabelText("Nome do jogador 2"), "Bia");
    await user.click(screen.getByRole("button", { name: "Iniciar super tie-break" }));

    for (let point = 0; point < 10; point += 1) {
      await user.click(screen.getByRole("button", { name: "Ponto para Ana" }));
    }
    await user.click(screen.getByRole("button", { name: "Nova partida" }));

    const history = JSON.parse(window.localStorage.getItem(TENNIS_STORAGE_KEYS.matchHistoryV1) ?? "[]") as Array<{ winnerId: string }>;
    expect(history).toHaveLength(1);
    expect(history[0].winnerId).toBe("player-1");
  });

  it("opens the functional championship setup", async () => {
    const user = userEvent.setup();
    render(<TennisWorkspace />);

    await user.click(screen.getByRole("button", { name: "Campeonato" }));

    expect(screen.getByLabelText("Participantes")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Iniciar campeonato" })).toBeInTheDocument();
  });

  it("shows global tennis ranking, selected match details, and format metadata", async () => {
    const user = userEvent.setup();
    window.localStorage.setItem(TENNIS_STORAGE_KEYS.matchHistoryV1, JSON.stringify([
      { id: "simple-1", format: "super_tiebreak", source: "simple", participants: [{ id: "a", name: " Ana " }, { id: "b", name: "Bia" }], finalScore: [10, 5], firstServerId: "a", winnerId: "a", startedAt: "2026-10-19T10:00:00Z", finishedAt: "2026-10-19T10:10:00Z" },
      { id: "qual-1", format: "super_tiebreak", source: "qualifying", tournamentId: "cup", tournamentName: "Copa", roundLabel: "Turno 1", participants: [{ id: "a2", name: "ana" }, { id: "c", name: "Carlos" }], finalScore: [10, 7], firstServerId: "a2", winnerId: "a2", startedAt: "2026-10-19T11:00:00Z", finishedAt: "2026-10-19T11:10:00Z" },
      { id: "elim-1", format: "best_of_three_games", source: "elimination", tournamentId: "cup", tournamentName: "Copa", roundLabel: "Final", participants: [{ id: "a", name: "Ana" }, { id: "c", name: "Carlos" }], finalScore: [2, 1], firstServerId: "a", winnerId: "a", startedAt: "2026-10-19T12:00:00Z", finishedAt: "2026-10-19T12:20:00Z", games: [{ score: [1, 0], points: ["40", "15"] }] },
    ]));
    render(<TennisWorkspace />);
    await user.click(screen.getByRole("button", { name: "Ranking" }));

    expect(screen.getByText("1º", { exact: false })).toBeInTheDocument();
    expect(screen.getByRole("option", { name: "Ana" })).toBeInTheDocument();
    expect(screen.getByRole("option", { name: "Bia" })).toBeInTheDocument();
    await user.click(screen.getByRole("button", { name: /ana 10 x 7 Carlos/i }));
    expect(screen.getByText("Campeonato: Copa")).toBeInTheDocument();
    expect(screen.getByText("Fase: Turno 1")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Compartilhar resultado" })).toBeInTheDocument();
  });
});
