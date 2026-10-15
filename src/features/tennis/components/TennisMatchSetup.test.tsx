import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

import { TennisMatchSetup } from "./TennisMatchSetup";

describe("TennisMatchSetup", () => {
  it("submits the two participant names", async () => {
    const user = userEvent.setup();
    const onStart = vi.fn();
    render(<TennisMatchSetup onStart={onStart} />);

    await user.clear(screen.getByLabelText("Nome do jogador 1"));
    await user.type(screen.getByLabelText("Nome do jogador 1"), "  Carlos ");
    await user.clear(screen.getByLabelText("Nome do jogador 2"));
    await user.type(screen.getByLabelText("Nome do jogador 2"), "Davi");
    await user.click(screen.getByRole("button", { name: "Iniciar super tie-break" }));

    expect(onStart).toHaveBeenCalledWith({ first: "Carlos", second: "Davi" });
  });
});
