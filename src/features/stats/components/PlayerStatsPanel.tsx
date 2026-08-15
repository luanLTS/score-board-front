import type { PlayerStats } from "../types";

type PlayerStatsPanelProps = {
  stats?: PlayerStats;
  players?: readonly Pick<PlayerStats, "playerKey" | "name">[];
  onSelectPlayer?: (playerKey: string) => void;
};

const formatPercentage = (value: number) =>
  new Intl.NumberFormat("pt-BR", { maximumFractionDigits: 1 }).format(value);

export function PlayerStatsPanel({
  stats,
  players = [],
  onSelectPlayer,
}: PlayerStatsPanelProps) {
  if (!stats) {
    return (
      <section className="space-y-4" aria-labelledby="player-stats-title">
        <h2 id="player-stats-title" className="text-xl font-bold">Estatisticas</h2>
        <p className="rounded-md border border-zinc-800 bg-zinc-900 p-4 text-zinc-400">
          Selecione um participante com partidas finalizadas
        </p>
      </section>
    );
  }

  const metrics = [
    ["Jogos", stats.games],
    ["Vitorias", stats.wins],
    ["Empates", stats.draws],
    ["Derrotas", stats.losses],
    ["Pontos pro", stats.pointsFor],
    ["Pontos contra", stats.pointsAgainst],
    ["Saldo", stats.scoreDifference],
    ["Aproveitamento", `${formatPercentage(stats.successRate)}%`],
  ] as const;

  return (
    <section className="space-y-4" aria-labelledby={`player-stats-${stats.playerKey}`}>
      <div>
        <h2 id={`player-stats-${stats.playerKey}`} className="text-xl font-bold">Estatisticas</h2>
        <p className="text-sm text-zinc-400">{stats.name}</p>
      </div>
      {players.length > 0 && onSelectPlayer && (
        <label className="grid gap-1 text-sm text-zinc-300">
          Ver estatisticas de
          <select
            className="rounded-md border border-zinc-700 bg-zinc-900 p-2 text-white"
            onChange={(event) => onSelectPlayer(event.target.value)}
            value={stats.playerKey}
          >
            {players.map(({ playerKey, name }) => (
              <option key={playerKey} value={playerKey}>{name}</option>
            ))}
          </select>
        </label>
      )}
      <dl className="grid grid-cols-2 gap-2 sm:grid-cols-4">
        {metrics.map(([label, value]) => (
          <div className="min-w-0 rounded-md border border-zinc-800 bg-zinc-900 p-3" key={label}>
            <dt className="text-xs text-zinc-400">{label}</dt>
            <dd className="mt-1 truncate text-lg font-bold">{value}</dd>
          </div>
        ))}
      </dl>
    </section>
  );
}
