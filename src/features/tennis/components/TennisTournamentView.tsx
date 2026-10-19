import type { TennisTournamentState } from "../tournament/types";
import type { TennisQualifyingMatch } from "../tournament/types";
import type { BracketMatch } from "../../tournaments/types";
import { BracketView } from "../../tournaments/components/BracketView";

type TennisTournamentViewProps = {
  tournament: TennisTournamentState;
  onStartTurn: () => void;
  onCloseTurn: () => void;
  onStartNextTurn: () => void;
  onStartElimination: () => void;
  onPlayMatch?: (match: TennisQualifyingMatch) => void;
  onPlayEliminationMatch?: (match: BracketMatch) => void;
  onCancel?: () => void;
  onNew?: () => void;
};

const statusLabels: Record<TennisTournamentState["status"], string> = {
  setup: "Configuração",
  turn_in_progress: "Turno em andamento",
  turn_closed: "Turno fechado",
  elimination_in_progress: "Eliminatórias",
  finished: "Finalizado",
  cancelled: "Cancelado",
};

export function TennisTournamentView({
  tournament,
  onStartTurn,
  onCloseTurn,
  onStartNextTurn,
  onStartElimination,
  onPlayMatch,
  onPlayEliminationMatch,
  onCancel,
  onNew,
}: TennisTournamentViewProps) {
  const names = new Map(tournament.participants.map((participant) => [participant.id, participant.name]));
  const currentTurn = tournament.turns.at(-1);

  return (
    <section aria-labelledby="tennis-tournament-title" className="space-y-6 rounded-xl border border-zinc-800 bg-zinc-900/60 p-6">
      <header className="space-y-2">
        <p className="text-sm font-medium uppercase text-amber-300">Campeonato de tênis</p>
        <h2 className="text-2xl font-bold" id="tennis-tournament-title">{tournament.name}</h2>
        <p className="text-sm text-zinc-400">{statusLabels[tournament.status]}</p>
      </header>

      <section aria-labelledby="tennis-ranking-title" className="space-y-3">
        <h3 className="text-lg font-bold" id="tennis-ranking-title">Ranking acumulado</h3>
        <ol className="space-y-2">
          {tournament.ranking.map((entry, index) => (
            <li className="flex items-center justify-between rounded-md border border-zinc-800 px-3 py-2" key={entry.participantId}>
              <span>{entry.position ?? index + 1}º {names.get(entry.participantId) ?? entry.participantId}</span>
              <span className="text-sm text-zinc-400">{entry.wins} vitória(s) · saldo {entry.pointDifferential}</span>
            </li>
          ))}
        </ol>
      </section>

      {currentTurn ? (
        <section aria-labelledby="tennis-turn-title" className="space-y-3">
          <h3 className="text-lg font-bold" id="tennis-turn-title">Turno {currentTurn.number}</h3>
          <ul className="space-y-2">
            {currentTurn.matches.map((match) => (
              <li className="rounded-md border border-zinc-800 px-3 py-2 text-sm" key={match.id}>
                {names.get(match.participants[0]) ?? match.participants[0]} × {names.get(match.participants[1]) ?? match.participants[1]}
                <span className="ml-2 text-zinc-400">{match.status === "finished" ? `${match.scores?.[0]} × ${match.scores?.[1]}` : "Pendente"}</span>
                {tournament.status === "turn_in_progress" && match.status === "pending" && onPlayMatch ? (
                  <button className="ml-3 rounded border border-amber-300 px-2 py-1 text-amber-200" onClick={() => onPlayMatch(match)} type="button">Jogar partida</button>
                ) : null}
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      <div className="flex flex-wrap gap-3">
        {tournament.status === "setup" ? (
          <button className="rounded-md bg-amber-300 px-4 py-3 font-bold text-zinc-950" onClick={onStartTurn} type="button">Iniciar turno</button>
        ) : null}
        {tournament.status === "turn_in_progress" ? (
          <button className="rounded-md bg-amber-300 px-4 py-3 font-bold text-zinc-950" onClick={onCloseTurn} type="button">Fechar turno</button>
        ) : null}
        {tournament.status === "turn_closed" ? (
          <>
            <button className="rounded-md border border-amber-300 px-4 py-3 font-semibold text-amber-200" onClick={onStartNextTurn} type="button">Jogar próximo turno</button>
            <button className="rounded-md bg-amber-300 px-4 py-3 font-bold text-zinc-950" onClick={onStartElimination} type="button">Ir para eliminatórias</button>
          </>
        ) : null}
        {tournament.status === "elimination_in_progress" ? <p className="text-sm text-amber-200">Chaveamento eliminatório disponível.</p> : null}
        {tournament.status !== "finished" && tournament.status !== "cancelled" && onCancel ? <button className="rounded-md border border-red-400 px-4 py-2 text-red-200" onClick={onCancel} type="button">Cancelar campeonato</button> : null}
        {(tournament.status === "finished" || tournament.status === "cancelled") && onNew ? <button className="rounded-md bg-amber-300 px-4 py-3 font-bold text-zinc-950" onClick={onNew} type="button">Iniciar novo campeonato</button> : null}
        {tournament.eliminationBracket ? (
          <div aria-label="Chaveamento de tênis" className="basis-full">
            <BracketView bracket={tournament.eliminationBracket} onPlayMatch={tournament.status === "elimination_in_progress" ? onPlayEliminationMatch : undefined} />
          </div>
        ) : null}
      </div>
    </section>
  );
}
