import type { BracketMatch, TournamentBracket } from "../types";
import { BracketMatchCard } from "./BracketMatchCard";

type BracketViewProps = {
  bracket: TournamentBracket;
  onPlayMatch?: (match: BracketMatch) => void;
  matchesDisabled?: boolean;
};

export function BracketView({ bracket, onPlayMatch, matchesDisabled = false }: BracketViewProps) {
  return (
    <section aria-labelledby="bracket-title" className="space-y-4">
      <h3 className="text-lg font-bold" id="bracket-title">Chaveamento</h3>
      <div className="overflow-x-auto pb-3">
        <div className="flex min-w-max gap-5">
          {bracket.rounds.map((round, roundIndex) => (
            <section className="flex w-64 flex-col" key={round.number}>
              <h4 className="mb-3 text-center text-xs font-bold uppercase tracking-wide text-zinc-400">
                {roundIndex === bracket.rounds.length - 1 ? "Final" : `Rodada ${round.number}`}
              </h4>
              <div className="flex flex-1 flex-col justify-around gap-4">
                {round.matches.map((match) => (
                  <BracketMatchCard disabled={matchesDisabled} key={match.id} match={match} onPlay={onPlayMatch} />
                ))}
              </div>
            </section>
          ))}
        </div>
      </div>
    </section>
  );
}
