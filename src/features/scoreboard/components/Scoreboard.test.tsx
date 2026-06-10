import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";

import { Scoreboard } from "./Scoreboard";

describe("Scoreboard", () => {
  it("lets users edit names, score both players, block negative scores, and reset scores only", async () => {
    const user = userEvent.setup();

    render(<Scoreboard />);

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

  it("uses participant fallback labels when a name is empty", async () => {
    const user = userEvent.setup();

    render(<Scoreboard />);

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
});
