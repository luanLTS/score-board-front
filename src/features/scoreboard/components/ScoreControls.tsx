type ScoreControlsProps = {
  playerName: string;
  canRemovePoint: boolean;
  onAddPoint: () => void;
  onRemovePoint: () => void;
};

export function ScoreControls({
  playerName,
  canRemovePoint,
  onAddPoint,
  onRemovePoint,
}: ScoreControlsProps) {
  return (
    <div className="grid grid-cols-2 gap-3">
      <button
        aria-label={`Remover ponto de ${playerName}`}
        className="min-h-14 rounded-md border border-zinc-700 px-4 text-2xl font-bold transition enabled:hover:bg-zinc-800 focus:outline-none focus:ring-2 focus:ring-teal-300 disabled:cursor-not-allowed disabled:opacity-35"
        disabled={!canRemovePoint}
        onClick={onRemovePoint}
        type="button"
      >
        -
      </button>
      <button
        aria-label={`Adicionar ponto para ${playerName}`}
        className="min-h-14 rounded-md bg-teal-300 px-4 text-2xl font-bold text-zinc-950 transition hover:bg-teal-200 focus:outline-none focus:ring-2 focus:ring-teal-100"
        onClick={onAddPoint}
        type="button"
      >
        +
      </button>
    </div>
  );
}
