import type {
  TennisQualifyingTurn,
  TennisTournamentRankingEntry,
} from "./types";

type RankingEntryWithDraw = TennisTournamentRankingEntry & { drawOrder: number };

export const calculateTennisRanking = (
  participantIds: string[],
  turns: TennisQualifyingTurn[],
  random: () => number = Math.random,
  previousRanking: readonly TennisTournamentRankingEntry[] = [],
): TennisTournamentRankingEntry[] => {
  const entries = new Map<string, RankingEntryWithDraw>();
  const headToHead = new Map<string, number>();
  const previousDraws = new Map(previousRanking.map((entry) => [entry.participantId, entry.drawOrder]));

  for (const participantId of participantIds) {
    entries.set(participantId, {
      participantId,
      wins: 0,
      pointDifferential: 0,
      drawOrder: previousDraws.get(participantId) ?? random(),
    });
  }

  for (const turn of turns) {
    for (const match of turn.matches) {
      if (match.status !== "finished" || !match.scores || !match.winnerId) continue;
      const [firstId, secondId] = match.participants;
      const first = entries.get(firstId);
      const second = entries.get(secondId);
      if (!first || !second) continue;

      const [firstScore, secondScore] = match.scores;
      first.pointDifferential += firstScore - secondScore;
      second.pointDifferential += secondScore - firstScore;
      const winner = entries.get(match.winnerId);
      if (!winner) continue;
      winner.wins += 1;
      const loserId = match.winnerId === firstId ? secondId : firstId;
      headToHead.set(`${match.winnerId}|${loserId}`, (headToHead.get(`${match.winnerId}|${loserId}`) ?? 0) + 1);
    }
  }

  const ranking = [...entries.values()].sort((left, right) => {
    if (left.wins !== right.wins) return right.wins - left.wins;
    if (left.pointDifferential !== right.pointDifferential) {
      return right.pointDifferential - left.pointDifferential;
    }

    const leftDirect = headToHead.get(`${left.participantId}|${right.participantId}`) ?? 0;
    const rightDirect = headToHead.get(`${right.participantId}|${left.participantId}`) ?? 0;
    if (leftDirect !== rightDirect) return rightDirect - leftDirect;
    return left.drawOrder - right.drawOrder;
  });

  return ranking.map((entry, index) => ({ ...entry, position: index + 1 }));
};
