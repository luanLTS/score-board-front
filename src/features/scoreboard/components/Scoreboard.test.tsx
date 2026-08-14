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

    await user.selectOptions(screen.getByLabelText("Tipo de jogo"), "truco");
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
    expect(screen.getByLabelText("Tipo de jogo")).toHaveValue("truco");
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

  it("lets users select truco rules and disables scoring at the maximum", async () => {
    const user = userEvent.setup();

    render(<Scoreboard />);

    await user.selectOptions(screen.getByLabelText("Tipo de jogo"), "truco");

    const addPoint = screen.getByRole("button", {
      name: "Adicionar ponto para Jogador 1",
    });

    for (let points = 0; points < 12; points += 1) {
      await user.click(addPoint);
    }

    expect(screen.getByLabelText(/Pontuação de Jogador 1/)).toHaveTextContent(
      "12",
    );
    expect(addPoint).toBeDisabled();

    await user.click(addPoint);

    expect(screen.getByLabelText(/Pontuação de Jogador 1/)).toHaveTextContent(
      "12",
    );
  });

  it("delegates changes when used as a controlled scoreboard", async () => {
    const user = userEvent.setup();
    const onScoreChange = vi.fn();
    const onRenamePlayer = vi.fn();
    const onGameKindChange = vi.fn();
    const players = [
      { id: "player-1" as const, name: "Ana", score: 4 },
      { id: "player-2" as const, name: "Bia", score: 2 },
    ] as const;

    render(
      <Scoreboard
        gameKind="truco"
        onGameKindChange={onGameKindChange}
        onRenamePlayer={onRenamePlayer}
        onScoreChange={onScoreChange}
        players={[...players]}
        showActions={false}
      />,
    );

    await user.click(screen.getByRole("button", { name: "Adicionar ponto para Ana" }));
    await user.click(screen.getByRole("button", { name: "Remover ponto de Bia" }));
    await user.type(screen.getByDisplayValue("Ana"), " M");
    await user.selectOptions(screen.getByLabelText("Tipo de jogo"), "fifa");

    expect(onScoreChange).toHaveBeenNthCalledWith(1, "player-1", 5);
    expect(onScoreChange).toHaveBeenNthCalledWith(2, "player-2", 1);
    expect(onRenamePlayer).toHaveBeenCalled();
    expect(onGameKindChange).toHaveBeenCalledWith("fifa");
    expect(screen.queryByRole("button", { name: "Finalizar partida" })).not.toBeInTheDocument();
  });

  it("blocks every editing control and action when disabled", async () => {
    const user = userEvent.setup();
    const onScoreChange = vi.fn();
    const onRenamePlayer = vi.fn();
    const onGameKindChange = vi.fn();
    const onFinishMatch = vi.fn();

    render(
      <Scoreboard
        disabled
        gameKind="generic"
        onFinishMatch={onFinishMatch}
        onGameKindChange={onGameKindChange}
        onRenamePlayer={onRenamePlayer}
        onScoreChange={onScoreChange}
        players={[
          { id: "player-1", name: "Ana", score: 1 },
          { id: "player-2", name: "Bia", score: 0 },
        ]}
      />,
    );

    expect(screen.getByDisplayValue("Ana")).toBeDisabled();
    expect(screen.getByLabelText("Tipo de jogo")).toBeDisabled();
    expect(screen.getByRole("button", { name: "Adicionar ponto para Ana" })).toBeDisabled();
    expect(screen.getByRole("button", { name: "Remover ponto de Ana" })).toBeDisabled();
    expect(screen.getByRole("button", { name: "Finalizar partida" })).toBeDisabled();

    await user.click(screen.getByRole("button", { name: "Finalizar partida" }));
    expect(onScoreChange).not.toHaveBeenCalled();
    expect(onRenamePlayer).not.toHaveBeenCalled();
    expect(onGameKindChange).not.toHaveBeenCalled();
    expect(onFinishMatch).not.toHaveBeenCalled();
  });
});
