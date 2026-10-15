import { useState, type FormEvent } from "react";

type TennisMatchSetupProps = {
  onStart: (participants: { first: string; second: string }) => void;
};

export function TennisMatchSetup({ onStart }: TennisMatchSetupProps) {
  const [first, setFirst] = useState("Jogador 1");
  const [second, setSecond] = useState("Jogador 2");
  const valid = first.trim().length > 0 && second.trim().length > 0;

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!valid) return;
    onStart({ first: first.trim(), second: second.trim() });
  };

  return (
    <form className="space-y-4 rounded-lg border border-zinc-800 bg-zinc-950/60 p-4" onSubmit={handleSubmit}>
      <h2 className="text-xl font-bold">Partida simples</h2>
      <div className="grid gap-3 sm:grid-cols-2">
        <label className="text-sm text-zinc-300">
          Nome do jogador 1
          <input className="mt-1 w-full rounded-md border border-zinc-700 bg-zinc-900 px-3 py-2 text-zinc-50" onChange={(event) => setFirst(event.target.value)} value={first} />
        </label>
        <label className="text-sm text-zinc-300">
          Nome do jogador 2
          <input className="mt-1 w-full rounded-md border border-zinc-700 bg-zinc-900 px-3 py-2 text-zinc-50" onChange={(event) => setSecond(event.target.value)} value={second} />
        </label>
      </div>
      <button className="rounded-md bg-amber-300 px-4 py-3 font-bold text-zinc-950 disabled:cursor-not-allowed disabled:opacity-50" disabled={!valid} type="submit">
        Iniciar super tie-break
      </button>
    </form>
  );
}
