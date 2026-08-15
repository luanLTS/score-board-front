import type { TournamentParticipant } from "../types";

type TournamentParticipantsProps = {
  participants: TournamentParticipant[];
  onRemove?: (participantId: string) => void;
};

export function TournamentParticipants({
  participants,
  onRemove,
}: TournamentParticipantsProps) {
  return (
    <section aria-labelledby="tournament-participants-title" className="space-y-3">
      <div className="flex items-center justify-between gap-3">
        <h3 className="font-semibold" id="tournament-participants-title">
          Participantes
        </h3>
        <span className="rounded-full bg-zinc-800 px-2.5 py-1 text-xs text-zinc-300">
          {participants.length}
        </span>
      </div>
      <ol className="grid gap-2 sm:grid-cols-2">
        {participants.map((participant, index) => (
          <li
            className="flex items-center gap-3 rounded-lg border border-zinc-800 bg-zinc-950/60 px-3 py-2"
            key={participant.id}
          >
            <span className="w-5 text-center text-xs font-bold text-zinc-500">
              {index + 1}
            </span>
            <span className="min-w-0 flex-1 truncate text-sm font-medium">
              {participant.name}
            </span>
            {onRemove ? (
              <button
                aria-label={`Remover ${participant.name}`}
                className="rounded px-2 py-1 text-xs text-zinc-400 hover:bg-zinc-800 hover:text-red-300"
                onClick={() => onRemove(participant.id)}
                type="button"
              >
                Remover
              </button>
            ) : null}
          </li>
        ))}
      </ol>
    </section>
  );
}
