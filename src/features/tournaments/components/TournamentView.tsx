import type { BracketMatch, Tournament } from "../types";
import { BracketView } from "./BracketView";
import { TournamentParticipants } from "./TournamentParticipants";

type TournamentViewProps = {
  tournament: Tournament;
  onPlayMatch: (match: BracketMatch) => void;
  onNewTournament?: () => void;
  matchesDisabled?: boolean;
};

export function TournamentView({ tournament, onPlayMatch, onNewTournament, matchesDisabled = false }: TournamentViewProps) {
  const champion = tournament.participants.find((item) => item.id === tournament.championId);

  return (
    <section className="space-y-6 rounded-xl border border-zinc-800 bg-zinc-900/60 p-4 sm:p-6">
      <header className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="text-sm font-medium uppercase text-amber-300">
            {tournament.status === "finished" ? "Torneio finalizado" : "Eliminatória simples"}
          </p>
          <h2 className="text-2xl font-bold sm:text-3xl">{tournament.name}</h2>
          {champion ? <p className="mt-2 text-emerald-300">Campeão: <strong>{champion.name}</strong></p> : null}
        </div>
        {onNewTournament ? (
          <button className="rounded-md border border-zinc-700 px-3 py-2 text-sm hover:bg-zinc-800" onClick={onNewTournament} type="button">
            Novo torneio
          </button>
        ) : null}
      </header>
      <TournamentParticipants participants={tournament.participants} />
      {matchesDisabled ? <p className="rounded-md bg-amber-300/10 p-3 text-sm text-amber-200">Finalize a partida atual antes de iniciar um confronto do torneio.</p> : null}
      {tournament.bracket ? <BracketView bracket={tournament.bracket} matchesDisabled={matchesDisabled} onPlayMatch={onPlayMatch} /> : null}
    </section>
  );
}
