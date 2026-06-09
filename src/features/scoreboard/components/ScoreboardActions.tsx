type ScoreboardActionsProps = {
  onReset: () => void;
};

export function ScoreboardActions({ onReset }: ScoreboardActionsProps) {
  return (
    <button
      aria-label="Resetar pontuações"
      className="min-h-14 self-stretch rounded-md border border-zinc-700 px-4 font-semibold transition hover:bg-zinc-900 focus:outline-none focus:ring-2 focus:ring-teal-300 sm:self-center sm:px-8"
      onClick={onReset}
      type="button"
    >
      Resetar placar
    </button>
  );
}
