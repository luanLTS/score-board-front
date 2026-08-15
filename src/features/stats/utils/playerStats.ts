import type { FinishedMatch } from "../../matches/types";
import type { PlayerStats } from "../types";

export const normalizePlayerName = (name: string): string =>
  name.trim().toLocaleLowerCase("pt-BR");

type MutableStats = Omit<PlayerStats, "scoreDifference" | "successRate">;

export const calculatePlayerStats = (
  matches: readonly FinishedMatch[],
): PlayerStats[] => {
  const players = new Map<string, MutableStats>();

  for (const match of matches) {
    for (const [index, participant] of match.participants.entries()) {
      const playerKey = normalizePlayerName(participant.name);
      if (!playerKey) continue;

      const opponent = match.participants[index === 0 ? 1 : 0];
      const current = players.get(playerKey) ?? {
        playerKey,
        name: participant.name.trim(),
        games: 0,
        wins: 0,
        draws: 0,
        losses: 0,
        pointsFor: 0,
        pointsAgainst: 0,
        rankingPoints: 0,
      };
      const isDraw = match.result?.type === "draw" ||
        (match.result === undefined && participant.score === opponent.score);
      const winnerId = match.result?.type === "winner"
        ? match.result.winnerId
        : match.winnerId;
      const isWinner = !isDraw && (winnerId !== undefined
        ? winnerId === participant.id
        : participant.score > opponent.score);

      current.games += 1;
      current.pointsFor += participant.score;
      current.pointsAgainst += opponent.score;
      if (isDraw) {
        current.draws += 1;
        current.rankingPoints += 1;
      } else if (isWinner) {
        current.wins += 1;
        current.rankingPoints += 3;
      } else {
        current.losses += 1;
      }
      players.set(playerKey, current);
    }
  }

  return [...players.values()].map((player) => ({
    ...player,
    scoreDifference: player.pointsFor - player.pointsAgainst,
    successRate: player.games === 0
      ? 0
      : (player.rankingPoints / (player.games * 3)) * 100,
  }));
};

export const getPlayerStats = (
  matches: readonly FinishedMatch[],
  playerName: string,
): PlayerStats | undefined => {
  const playerKey = normalizePlayerName(playerName);
  return calculatePlayerStats(matches).find((player) =>
    player.playerKey === playerKey
  );
};
