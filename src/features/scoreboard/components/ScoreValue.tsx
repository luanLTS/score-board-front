type ScoreValueProps = {
  label: string;
  score: number;
};

export function ScoreValue({ label, score }: ScoreValueProps) {
  return (
    <output
      aria-label={label}
      className="block min-h-28 text-center text-7xl font-black leading-none tabular-nums text-zinc-50 sm:text-8xl"
    >
      {score}
    </output>
  );
}
