import type { RankingEntry } from "../types";

type RankingListProps = {
  entries: readonly RankingEntry[];
};

export function RankingList({ entries }: RankingListProps) {
  return (
    <section className="space-y-4" aria-labelledby="ranking-title">
      <h2 id="ranking-title" className="text-xl font-bold">Ranking</h2>
      {entries.length === 0 ? (
        <p className="rounded-md border border-zinc-800 bg-zinc-900 p-4 text-zinc-400">
          Nenhuma partida finalizada para calcular o ranking
        </p>
      ) : (
        <ol className="grid gap-2" aria-label="Classificacao dos participantes">
          {entries.map((entry) => (
            <li
              className="grid grid-cols-[2rem_minmax(0,1fr)_auto] items-center gap-3 rounded-md border border-zinc-800 bg-zinc-900 p-3"
              key={entry.playerKey}
            >
              <span className="text-center text-lg font-bold text-amber-400" aria-label={`${entry.position}ª posicao`}>
                {entry.position}º
              </span>
              <span className="truncate font-semibold">{entry.name}</span>
              <span className="whitespace-nowrap text-sm text-zinc-300">
                <strong className="text-base text-white">{entry.rankingPoints}</strong> pts
              </span>
            </li>
          ))}
        </ol>
      )}
    </section>
  );
}
