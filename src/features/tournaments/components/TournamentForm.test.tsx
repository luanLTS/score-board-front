import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

import { TournamentForm } from "./TournamentForm";

describe("TournamentForm", () => {
  it("collects a named tournament with at least two unique participants", async () => {
    const user = userEvent.setup();
    const onSubmit = vi.fn();
    render(<TournamentForm onSubmit={onSubmit} />);

    await user.type(screen.getByLabelText("Nome do torneio"), "Copa local");
    const participantInput = screen.getByLabelText("Nome do participante");
    await user.type(participantInput, "Ana");
    await user.click(screen.getByRole("button", { name: "Adicionar" }));
    await user.type(participantInput, "Bia");
    await user.click(screen.getByRole("button", { name: "Adicionar" }));
    await user.click(screen.getByRole("button", { name: "Criar torneio" }));

    expect(onSubmit).toHaveBeenCalledWith({
      name: "Copa local",
      participants: [
        expect.objectContaining({ name: "Ana" }),
        expect.objectContaining({ name: "Bia" }),
      ],
    });
  });
});
