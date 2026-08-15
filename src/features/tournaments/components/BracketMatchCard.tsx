import type { BracketMatch } from "../types";

type BracketMatchCardProps = {
  match: BracketMatch;
  onPlay?: (match: BracketMatch) => void;
  disabled?: boolean;
};

export function BracketMatchCard({ match, onPlay, disabled = false }: BracketMatchCardProps) {
  const canPlay = match.status === "ready" && match.participants.every(Boolean);

  return (
    <article
      aria-label={`Confronto ${match.position + 1}`}
      className="w-64 shrink-0 rounded-lg border border-zinc-700 bg-zinc-900 p-3 shadow-lg shadow-black/20"
    >
      <div className="space-y-1">
        {match.participants.map((participant, index) => {
          const winner = participant?.id === match.winnerId;
          return (
            <div
              className={`flex min-h-10 items-center justify-between rounded px-3 py-2 text-sm ${
                winner ? "bg-emerald-400/15 text-emerald-200" : "bg-zinc-950 text-zinc-300"
              }`}
              key={`${match.id}-${index}`}
            >
              <span className="truncate">{participant?.name ?? "A definir"}</span>
              {winner ? <span aria-label="Vencedor">✓</span> : null}
            </div>
          );
        })}
      </div>
      {canPlay && onPlay ? (
        <button
          className="mt-3 w-full rounded-md bg-teal-300 px-3 py-2 text-sm font-bold text-zinc-950 hover:bg-teal-200 disabled:cursor-not-allowed disabled:opacity-40"
          disabled={disabled}
          onClick={() => onPlay(match)}
          type="button"
        >
          Jogar confronto
        </button>
      ) : (
        <p className="mt-3 text-center text-xs text-zinc-500">
          {match.status === "finished" ? "Confronto finalizado" : "Aguardando participantes"}
        </p>
      )}
    </article>
  );
}
