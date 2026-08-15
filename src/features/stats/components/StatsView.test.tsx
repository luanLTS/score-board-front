import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";

import type { FinishedMatch } from "../../matches/types";
import { PlayerStatsPanel } from "./PlayerStatsPanel";
import { RankingList } from "./RankingList";
import { StatsView } from "./StatsView";

const matches: FinishedMatch[] = [{
  id: "1",
  gameKind: "generic",
  status: "finished",
  startedAt: "2026-08-15T10:00:00Z",
  finishedAt: "2026-08-15T10:10:00Z",
  participants: [
    { id: "ana", name: "Ana", score: 10 },
    { id: "bia", name: "Bia", score: 5 },
  ],
  result: { type: "winner", winnerId: "ana" },
}];

describe("stats components", () => {
  it("renders accessible empty states", () => {
    render(<><RankingList entries={[]} /><PlayerStatsPanel /></>);

    expect(screen.getByText(/Nenhuma partida finalizada/)).toBeInTheDocument();
    expect(screen.getByText(/Selecione um participante/)).toBeInTheDocument();
  });

  it("renders real ranking and lets the user inspect a participant", async () => {
    const user = userEvent.setup();
    render(<StatsView matches={matches} />);

    expect(screen.getByRole("list", { name: "Classificacao dos participantes" })).toBeInTheDocument();
    expect(screen.getByText("3", { selector: "strong" })).toBeInTheDocument();
    expect(screen.getByText("100%" )).toBeInTheDocument();

    await user.selectOptions(screen.getByLabelText("Ver estatisticas de"), "bia");

    expect(screen.getByText("Bia", { selector: "p" })).toBeInTheDocument();
    expect(screen.getByText("0%" )).toBeInTheDocument();
  });

  it("keeps the participant selector inside Statistics, before the metric cards", () => {
    render(<StatsView matches={matches} />);

    const heading = screen.getByRole("heading", { name: "Estatisticas" });
    const section = heading.closest("section");
    const selector = screen.getByLabelText("Ver estatisticas de");
    const metrics = screen.getByText("Jogos").closest("dl");
    if (!metrics) throw new Error("Metrics list was not rendered");

    expect(section).toContainElement(selector);
    expect(section).toContainElement(metrics);
    expect(heading.compareDocumentPosition(selector) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy();
    expect(selector.compareDocumentPosition(metrics) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy();
  });
});
