import type { ScoreboardPlayer } from "../types";

import { PlayerNameInput } from "./PlayerNameInput";
import { ScoreControls } from "./ScoreControls";
import { ScoreValue } from "./ScoreValue";

type ScorePanelProps = {
  index: number;
  player: ScoreboardPlayer;
  canAddPoint: boolean;
  canRemovePoint: boolean;
  onAddPoint: () => void;
  onRemovePoint: () => void;
  onRename: (name: string) => void;
};

export function ScorePanel({
  index,
  player,
  canAddPoint,
  canRemovePoint,
  onAddPoint,
  onRemovePoint,
  onRename,
}: ScorePanelProps) {
  const displayName = player.name.trim() || `Participante ${index + 1}`;

  return (
    <article className="rounded-lg border border-zinc-800 bg-zinc-900 p-5 shadow-xl shadow-black/20">
      <PlayerNameInput
        id={`${player.id}-name`}
        label={`Nome do participante ${index + 1}`}
        onChange={onRename}
        value={player.name}
      />

      <div className="my-8">
        <ScoreValue
          label={`Pontuação de ${displayName}`}
          score={player.score}
        />
      </div>

      <ScoreControls
        canAddPoint={canAddPoint}
        canRemovePoint={canRemovePoint}
        onAddPoint={onAddPoint}
        onRemovePoint={onRemovePoint}
        playerName={displayName}
      />
    </article>
  );
}
