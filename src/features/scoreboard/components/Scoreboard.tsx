import { useMemo } from "react";

import { usePersistentScoreboard } from "../hooks/usePersistentScoreboard";
import { getGameRules } from "../rules";
import type {
  GameKind,
  ScoreboardPlayer,
  ScoreboardPlayerId,
  ScoreboardState,
} from "../types";
import { applyScoreDelta } from "../utils/score";

import { GameKindSelect } from "./GameKindSelect";
import { ScoreboardActions } from "./ScoreboardActions";
import { ScorePanel } from "./ScorePanel";

export type ScoreboardProps = {
  /** Supplying players and/or gameKind controls that part of the scoreboard. */
  players?: [ScoreboardPlayer, ScoreboardPlayer];
  gameKind?: GameKind;
  onScoreChange?: (playerId: ScoreboardPlayerId, score: number) => void;
  onRenamePlayer?: (playerId: ScoreboardPlayerId, name: string) => void;
  onGameKindChange?: (gameKind: GameKind) => void;
  onFinishMatch?: (state: ScoreboardState) => void;
  onReset?: () => void;
  onNewMatch?: () => void;
  disabled?: boolean;
  showActions?: boolean;
};

export function Scoreboard({
  players,
  gameKind,
  ...props
}: ScoreboardProps) {
  if (players !== undefined || gameKind !== undefined) {
    if (players === undefined || gameKind === undefined) {
      throw new Error("A controlled scoreboard requires both players and gameKind.");
    }
    return <ScoreboardView {...props} gameKind={gameKind} players={players} />;
  }

  return <PersistentScoreboard {...props} />;
}

function PersistentScoreboard(props: Omit<ScoreboardProps, "players" | "gameKind">) {
  const scoreboard = usePersistentScoreboard(undefined, getGameRules);
  return (
    <ScoreboardView
      {...props}
      gameKind={scoreboard.gameKind}
      onGameKindChange={scoreboard.setGameKind}
      onNewMatch={props.onNewMatch ?? scoreboard.clearCurrentScoreboard}
      onRenamePlayer={scoreboard.renamePlayer}
      onReset={props.onReset ?? scoreboard.reset}
      onScoreChange={(playerId, score) => {
        const player = scoreboard.players.find((candidate) => candidate.id === playerId);
        if (!player || player.score === score) return;
        if (score > player.score) scoreboard.addPoint(playerId);
        else scoreboard.removePoint(playerId);
      }}
      players={scoreboard.players}
    />
  );
}

type ScoreboardViewProps = Omit<ScoreboardProps, "players" | "gameKind"> & {
  players: [ScoreboardPlayer, ScoreboardPlayer];
  gameKind: GameKind;
};

function ScoreboardView({
  players,
  gameKind,
  onScoreChange,
  onRenamePlayer,
  onGameKindChange,
  onFinishMatch = () => undefined,
  onReset,
  onNewMatch,
  disabled = false,
  showActions = true,
}: ScoreboardViewProps) {
  const state = useMemo<ScoreboardState>(
    () => ({ players, gameKind }),
    [gameKind, players],
  );
  const config = getGameRules(gameKind);
  const changeScore = (player: ScoreboardPlayer, delta: number) => {
    if (disabled) return;
    const nextScore = applyScoreDelta(player.score, delta, config);
    if (nextScore === player.score) return;

    onScoreChange?.(player.id, nextScore);
  };

  return (
    <section className="flex w-full flex-col justify-center gap-6">
      <header className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div className="space-y-2">
          <p className="text-sm font-medium uppercase text-teal-300">Score Board</p>
          <h1 className="text-3xl font-bold sm:text-5xl">Placar da partida</h1>
        </div>
        <div className="w-full sm:w-48">
          <GameKindSelect
            disabled={disabled}
            onChange={(nextGameKind) => {
              onGameKindChange?.(nextGameKind);
            }}
            selectedGameKind={gameKind}
          />
        </div>
      </header>

      <div className="grid gap-4 sm:grid-cols-2">
        {players.map((player, index) => {
          const nextHigher = applyScoreDelta(player.score, 1, config);
          const nextLower = applyScoreDelta(player.score, -1, config);
          return (
            <ScorePanel
              canAddPoint={nextHigher !== player.score}
              canRemovePoint={nextLower !== player.score}
              disabled={disabled}
              index={index}
              key={player.id}
              onAddPoint={() => changeScore(player, 1)}
              onRemovePoint={() => changeScore(player, -1)}
              onRename={(name) => {
                if (disabled) return;
                onRenamePlayer?.(player.id, name);
              }}
              player={player}
            />
          );
        })}
      </div>

      {showActions ? (
        <ScoreboardActions
          disabled={disabled}
          onClearCurrentScoreboard={onNewMatch ?? (() => undefined)}
          onFinishMatch={() => onFinishMatch(state)}
          onReset={onReset ?? (() => undefined)}
        />
      ) : null}
    </section>
  );
}
