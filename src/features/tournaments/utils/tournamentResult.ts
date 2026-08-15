import type { Tournament, TournamentParticipant } from "../types";

export function getTournamentChampion(
  tournament: Tournament,
): TournamentParticipant | null {
  const finalMatch = tournament.bracket?.rounds.at(-1)?.matches[0];
  const allMatchesFinished = tournament.bracket?.rounds.every((round) =>
    round.matches.every((match) => match.status === "finished"),
  );
  if (!finalMatch || !allMatchesFinished || finalMatch.status !== "finished" || !finalMatch.winnerId) {
    return null;
  }

  return tournament.participants.find((participant) => participant.id === finalMatch.winnerId) ?? null;
}

export function updateTournamentResult(tournament: Tournament): Tournament {
  const champion = getTournamentChampion(tournament);
  if (!champion) return tournament;

  return { ...tournament, status: "finished", championId: champion.id };
}
