type PlayerNameInputProps = {
  id: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
};

export function PlayerNameInput({
  id,
  label,
  value,
  onChange,
  disabled = false,
}: PlayerNameInputProps) {
  return (
    <label className="block" htmlFor={id}>
      <span className="text-sm font-medium text-zinc-400">{label}</span>
      <input
        className="mt-2 w-full min-w-0 rounded-md border border-zinc-700 bg-zinc-950 px-3 py-3 text-lg font-semibold text-zinc-50 outline-none transition focus:border-teal-300 focus:ring-2 focus:ring-teal-300/30 disabled:cursor-not-allowed disabled:opacity-60"
        disabled={disabled}
        id={id}
        maxLength={32}
        onChange={(event) => onChange(event.target.value)}
        value={value}
      />
    </label>
  );
}
