import { getGameRules } from "../rules";
import { usePersistentScoreboard } from "../hooks/usePersistentScoreboard";
import type { ScoreboardState } from "../types";

import { GameKindSelect } from "./GameKindSelect";
import { ScoreboardActions } from "./ScoreboardActions";
import { ScorePanel } from "./ScorePanel";

type ScoreboardProps = {
  onFinishMatch?: (state: ScoreboardState) => void;
};

export function Scoreboard({ onFinishMatch = () => undefined }: ScoreboardProps) {
  const {
    addPoint,
    canAddPoint,
    canRemovePoint,
    clearCurrentScoreboard,
    gameKind,
    players,
    removePoint,
    renamePlayer,
    reset,
    setGameKind,
    state,
  } = usePersistentScoreboard(undefined, getGameRules);

  return (
    <section className="flex w-full flex-col justify-center gap-6">
      <header className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div className="space-y-2">
          <p className="text-sm font-medium uppercase text-teal-300">
            Score Board
          </p>
          <h1 className="text-3xl font-bold sm:text-5xl">Placar da partida</h1>
        </div>
        <div className="w-full sm:w-48">
          <GameKindSelect
            onChange={setGameKind}
            selectedGameKind={gameKind}
          />
        </div>
      </header>

      <div className="grid gap-4 sm:grid-cols-2">
        {players.map((player, index) => (
          <ScorePanel
            canAddPoint={canAddPoint(player.id)}
            canRemovePoint={canRemovePoint(player.id)}
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

      <ScoreboardActions
        onClearCurrentScoreboard={clearCurrentScoreboard}
        onFinishMatch={() => {
          onFinishMatch(state);
        }}
        onReset={reset}
      />
    </section>
  );
}
