import { advanceBracketWinner } from "../../../features/tournaments/utils/bracket";
import type {
  BracketMatch,
  BracketRound,
  TournamentBracket,
  TournamentParticipant,
} from "../../../features/tournaments/types";
import type { TournamentParticipant as GenericTournamentParticipant } from "../../../features/tournaments/types";
import { generateTennisEliminationPairings } from "./seeding";

const nextPowerOfTwo = (value: number): number => 2 ** Math.ceil(Math.log2(value));

const matchId = (round: number, position: number) => `tennis-round-${round}-match-${position + 1}`;

const statusFor = (participants: BracketMatch["participants"]): BracketMatch["status"] => {
  if (participants[0] && participants[1]) return "ready";
  return participants[0] || participants[1] ? "pending" : "pending";
};

export const resolveTennisByes = (initialBracket: TournamentBracket): TournamentBracket => {
  let bracket = initialBracket;
  let resolvedBye = true;
  while (resolvedBye) {
    resolvedBye = false;
    const matches = bracket.rounds.flatMap((round) => round.matches);
    const incomingMatches = (matchId: string) => matches.filter((candidate) => candidate.nextMatchId === matchId);
    const canProvideWinner = (match: BracketMatch): boolean =>
      match.participants.some((participant) => participant !== null) || incomingMatches(match.id).some(canProvideWinner);

    for (const match of matches) {
      const available = match.participants.filter((participant): participant is TournamentParticipant => participant !== null);
      if (available.length !== 1 || match.status === "finished") continue;

      const emptySlot = match.participants[0] === null ? 0 : 1;
      const opponentCanArrive = incomingMatches(match.id).some((candidate) =>
        candidate.nextParticipantSlot === emptySlot && canProvideWinner(candidate),
      );
      if (opponentCanArrive) continue;

      bracket = advanceBracketWinner(bracket, match.id, available[0].id);
      resolvedBye = true;
      break;
    }
  }
  return bracket;
};

export const createTennisEliminationBracket = (
  rankedParticipants: readonly GenericTournamentParticipant[],
): TournamentBracket => {
  const participantMap = new Map(rankedParticipants.map((participant) => [participant.id, participant]));
  const pairings = generateTennisEliminationPairings(rankedParticipants.map(({ id }) => id));
  const bracketSize = nextPowerOfTwo(rankedParticipants.length);
  const roundCount = Math.log2(bracketSize);

  const rounds: BracketRound[] = Array.from({ length: roundCount }, (_, roundIndex) => {
    const round = roundIndex + 1;
    const matchCount = bracketSize / 2 ** round;
    return {
      number: round,
      matches: Array.from({ length: matchCount }, (_, position): BracketMatch => {
        const pairing = round === 1 ? pairings[position] : undefined;
        const participants: BracketMatch["participants"] = pairing
          ? [participantMap.get(pairing.participants[0]) ?? null, pairing.participants[1] ? participantMap.get(pairing.participants[1]) ?? null : null]
          : [null, null];
        const hasNextRound = round < roundCount;
        return {
          id: matchId(round, position),
          round,
          position,
          participants,
          status: statusFor(participants),
          nextMatchId: hasNextRound ? matchId(round + 1, Math.floor(position / 2)) : undefined,
          nextParticipantSlot: hasNextRound ? ((position % 2) as 0 | 1) : undefined,
        };
      }),
    };
  });

  return resolveTennisByes({ rounds });
};
