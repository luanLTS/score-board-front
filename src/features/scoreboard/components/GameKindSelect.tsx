import { useId } from "react";

import type { GameKind } from "../types";

type GameKindSelectProps = {
  selectedGameKind: GameKind;
  onChange: (gameKind: GameKind) => void;
  disabled?: boolean;
};

const gameKindOptions: Array<{ value: GameKind; label: string }> = [
  { value: "generic", label: "Genérico" },
  { value: "truco", label: "Truco" },
  { value: "fifa", label: "FIFA" },
];

export function GameKindSelect({
  selectedGameKind,
  onChange,
  disabled = false,
}: GameKindSelectProps) {
  const selectId = useId();

  return (
    <label className="block text-sm font-medium text-zinc-400" htmlFor={selectId}>
      Tipo de jogo
      <select
        className="mt-2 w-full rounded-md border border-zinc-700 bg-zinc-950 px-3 py-2 text-sm font-semibold text-zinc-50 outline-none transition focus:border-teal-300 focus:ring-2 focus:ring-teal-300/30 disabled:cursor-not-allowed disabled:opacity-60"
        disabled={disabled}
        id={selectId}
        onChange={(event) => {
          onChange(event.target.value as GameKind);
        }}
        value={selectedGameKind}
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
