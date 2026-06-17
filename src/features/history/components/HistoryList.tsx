import type { Match } from "../../matches/types";

import { HistoryItem } from "./HistoryItem";

type HistoryListProps = {
  matches: Match[];
  selectedMatchId?: string;
  onSelectMatch: (matchId: string) => void;
};

export function HistoryList({
  matches,
  selectedMatchId,
  onSelectMatch,
}: HistoryListProps) {
  return (
    <section className="space-y-4" aria-labelledby="history-title">
      <h2 id="history-title" className="text-xl font-bold">
        Historico
      </h2>

      {matches.length === 0 ? (
        <p className="rounded-md border border-zinc-800 bg-zinc-900 p-4 text-zinc-400">
          Nenhuma partida finalizada
        </p>
      ) : (
        <div
          aria-label="Partidas finalizadas"
          className="grid max-h-[min(52vh,32rem)] gap-3 overflow-y-auto pr-1"
          role="list"
        >
          {matches.map((match) => (
            <div key={match.id} role="listitem">
              <HistoryItem
                isSelected={match.id === selectedMatchId}
                match={match}
                onSelect={onSelectMatch}
              />
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
