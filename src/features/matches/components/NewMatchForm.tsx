import { useState, type FormEvent } from "react";

import { GameKindSelect } from "../../scoreboard/components/GameKindSelect";
import { PlayerNameInput } from "../../scoreboard/components/PlayerNameInput";
import type { GameKind } from "../../scoreboard/types";

export type NewMatchFormValues = {
  participantOneName: string;
  participantTwoName: string;
  gameKind: GameKind;
};

type NewMatchFormProps = {
  onSubmit: (values: NewMatchFormValues) => void;
  initialParticipantOneName?: string;
  initialParticipantTwoName?: string;
  initialGameKind?: GameKind;
  disabled?: boolean;
};

export function NewMatchForm({
  onSubmit,
  initialParticipantOneName = "Jogador 1",
  initialParticipantTwoName = "Jogador 2",
  initialGameKind = "generic",
  disabled = false,
}: NewMatchFormProps) {
  const [participantOneName, setParticipantOneName] = useState(
    initialParticipantOneName,
  );
  const [participantTwoName, setParticipantTwoName] = useState(
    initialParticipantTwoName,
  );
  const [gameKind, setGameKind] = useState<GameKind>(initialGameKind);
  const hasValidParticipants =
    participantOneName.trim().length > 0 && participantTwoName.trim().length > 0;

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!hasValidParticipants || disabled) {
      return;
    }

    onSubmit({
      participantOneName: participantOneName.trim(),
      participantTwoName: participantTwoName.trim(),
      gameKind,
    });
  };

  return (
    <form
      className="w-full space-y-6 rounded-xl border border-zinc-800 bg-zinc-900/60 p-4 shadow-xl shadow-black/10 sm:p-6"
      onSubmit={handleSubmit}
    >
      <header className="space-y-2">
        <p className="text-sm font-medium uppercase text-teal-300">
          Nova partida
        </p>
        <h1 className="text-2xl font-bold sm:text-3xl">Prepare o confronto</h1>
        <p className="text-sm text-zinc-400">
          Informe os participantes e escolha as regras da partida.
        </p>
      </header>

      <fieldset className="grid gap-4 sm:grid-cols-2" disabled={disabled}>
        <legend className="sr-only">Participantes</legend>
        <PlayerNameInput
          id="new-match-participant-one"
          label="Nome do participante 1"
          onChange={setParticipantOneName}
          value={participantOneName}
        />
        <PlayerNameInput
          id="new-match-participant-two"
          label="Nome do participante 2"
          onChange={setParticipantTwoName}
          value={participantTwoName}
        />
      </fieldset>

      <GameKindSelect
        disabled={disabled}
        onChange={setGameKind}
        selectedGameKind={gameKind}
      />

      <button
        className="w-full rounded-md bg-teal-300 px-4 py-3 font-bold text-zinc-950 transition hover:bg-teal-200 focus:outline-none focus:ring-2 focus:ring-teal-300 focus:ring-offset-2 focus:ring-offset-zinc-900 disabled:cursor-not-allowed disabled:opacity-50"
        disabled={disabled || !hasValidParticipants}
        type="submit"
      >
        Iniciar partida
      </button>
    </form>
  );
}
