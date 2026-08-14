import type { GameKind, ScoreboardState } from "../../scoreboard/types";
import type { FinishedMatch, MatchParticipant } from "../../matches/types";
import { calculateMatchResult } from "../../matches/utils/matchResult";

type CreateFinishedMatchOptions = {
  id?: string;
  now?: Date;
  startedAt?: Date;
  gameKind?: GameKind;
  winnerId?: MatchParticipant["id"];
};

const createMatchId = (): string => {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID();
  }

  return `match-${Date.now()}`;
};

export const createFinishedMatch = (
  scoreboardState: ScoreboardState,
  options: CreateFinishedMatchOptions = {},
): FinishedMatch => {
  const finishedAt = options.now ?? new Date();
  const participants = scoreboardState.players.map((player) => ({
    id: player.id,
    name: player.name,
    score: player.score,
  })) as FinishedMatch["participants"];
  const result = options.winnerId
    ? { type: "winner" as const, winnerId: options.winnerId }
    : calculateMatchResult(participants);

  return {
    id: options.id ?? createMatchId(),
    participants,
    gameKind: options.gameKind ?? scoreboardState.gameKind,
    status: "finished",
    startedAt: options.startedAt ?? finishedAt,
    finishedAt,
    winnerId: result.type === "winner" ? result.winnerId : undefined,
    result,
  };
};
