import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it } from "vitest";

import { TennisTournamentWorkspace } from "./TennisTournamentWorkspace";
import { TENNIS_STORAGE_KEYS } from "../../../lib/storage";

describe("TennisTournamentWorkspace", () => {
  beforeEach(() => window.localStorage.clear());

  it("creates a championship with named participants and opens its first turn", async () => {
    const user = userEvent.setup();
    render(<TennisTournamentWorkspace />);

    await user.clear(screen.getByLabelText("Participantes"));
    await user.type(screen.getByLabelText("Participantes"), "Ana, Bia, Carlos, Davi");
    await user.click(screen.getByRole("button", { name: "Iniciar campeonato" }));

    expect(screen.getByRole("heading", { name: "Campeonato de tênis" })).toBeInTheDocument();
    expect(screen.getByText("Turno 1")).toBeInTheDocument();
    expect(screen.getAllByRole("button", { name: "Jogar partida" })).toHaveLength(6);
  });

  it("restores an active qualifying match after reload", async () => {
    const user = userEvent.setup();
    const { unmount } = render(<TennisTournamentWorkspace />);

    await user.clear(screen.getByLabelText("Participantes"));
    await user.type(screen.getByLabelText("Participantes"), "Ana, Bia");
    await user.click(screen.getByRole("button", { name: "Iniciar campeonato" }));
    await user.click(screen.getByRole("button", { name: "Jogar partida" }));
    await user.click(screen.getByRole("button", { name: "Ponto para Ana" }));

    await waitFor(() => {
      const saved = JSON.parse(window.localStorage.getItem(TENNIS_STORAGE_KEYS.currentTournamentV1) ?? "null") as { activeMatch?: { scores: number[] } };
      expect(saved.activeMatch?.scores).toEqual([1, 0]);
    });

    unmount();
    render(<TennisTournamentWorkspace />);
    expect(screen.getByLabelText("Placar do super tie-break")).toHaveTextContent("1 × 0");
  });

  it("resumes the active qualifying match after returning to the tournament", async () => {
    const user = userEvent.setup();
    render(<TennisTournamentWorkspace />);

    await user.clear(screen.getByLabelText("Participantes"));
    await user.type(screen.getByLabelText("Participantes"), "Ana, Bia");
    await user.click(screen.getByRole("button", { name: "Iniciar campeonato" }));
    await user.click(screen.getByRole("button", { name: "Jogar partida" }));
    await user.click(screen.getByRole("button", { name: "Ponto para Ana" }));
    await user.click(screen.getByRole("button", { name: "Voltar ao campeonato" }));
    await user.click(screen.getByRole("button", { name: "Jogar partida" }));

    expect(screen.getByLabelText("Placar do super tie-break")).toHaveTextContent("1 × 0");
  });
});
