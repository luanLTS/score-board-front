import type { GameKind, ScoreboardState } from "../../scoreboard/types";
import type { Match, MatchParticipant } from "../../matches/types";

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
): Match => {
  const finishedAt = options.now ?? new Date();

  return {
    id: options.id ?? createMatchId(),
    participants: scoreboardState.players.map((player) => ({
      id: player.id,
      name: player.name,
      score: player.score,
    })) as Match["participants"],
    gameKind: options.gameKind ?? scoreboardState.gameKind,
    status: "finished",
    startedAt: options.startedAt ?? finishedAt,
    finishedAt,
    winnerId: options.winnerId,
  };
};
