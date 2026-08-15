import type { ComponentType } from "react";

import { Scoreboard } from "../../scoreboard/components/Scoreboard";
import type {
  GameKind,
  ScoreboardPlayer,
  ScoreboardPlayerId,
} from "../../scoreboard/types";
import type { Match } from "../types";

import { MatchFinishedActions } from "./MatchFinishedActions";

type CurrentMatchViewProps = {
  match: Match;
  onStart: () => void;
  onUpdateScores: (scores: [number, number]) => void;
  onRenameParticipant?: (participantId: string, name: string) => void;
  onGameKindChange?: (gameKind: GameKind) => void;
  onFinish: () => void;
  onNewMatch: () => void;
  ScoreboardComponent?: ComponentType<ControlledMatchScoreboardProps>;
};

export type ControlledMatchScoreboardProps = {
  gameKind: GameKind;
  participants: Match["participants"];
  disabled: boolean;
  onScoresChange: (scores: [number, number]) => void;
  onFinish: (scores: [number, number]) => void;
  onRenameParticipant: (participantId: string, name: string) => void;
  onGameKindChange: (gameKind: GameKind) => void;
  onNewMatch: () => void;
};

const LegacyScoreboardAdapter = ({
  gameKind,
  participants,
  disabled,
  onScoresChange,
  onFinish,
  onGameKindChange,
  onNewMatch,
  onRenameParticipant,
}: ControlledMatchScoreboardProps) => {
  const players = participants as [ScoreboardPlayer, ScoreboardPlayer];
  const handleScoreChange = (playerId: ScoreboardPlayerId, score: number) => {
    onScoresChange(
      players.map((player) => (player.id === playerId ? score : player.score)) as [number, number],
    );
  };

  return (
    <Scoreboard
      disabled={disabled}
      gameKind={gameKind}
      onFinishMatch={(state) => onFinish([state.players[0].score, state.players[1].score])}
      onGameKindChange={onGameKindChange}
      onNewMatch={onNewMatch}
      onRenamePlayer={onRenameParticipant}
      onReset={() => onScoresChange([0, 0])}
      onScoreChange={handleScoreChange}
      players={players}
    />
  );
};

const statusLabel = {
  pending: "Pendente",
  in_progress: "Em andamento",
  finished: "Finalizada",
} as const;

export function CurrentMatchView({
  match,
  onStart,
  onUpdateScores,
  onFinish,
  onNewMatch,
  onRenameParticipant = () => undefined,
  onGameKindChange = () => undefined,
  ScoreboardComponent = LegacyScoreboardAdapter,
}: CurrentMatchViewProps) {
  if (match.status === "finished") {
    return <MatchFinishedActions match={match} onNewMatch={onNewMatch} />;
  }

  const handleFinish = (scores: [number, number]) => {
    onUpdateScores(scores);
    onFinish();
  };

  return (
    <section className="space-y-6" aria-labelledby="current-match-title">
      <header className="rounded-xl border border-zinc-800 bg-zinc-900/60 p-4">
        <p className="text-sm font-medium uppercase text-teal-300">
          {statusLabel[match.status]}
        </p>
        <h2 className="text-2xl font-bold" id="current-match-title">
          {match.participants[0].name} × {match.participants[1].name}
        </h2>
      </header>

      {match.status === "pending" ? (
        <button
          className="w-full rounded-md bg-teal-300 px-4 py-3 font-bold text-zinc-950"
          onClick={onStart}
          type="button"
        >
          Iniciar partida
        </button>
      ) : (
        <ScoreboardComponent
          disabled={false}
          gameKind={match.gameKind}
          onFinish={handleFinish}
          onGameKindChange={onGameKindChange}
          onNewMatch={onNewMatch}
          onRenameParticipant={onRenameParticipant}
          onScoresChange={onUpdateScores}
          participants={match.participants}
        />
      )}
    </section>
  );
}
