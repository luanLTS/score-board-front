import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it } from "vitest";

import {
  HISTORY_STORAGE_KEYS,
  SCOREBOARD_STORAGE_KEYS,
} from "../lib/storage";

import { App } from "./App";

describe("App phase 3 persistence and history", () => {
  beforeEach(() => {
    window.localStorage.clear();
  });

  it("restores the current scoreboard from localStorage", () => {
    window.localStorage.setItem(
      SCOREBOARD_STORAGE_KEYS.currentScoreboardV1,
      JSON.stringify({
        players: [
          { id: "player-1", name: "Ana", score: 2 },
          { id: "player-2", name: "Bruno", score: 1 },
        ],
      }),
    );

    render(<App />);

    expect(screen.getByDisplayValue("Ana")).toBeInTheDocument();
    expect(screen.getByLabelText("Pontuação de Ana")).toHaveTextContent("2");
    expect(screen.getByDisplayValue("Bruno")).toBeInTheDocument();
    expect(screen.getByLabelText("Pontuação de Bruno")).toHaveTextContent("1");
  });

  it("finishes a match, shows it in history, opens details, and can clear only the current scoreboard", async () => {
    const user = userEvent.setup();

    render(<App />);

    await user.clear(screen.getByLabelText("Nome do participante 1"));
    await user.type(screen.getByLabelText("Nome do participante 1"), "Ana");
    await user.clear(screen.getByLabelText("Nome do participante 2"));
    await user.type(screen.getByLabelText("Nome do participante 2"), "Bruno");
    await user.selectOptions(screen.getByLabelText("Tipo de jogo"), "fifa");
    await user.click(screen.getByRole("button", { name: "Iniciar partida" }));
    await user.click(
      screen.getByRole("button", { name: "Adicionar ponto para Ana" }),
    );
    await user.click(
      screen.getByRole("button", { name: "Adicionar ponto para Bruno" }),
    );
    await user.click(
      screen.getByRole("button", { name: "Adicionar ponto para Bruno" }),
    );

    await user.click(
      screen.getByRole("button", { name: "Finalizar partida" }),
    );
    expect(screen.getByRole("button", { name: /Ana 1 x 2 Bruno/i }))
      .toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "Ana x Bruno" }))
      .toBeInTheDocument();
    expect(screen.getByLabelText("Placar final")).toHaveTextContent("1 x 2");
    expect(screen.getAllByText("Fifa").length).toBeGreaterThan(0);
    expect(
      JSON.parse(
        window.localStorage.getItem(
          HISTORY_STORAGE_KEYS.finishedMatchesV1,
        ) ?? "[]",
      )[0],
    ).toMatchObject({ gameKind: "fifa" });
    expect(
      JSON.parse(
        window.localStorage.getItem(
          HISTORY_STORAGE_KEYS.finishedMatchesV1,
        ) ?? "[]",
      ),
    ).toHaveLength(1);

    await user.click(
      screen.getByRole("button", { name: "Novo confronto" }),
    );

    expect(screen.getByDisplayValue("Jogador 1")).toBeInTheDocument();
    expect(screen.getByDisplayValue("Jogador 2")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /Ana 1 x 2 Bruno/i }))
      .toBeInTheDocument();
  });

  it("creates an elimination tournament and opens a bracket match in the scoreboard", async () => {
    const user = userEvent.setup();
    render(<App />);

    await user.click(screen.getByRole("button", { name: "Torneio" }));
    await user.type(screen.getByLabelText("Nome do torneio"), "Copa local");
    const participantInput = screen.getByLabelText("Nome do participante");
    await user.type(participantInput, "Ana");
    await user.click(screen.getByRole("button", { name: "Adicionar" }));
    await user.type(participantInput, "Bia");
    await user.click(screen.getByRole("button", { name: "Adicionar" }));
    await user.click(screen.getByRole("button", { name: "Criar torneio" }));

    expect(screen.getByRole("heading", { name: "Copa local" })).toBeInTheDocument();
    await user.click(screen.getByRole("button", { name: "Jogar confronto" }));
    expect(screen.getByDisplayValue("Ana")).toBeInTheDocument();
    expect(screen.getByDisplayValue("Bia")).toBeInTheDocument();
    await user.click(screen.getByRole("button", { name: "Adicionar ponto para Ana" }));
    await user.click(screen.getByRole("button", { name: "Finalizar partida" }));

    expect(await screen.findByText(/Campeão:/)).toHaveTextContent("Ana");
    expect(screen.getByText("Confronto finalizado")).toBeInTheDocument();
  });
});
