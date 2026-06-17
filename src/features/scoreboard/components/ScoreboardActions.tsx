type ScoreboardActionsProps = {
  onClearCurrentScoreboard: () => void;
  onFinishMatch: () => void;
  onReset: () => void;
};

export function ScoreboardActions({
  onClearCurrentScoreboard,
  onFinishMatch,
  onReset,
}: ScoreboardActionsProps) {
  return (
    <div className="grid gap-3 sm:grid-cols-3">
      <button
        aria-label="Resetar pontuações"
        className="min-h-14 rounded-md border border-zinc-700 px-4 font-semibold transition hover:bg-zinc-900 focus:outline-none focus:ring-2 focus:ring-teal-300"
        onClick={onReset}
        type="button"
      >
        Resetar placar
      </button>
      <button
        aria-label="Iniciar nova partida"
        className="min-h-14 rounded-md border border-zinc-700 px-4 font-semibold transition hover:bg-zinc-900 focus:outline-none focus:ring-2 focus:ring-teal-300"
        onClick={onClearCurrentScoreboard}
        type="button"
      >
        Iniciar nova partida
      </button>
      <button
        aria-label="Finalizar partida"
        className="min-h-14 rounded-md bg-teal-300 px-4 font-semibold text-zinc-950 transition hover:bg-teal-200 focus:outline-none focus:ring-2 focus:ring-teal-100"
        onClick={onFinishMatch}
        type="button"
      >
        Finalizar partida
      </button>
    </div>
  );
}
