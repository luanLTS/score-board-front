import type { FinishedMatch } from "../../matches/types";
import { ShareResultButton } from "../../sharing/components/ShareResultButton";

type MatchDetailsProps = {
  match: FinishedMatch | null;
};

const gameKindLabels: Record<FinishedMatch["gameKind"], string> = {
  generic: "Generico",
  truco: "Truco",
  fifa: "Fifa",
};

const formatDateTime = (value: Date | string): string =>
  new Intl.DateTimeFormat("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  })
    .format(new Date(value))
    .replace(",", "");

export function MatchDetails({ match }: MatchDetailsProps) {
  if (!match) {
    return (
      <section
        aria-label="Detalhes da partida"
        className="rounded-md border border-zinc-800 bg-zinc-900 p-4 text-zinc-400"
      >
        Selecione uma partida
      </section>
    );
  }

  const [home, away] = match.participants;
  const resultWinnerId =
    match.result?.type === "winner" ? match.result.winnerId : match.winnerId;
  const winner =
    resultWinnerId
      ? match.participants.find(
          (participant) => participant.id === resultWinnerId,
        )
      : undefined;
  const resultLabel =
    match.result?.type === "draw"
      ? "Empate"
      : winner
        ? `Vencedor: ${winner.name}`
        : undefined;

  return (
    <section
      aria-label="Detalhes da partida"
      className="space-y-4 rounded-md border border-zinc-800 bg-zinc-900 p-4"
    >
      <div>
        <p className="text-sm font-medium uppercase text-teal-300">
          Finalizada
        </p>
        <h2 className="mt-1 text-2xl font-bold">
          {home.name} x {away.name}
        </h2>
      </div>

      <output
        aria-label="Placar final"
        className="block text-5xl font-black tabular-nums"
      >
        {home.score} x {away.score}
      </output>

      {resultLabel ? (
        <p className="font-semibold text-teal-300">{resultLabel}</p>
      ) : null}

      <dl className="grid gap-3 text-sm text-zinc-300 sm:grid-cols-3">
        <div>
          <dt className="text-zinc-500">Tipo</dt>
          <dd>{gameKindLabels[match.gameKind]}</dd>
        </div>
        <div>
          <dt className="text-zinc-500">Inicio</dt>
          <dd>{formatDateTime(match.startedAt)}</dd>
        </div>
        <div>
          <dt className="text-zinc-500">Fim</dt>
          <dd>{formatDateTime(match.finishedAt)}</dd>
        </div>
      </dl>

      <ShareResultButton match={match} />
    </section>
  );
}
