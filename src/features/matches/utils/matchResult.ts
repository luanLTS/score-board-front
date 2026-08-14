import type { MatchParticipant, MatchResult } from "../types";

export const calculateMatchResult = (
  participants: readonly [MatchParticipant, MatchParticipant],
): MatchResult => {
  const [first, second] = participants;

  if (first.score === second.score) return { type: "draw" };

  return {
    type: "winner",
    winnerId: first.score > second.score ? first.id : second.id,
  };
};
