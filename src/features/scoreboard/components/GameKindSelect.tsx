import type { GameKind } from "../types";

type GameKindSelectProps = {
  value: GameKind;
  onChange: (gameKind: GameKind) => void;
};

const gameKindOptions: Array<{ value: GameKind; label: string }> = [
  { value: "generic", label: "Generico" },
  { value: "truco", label: "Truco" },
  { value: "fifa", label: "Fifa" },
];

export function GameKindSelect({ value, onChange }: GameKindSelectProps) {
  return (
    <label className="block max-w-xs">
      <span className="text-sm font-medium text-zinc-400">
        Tipo de partida
      </span>
      <select
        className="mt-2 w-full rounded-md border border-zinc-700 bg-zinc-950 px-3 py-3 text-base font-semibold text-zinc-50 outline-none transition focus:border-teal-300 focus:ring-2 focus:ring-teal-300/30"
        onChange={(event) => {
          onChange(event.target.value as GameKind);
        }}
        value={value}
      >
        {gameKindOptions.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </label>
  );
}
