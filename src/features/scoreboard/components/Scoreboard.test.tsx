import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { Scoreboard } from "./Scoreboard";

describe("Scoreboard", () => {
  beforeEach(() => {
    window.localStorage.clear();
  });

  it("lets users edit names, score both players, block negative scores, and reset scores only", async () => {
    const user = userEvent.setup();

    render(<Scoreboard onFinishMatch={vi.fn()} />);

    const playerOneName = screen.getByLabelText("Nome do participante 1");
    const playerTwoName = screen.getByLabelText("Nome do participante 2");
    const playerOneScore = screen.getByLabelText("Pontuação de Jogador 1");
    const playerTwoScore = screen.getByLabelText("Pontuação de Jogador 2");
    const playerOneDecrement = screen.getByRole("button", {
      name: "Remover ponto de Jogador 1",
    });

    expect(playerOneScore).toHaveTextContent("0");
    expect(playerTwoScore).toHaveTextContent("0");
    expect(playerOneDecrement).toBeDisabled();

    await user.clear(playerOneName);
    await user.type(playerOneName, "Ana");
    await user.clear(playerTwoName);
    await user.type(playerTwoName, "Bruno");

    await user.click(
      screen.getByRole("button", { name: "Adicionar ponto para Ana" }),
    );
    await user.click(
      screen.getByRole("button", { name: "Adicionar ponto para Ana" }),
    );
    await user.click(
      screen.getByRole("button", { name: "Adicionar ponto para Bruno" }),
    );
    await user.click(
      screen.getByRole("button", { name: "Remover ponto de Ana" }),
    );

    expect(screen.getByLabelText("Pontuação de Ana")).toHaveTextContent("1");
    expect(screen.getByLabelText("Pontuação de Bruno")).toHaveTextContent("1");

    await user.click(screen.getByRole("button", { name: "Resetar pontuações" }));

    expect(screen.getByDisplayValue("Ana")).toBeInTheDocument();
    expect(screen.getByDisplayValue("Bruno")).toBeInTheDocument();
    expect(screen.getByLabelText("Pontuação de Ana")).toHaveTextContent("0");
    expect(screen.getByLabelText("Pontuação de Bruno")).toHaveTextContent("0");
    expect(
      screen.getByRole("button", { name: "Remover ponto de Ana" }),
    ).toBeDisabled();
  });

  it("lets users select a game kind and start a new current scoreboard", async () => {
    const user = userEvent.setup();
    const onFinishMatch = vi.fn();

    render(<Scoreboard onFinishMatch={onFinishMatch} />);

    await user.selectOptions(
      screen.getByLabelText("Tipo de partida"),
      "truco",
    );
    await user.clear(screen.getByLabelText("Nome do participante 1"));
    await user.type(screen.getByLabelText("Nome do participante 1"), "Ana");
    await user.click(
      screen.getByRole("button", { name: "Adicionar ponto para Ana" }),
    );

    await user.click(screen.getByRole("button", { name: "Finalizar partida" }));

    expect(onFinishMatch).toHaveBeenCalledWith({
      gameKind: "truco",
      players: [
        { id: "player-1", name: "Ana", score: 1 },
        { id: "player-2", name: "Jogador 2", score: 0 },
      ],
    });

    await user.click(
      screen.getByRole("button", { name: "Iniciar nova partida" }),
    );

    expect(screen.getByDisplayValue("Jogador 1")).toBeInTheDocument();
    expect(screen.getByLabelText("Pontuação de Jogador 1")).toHaveTextContent(
      "0",
    );
    expect(screen.getByLabelText("Tipo de partida")).toHaveValue("truco");
  });

  it("uses participant fallback labels when a name is empty", async () => {
    const user = userEvent.setup();

    render(<Scoreboard onFinishMatch={vi.fn()} />);

    await user.clear(screen.getByLabelText("Nome do participante 1"));

    expect(screen.getByLabelText("Pontuação de Participante 1")).toHaveTextContent(
      "0",
    );
    expect(
      screen.getByRole("button", {
        name: "Adicionar ponto para Participante 1",
      }),
    ).toBeInTheDocument();
  });
});
