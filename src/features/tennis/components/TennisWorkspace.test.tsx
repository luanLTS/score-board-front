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
});
