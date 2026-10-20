import { useState, type FormEvent } from "react";

import type { TournamentParticipant } from "../types";

export type TournamentFormValues = {
  name: string;
  participants: TournamentParticipant[];
};

type TournamentFormProps = {
  onSubmit: (values: TournamentFormValues) => void;
  disabled?: boolean;
};

const participantId = () =>
  typeof crypto !== "undefined" && "randomUUID" in crypto
    ? crypto.randomUUID()
    : `participant-${Date.now()}-${Math.random()}`;

export function TournamentForm({ onSubmit, disabled = false }: TournamentFormProps) {
  const [name, setName] = useState("");
  const [participantsText, setParticipantsText] = useState("");
  const participantNames = participantsText.split(",").map((participant) => participant.trim()).filter(Boolean);
  const normalizedNames = participantNames.map((participant) => participant.toLocaleLowerCase("pt-BR"));
  const hasDuplicates = new Set(normalizedNames).size !== normalizedNames.length;
  const canSubmit = Boolean(name.trim()) && participantNames.length >= 2 && !hasDuplicates;

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!canSubmit || disabled) return;
    const participants: TournamentParticipant[] = participantNames.map((participantName) => ({ id: participantId(), name: participantName }));
    onSubmit({ name: name.trim(), participants });
  };

  return (
    <form
      className="space-y-6 rounded-xl border border-zinc-800 bg-zinc-900/60 p-4 shadow-xl shadow-black/10 sm:p-6"
      onSubmit={handleSubmit}
    >
      <header className="space-y-2">
        <p className="text-sm font-medium uppercase text-amber-300">Novo torneio</p>
        <h2 className="text-2xl font-bold">Monte o chaveamento</h2>
        <p className="text-sm text-zinc-400">
          Informe ao menos dois participantes separados por vírgula. O formato é eliminatório simples.
        </p>
      </header>

      <label className="block text-sm font-medium text-zinc-300">
        Nome do torneio
        <input
          className="mt-2 w-full rounded-md border border-zinc-700 bg-zinc-950 px-3 py-2 outline-none focus:border-amber-300 focus:ring-2 focus:ring-amber-300/20"
          disabled={disabled}
          onChange={(event) => setName(event.target.value)}
          placeholder="Copa de sexta"
          value={name}
        />
      </label>

      <label className="block text-sm font-medium text-zinc-300" htmlFor="new-tournament-participants">
        Participantes separados por vírgula
        <input
          className="mt-2 w-full rounded-md border border-zinc-700 bg-zinc-950 px-3 py-2 outline-none focus:border-amber-300 focus:ring-2 focus:ring-amber-300/20"
          disabled={disabled}
          id="new-tournament-participants"
          onChange={(event) => setParticipantsText(event.target.value)}
          placeholder="Ana, Bia, Carlos"
          value={participantsText}
        />
        {hasDuplicates ? <span className="mt-2 block text-xs text-amber-300">Os participantes devem ter nomes únicos.</span> : null}
      </label>

      <button
        className="w-full rounded-md bg-amber-300 px-4 py-3 font-bold text-zinc-950 transition hover:bg-amber-200 disabled:cursor-not-allowed disabled:opacity-40"
        disabled={disabled || !canSubmit}
        type="submit"
      >
        Criar torneio
      </button>
    </form>
  );
}
