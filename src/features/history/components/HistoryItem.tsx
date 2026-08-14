import type { FinishedMatch } from "../../matches/types";

type HistoryItemProps = {
  match: FinishedMatch;
  isSelected: boolean;
  onSelect: (matchId: string) => void;
};

const gameKindLabels: Record<FinishedMatch["gameKind"], string> = {
  generic: "Generico",
  truco: "Truco",
  fifa: "Fifa",
};

const formatDate = (value: Date | string): string =>
  new Intl.DateTimeFormat("pt-BR").format(new Date(value));

export function HistoryItem({ match, isSelected, onSelect }: HistoryItemProps) {
  const [home, away] = match.participants;
  const label = `${home.name} ${home.score} x ${away.score} ${away.name}`;

  return (
    <button
      aria-label={label}
      aria-pressed={isSelected}
      className={`w-full rounded-md border p-4 text-left transition focus:outline-none focus:ring-2 focus:ring-teal-300 ${
        isSelected
          ? "border-teal-300 bg-teal-300/10"
          : "border-zinc-800 bg-zinc-900 hover:bg-zinc-800"
      }`}
      onClick={() => {
        onSelect(match.id);
      }}
      type="button"
    >
      <span className="block font-semibold text-zinc-50">{label}</span>
      <span className="mt-2 flex flex-wrap gap-3 text-sm text-zinc-400">
        <span>{gameKindLabels[match.gameKind]}</span>
        <span>{formatDate(match.finishedAt)}</span>
      </span>
    </button>
  );
}
