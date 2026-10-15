import { describe, expect, it, vi } from "vitest";

import {
  createBestOfThreeMatch,
  createSuperTiebreakMatch,
  createTennisMatchStorage,
  parseTennisMatch,
} from "./matchFactory";

describe("tennis match creation and persistence", () => {
  it("creates an elimination match with best-of-three games", () => {
    const match = createBestOfThreeMatch(["ana", "bia"], () => 0.9);

    expect(match).toMatchObject({
      format: "best_of_three_games",
      status: "in_progress",
      participants: ["ana", "bia"],
      gamesWon: [0, 0],
      games: [{ status: "in_progress", points: [0, 0] }],
      firstServerId: "bia",
      serverId: "bia",
    });
  });

  it("uses an injectable draw to choose and persist the first server", () => {
    const match = createSuperTiebreakMatch(["ana", "bia"], () => 0.9);

    expect(match.firstServerId).toBe("bia");
    expect(match.serverId).toBe("bia");
  });

  it("restores the saved first server without drawing again", () => {
    const saved = createSuperTiebreakMatch(["ana", "bia"], () => 0);
    const adapter = {
      load: vi.fn(() => saved),
      save: vi.fn(),
      clear: vi.fn(),
    };
    const storage = createTennisMatchStorage(adapter);

    expect(storage.load()).toEqual(saved);
    expect(parseTennisMatch(saved)).toEqual(saved);
  });
});
