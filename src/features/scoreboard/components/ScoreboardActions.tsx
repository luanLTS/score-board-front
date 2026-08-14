type ScoreboardActionsProps = {
  onClearCurrentScoreboard: () => void;
  onFinishMatch: () => void;
  onReset: () => void;
  disabled?: boolean;
};

export function ScoreboardActions({
  onClearCurrentScoreboard,
  onFinishMatch,
  onReset,
  disabled = false,
}: ScoreboardActionsProps) {
  const secondaryClass = "min-h-14 rounded-md border border-zinc-700 px-4 font-semibold transition enabled:hover:bg-zinc-900 focus:outline-none focus:ring-2 focus:ring-teal-300 disabled:cursor-not-allowed disabled:opacity-35";
  return (
    <div className="grid gap-3 sm:grid-cols-3">
      <button aria-label="Resetar pontuações" className={secondaryClass} disabled={disabled} onClick={onReset} type="button">
        Resetar placar
      </button>
      <button aria-label="Iniciar nova partida" className={secondaryClass} disabled={disabled} onClick={onClearCurrentScoreboard} type="button">
        Iniciar nova partida
      </button>
      <button
        aria-label="Finalizar partida"
        className="min-h-14 rounded-md bg-teal-300 px-4 font-semibold text-zinc-950 transition enabled:hover:bg-teal-200 focus:outline-none focus:ring-2 focus:ring-teal-100 disabled:cursor-not-allowed disabled:opacity-35"
        disabled={disabled}
        onClick={onFinishMatch}
        type="button"
      >
        Finalizar partida
      </button>
    </div>
  );
}
