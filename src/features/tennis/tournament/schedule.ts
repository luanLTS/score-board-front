import type { TennisQualifyingMatch } from "./types";

export const generateQualifyingMatches = (
  participantIds: string[],
  turnNumber: number,
): TennisQualifyingMatch[] => {
  if (participantIds.length < 2) {
    throw new Error("Adicione pelo menos dois participantes ao turno.");
  }
  if (new Set(participantIds).size !== participantIds.length) {
    throw new Error("Os participantes do turno devem ser únicos.");
  }
  if (!Number.isInteger(turnNumber) || turnNumber < 1) {
    throw new Error("O número do turno deve ser positivo.");
  }

  const matches: TennisQualifyingMatch[] = [];
  for (let firstIndex = 0; firstIndex < participantIds.length - 1; firstIndex += 1) {
    for (let secondIndex = firstIndex + 1; secondIndex < participantIds.length; secondIndex += 1) {
      matches.push({
        id: `turn-${turnNumber}-match-${matches.length + 1}`,
        format: "super_tiebreak",
        participants: [participantIds[firstIndex], participantIds[secondIndex]],
        status: "pending",
      });
    }
  }
  return matches;
};
