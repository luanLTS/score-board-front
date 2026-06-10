import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

import { GameKindSelect } from "./GameKindSelect";

describe("GameKindSelect", () => {
  it("renders the game kind options with the selected value", () => {
    render(<GameKindSelect selectedGameKind="truco" onChange={() => {}} />);

    const select = screen.getByLabelText("Tipo de jogo");

    expect(select).toHaveDisplayValue("Truco");
    expect(screen.getByRole("option", { name: "Genérico" })).toHaveValue(
      "generic",
    );
    expect(screen.getByRole("option", { name: "Truco" })).toHaveValue("truco");
    expect(screen.getByRole("option", { name: "FIFA" })).toHaveValue("fifa");
  });

  it("calls onChange with the selected game kind", async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();

    render(<GameKindSelect selectedGameKind="generic" onChange={onChange} />);

    await user.selectOptions(screen.getByLabelText("Tipo de jogo"), "fifa");

    expect(onChange).toHaveBeenCalledOnce();
    expect(onChange).toHaveBeenCalledWith("fifa");
  });
});
