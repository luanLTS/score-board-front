export type TennisEliminationPairing = {
  format: "best_of_three_games";
  participants: [string, string | null];
  bye: boolean;
};

export const generateTennisEliminationPairings = (
  rankedParticipantIds: string[],
): TennisEliminationPairing[] => {
  if (rankedParticipantIds.length < 2) {
    throw new Error("As eliminatórias precisam de pelo menos dois participantes.");
  }
  if (new Set(rankedParticipantIds).size !== rankedParticipantIds.length) {
    throw new Error("A classificação não pode conter participantes repetidos.");
  }

  const pairings: TennisEliminationPairing[] = [];
  const pairingCount = Math.ceil(rankedParticipantIds.length / 2);
  for (let index = 0; index < pairingCount; index += 1) {
    const first = rankedParticipantIds[index];
    const second = rankedParticipantIds[rankedParticipantIds.length - 1 - index] ?? null;
    pairings.push({
      format: "best_of_three_games",
      participants: [first, first === second ? null : second],
      bye: first === second,
    });
  }
  return pairings;
};
