export type PlayerStats = {
  playerKey: string;
  name: string;
  games: number;
  wins: number;
  draws: number;
  losses: number;
  pointsFor: number;
  pointsAgainst: number;
  scoreDifference: number;
  rankingPoints: number;
  successRate: number;
};

export type RankingEntry = PlayerStats & {
  position: number;
};
