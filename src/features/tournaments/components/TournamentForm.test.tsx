import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

import { TournamentForm } from "./TournamentForm";

describe("TournamentForm", () => {
  it("collects participant names from one comma-separated input", async () => {
    const user = userEvent.setup();
    const onSubmit = vi.fn();
    render(<TournamentForm onSubmit={onSubmit} />);

    await user.type(screen.getByLabelText("Nome do torneio"), "Copa local");
    await user.type(screen.getByLabelText("Participantes separados por vírgula"), " Ana, Bia , , Carlos ");
    await user.click(screen.getByRole("button", { name: "Criar torneio" }));

    expect(onSubmit).toHaveBeenCalledWith({
      name: "Copa local",
      participants: [
        expect.objectContaining({ name: "Ana" }),
        expect.objectContaining({ name: "Bia" }),
        expect.objectContaining({ name: "Carlos" }),
      ],
    });
  });

  it("requires at least two unique participant names", async () => {
    const user = userEvent.setup();
    const onSubmit = vi.fn();
    render(<TournamentForm onSubmit={onSubmit} />);
    await user.type(screen.getByLabelText("Nome do torneio"), "Copa local");
    await user.type(screen.getByLabelText("Participantes separados por vírgula"), "Ana, ana");
    expect(screen.getByRole("button", { name: "Criar torneio" })).toBeDisabled();
    expect(screen.getByText("Os participantes devem ter nomes únicos.")).toBeInTheDocument();
    expect(onSubmit).not.toHaveBeenCalled();
  });
});
