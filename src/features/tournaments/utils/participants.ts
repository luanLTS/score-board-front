import type { TournamentParticipant } from "../types";

export type ParticipantValidationResult =
  | { valid: true }
  | { valid: false; error: "minimum_participants" | "duplicate_id" | "empty_name"; message: string };

export const MINIMUM_TOURNAMENT_PARTICIPANTS = 2;

export function validateTournamentParticipants(
  participants: readonly TournamentParticipant[],
): ParticipantValidationResult {
  if (participants.length < MINIMUM_TOURNAMENT_PARTICIPANTS) {
    return {
      valid: false,
      error: "minimum_participants",
      message: "Adicione pelo menos 2 participantes.",
    };
  }

  if (participants.some((participant) => participant.name.trim().length === 0)) {
    return {
      valid: false,
      error: "empty_name",
      message: "Todos os participantes devem ter um nome.",
    };
  }

  if (new Set(participants.map((participant) => participant.id)).size !== participants.length) {
    return {
      valid: false,
      error: "duplicate_id",
      message: "Cada participante deve ter um identificador único.",
    };
  }

  return { valid: true };
}
