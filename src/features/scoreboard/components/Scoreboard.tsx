import { useScoreboard } from "../hooks/useScoreboard";

import { ScoreboardActions } from "./ScoreboardActions";
import { ScorePanel } from "./ScorePanel";

export function Scoreboard() {
  const { addPoint, players, removePoint, renamePlayer, reset } =
    useScoreboard();

  return (
    <section className="mx-auto flex min-h-[calc(100vh-3rem)] w-full max-w-5xl flex-col justify-center gap-6">
      <header className="space-y-2">
        <p className="text-sm font-medium uppercase text-teal-300">
          Score Board
        </p>
        <h1 className="text-3xl font-bold sm:text-5xl">Placar da partida</h1>
      </header>

      <div className="grid gap-4 sm:grid-cols-2">
        {players.map((player, index) => (
          <ScorePanel
            index={index}
            key={player.id}
            onAddPoint={() => {
              addPoint(player.id);
            }}
            onRemovePoint={() => {
              removePoint(player.id);
            }}
            onRename={(name) => {
              renamePlayer(player.id, name);
            }}
            player={player}
          />
        ))}
      </div>

      <ScoreboardActions onReset={reset} />
    </section>
  );
}
