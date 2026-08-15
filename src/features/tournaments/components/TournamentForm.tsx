import { useState, type FormEvent } from "react";

import type { TournamentParticipant } from "../types";
import { TournamentParticipants } from "./TournamentParticipants";

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
  const [newParticipant, setNewParticipant] = useState("");
  const [participants, setParticipants] = useState<TournamentParticipant[]>([]);
  const trimmedParticipant = newParticipant.trim();
  const canAdd =
    trimmedParticipant.length > 0 &&
    !participants.some(
      (participant) => participant.name.toLocaleLowerCase() === trimmedParticipant.toLocaleLowerCase(),
    );

  const addParticipant = () => {
    if (!canAdd || disabled) return;
    setParticipants((current) => [
      ...current,
      { id: participantId(), name: trimmedParticipant },
    ]);
    setNewParticipant("");
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!name.trim() || participants.length < 2 || disabled) return;
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
          Adicione ao menos dois participantes. O formato é eliminatório simples.
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

      <div>
        <label className="block text-sm font-medium text-zinc-300" htmlFor="new-tournament-participant">
          Nome do participante
        </label>
        <div className="mt-2 flex gap-2">
          <input
            className="min-w-0 flex-1 rounded-md border border-zinc-700 bg-zinc-950 px-3 py-2 outline-none focus:border-amber-300 focus:ring-2 focus:ring-amber-300/20"
            disabled={disabled}
            id="new-tournament-participant"
            onChange={(event) => setNewParticipant(event.target.value)}
            onKeyDown={(event) => {
              if (event.key === "Enter") {
                event.preventDefault();
                addParticipant();
              }
            }}
            placeholder="Nome ou equipe"
            value={newParticipant}
          />
          <button
            className="rounded-md border border-amber-300/60 px-4 py-2 font-semibold text-amber-200 disabled:opacity-40"
            disabled={disabled || !canAdd}
            onClick={addParticipant}
            type="button"
          >
            Adicionar
          </button>
        </div>
        {trimmedParticipant && !canAdd ? (
          <p className="mt-2 text-xs text-amber-300">Esse participante já foi adicionado.</p>
        ) : null}
      </div>

      {participants.length ? (
        <TournamentParticipants
          onRemove={(id) => setParticipants((current) => current.filter((item) => item.id !== id))}
          participants={participants}
        />
      ) : null}

      <button
        className="w-full rounded-md bg-amber-300 px-4 py-3 font-bold text-zinc-950 transition hover:bg-amber-200 disabled:cursor-not-allowed disabled:opacity-40"
        disabled={disabled || !name.trim() || participants.length < 2}
        type="submit"
      >
        Criar torneio
      </button>
    </form>
  );
}
