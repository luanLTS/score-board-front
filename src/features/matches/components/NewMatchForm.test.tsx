import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

import { NewMatchForm } from "./NewMatchForm";

describe("NewMatchForm", () => {
  it("submits trimmed participant names and the selected game kind", async () => {
    const user = userEvent.setup();
    const onSubmit = vi.fn();

    render(<NewMatchForm onSubmit={onSubmit} />);

    await user.clear(screen.getByLabelText("Nome do participante 1"));
    await user.type(screen.getByLabelText("Nome do participante 1"), "  Ana  ");
    await user.clear(screen.getByLabelText("Nome do participante 2"));
    await user.type(screen.getByLabelText("Nome do participante 2"), "Bruno");
    await user.selectOptions(screen.getByLabelText("Tipo de jogo"), "truco");
    await user.click(screen.getByRole("button", { name: "Iniciar partida" }));

    expect(onSubmit).toHaveBeenCalledOnce();
    expect(onSubmit).toHaveBeenCalledWith({
      participantOneName: "Ana",
      participantTwoName: "Bruno",
      gameKind: "truco",
    });
  });

  it("supports initial presentation values", () => {
    render(
      <NewMatchForm
        initialGameKind="fifa"
        initialParticipantOneName="Time Azul"
        initialParticipantTwoName="Time Verde"
        onSubmit={() => undefined}
      />,
    );

    expect(screen.getByLabelText("Nome do participante 1")).toHaveValue(
      "Time Azul",
    );
    expect(screen.getByLabelText("Nome do participante 2")).toHaveValue(
      "Time Verde",
    );
    expect(screen.getByLabelText("Tipo de jogo")).toHaveValue("fifa");
  });

  it("does not allow a match without both participant names", async () => {
    const user = userEvent.setup();
    const onSubmit = vi.fn();

    render(<NewMatchForm onSubmit={onSubmit} />);

    await user.clear(screen.getByLabelText("Nome do participante 2"));

    expect(
      screen.getByRole("button", { name: "Iniciar partida" }),
    ).toBeDisabled();
    expect(onSubmit).not.toHaveBeenCalled();
  });

  it("disables all controls while creation is unavailable", () => {
    render(<NewMatchForm disabled onSubmit={() => undefined} />);

    expect(screen.getByLabelText("Nome do participante 1")).toBeDisabled();
    expect(screen.getByLabelText("Nome do participante 2")).toBeDisabled();
    expect(screen.getByLabelText("Tipo de jogo")).toBeDisabled();
    expect(
      screen.getByRole("button", { name: "Iniciar partida" }),
    ).toBeDisabled();
  });
});
