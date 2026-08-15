import type {
  BracketMatch,
  BracketRound,
  TournamentBracket,
  TournamentParticipant,
} from "../types";
import { validateTournamentParticipants } from "./participants";

const nextPowerOfTwo = (value: number): number => 2 ** Math.ceil(Math.log2(value));

const createMatchId = (round: number, position: number): string =>
  `round-${round}-match-${position + 1}`;

const getInitialSlots = (
  participants: readonly TournamentParticipant[],
  bracketSize: number,
): Array<TournamentParticipant | null> => {
  const byeCount = bracketSize - participants.length;
  const slots: Array<TournamentParticipant | null> = [];

  for (let index = 0; index < byeCount; index += 1) {
    slots.push(participants[index], null);
  }

  slots.push(...participants.slice(byeCount));
  return slots;
};

const getStatus = (participants: BracketMatch["participants"]): BracketMatch["status"] =>
  participants[0] && participants[1] ? "ready" : "pending";

const createRounds = (
  participants: readonly TournamentParticipant[],
): BracketRound[] => {
  const bracketSize = nextPowerOfTwo(participants.length);
  const roundCount = Math.log2(bracketSize);
  const initialSlots = getInitialSlots(participants, bracketSize);

  return Array.from({ length: roundCount }, (_, roundIndex) => {
    const round = roundIndex + 1;
    const matchCount = bracketSize / 2 ** round;

    return {
      number: round,
      matches: Array.from({ length: matchCount }, (_, position): BracketMatch => {
        const matchParticipants: BracketMatch["participants"] =
          round === 1
            ? [initialSlots[position * 2], initialSlots[position * 2 + 1]]
            : [null, null];
        const hasNextRound = round < roundCount;

        return {
          id: createMatchId(round, position),
          round,
          position,
          participants: matchParticipants,
          status: getStatus(matchParticipants),
          nextMatchId: hasNextRound ? createMatchId(round + 1, Math.floor(position / 2)) : undefined,
          nextParticipantSlot: hasNextRound ? ((position % 2) as 0 | 1) : undefined,
        };
      }),
    };
  });
};

const resolveByes = (bracket: TournamentBracket): TournamentBracket => {
  let nextBracket = bracket;

  for (const round of bracket.rounds) {
    for (const match of round.matches) {
      const availableParticipants = match.participants.filter(
        (participant): participant is TournamentParticipant => participant !== null,
      );

      if (availableParticipants.length === 1 && match.round === 1) {
        nextBracket = advanceBracketWinner(nextBracket, match.id, availableParticipants[0].id);
      }
    }
  }

  return nextBracket;
};

export function generateSingleEliminationBracket(
  participants: readonly TournamentParticipant[],
): TournamentBracket {
  const validation = validateTournamentParticipants(participants);
  if (!validation.valid) {
    throw new Error(validation.message);
  }

  return resolveByes({ rounds: createRounds(participants) });
}

export function advanceBracketWinner(
  bracket: TournamentBracket,
  matchId: string,
  winnerId: TournamentParticipant["id"],
): TournamentBracket {
  const sourceMatch = bracket.rounds.flatMap((round) => round.matches).find((match) => match.id === matchId);
  if (!sourceMatch) throw new Error("Confronto não encontrado.");
  if (sourceMatch.status === "finished") throw new Error("Este confronto já foi finalizado.");

  const winner = sourceMatch.participants.find((participant) => participant?.id === winnerId);
  if (!winner) throw new Error("O vencedor deve participar do confronto.");
  if (sourceMatch.participants.some((participant) => participant === null) && sourceMatch.round !== 1) {
    throw new Error("O confronto ainda não possui todos os participantes.");
  }

  return {
    rounds: bracket.rounds.map((round) => ({
      ...round,
      matches: round.matches.map((match) => {
        if (match.id === sourceMatch.id) {
          return { ...match, status: "finished", winnerId };
        }

        if (match.id !== sourceMatch.nextMatchId || sourceMatch.nextParticipantSlot === undefined) {
          return match;
        }

        const nextParticipants: BracketMatch["participants"] = [...match.participants];
        nextParticipants[sourceMatch.nextParticipantSlot] = winner;
        return { ...match, participants: nextParticipants, status: getStatus(nextParticipants) };
      }),
    })),
  };
}
