import type { FinishedMatch } from "../types";
import { ShareResultButton } from "../../sharing/components/ShareResultButton";

type MatchFinishedActionsProps = {
  match: FinishedMatch;
  onNewMatch: () => void;
};

export function MatchFinishedActions({
  match,
  onNewMatch,
}: MatchFinishedActionsProps) {
  const winnerId =
    match.result?.type === "winner" ? match.result.winnerId : match.winnerId;
  const winner = match.participants.find(
    (participant) => participant.id === winnerId,
  );
  const isDraw = match.result?.type === "draw" || !winner;

  return (
    <section
      aria-labelledby="match-result-title"
      className="space-y-4 rounded-xl border border-zinc-800 bg-zinc-900/60 p-6"
    >
      <div className="space-y-2">
        <p className="text-sm font-medium uppercase text-teal-300">
          Partida finalizada
        </p>
        <h2 className="text-2xl font-bold" id="match-result-title">
          {isDraw ? "Empate" : `${winner.name} venceu`}
        </h2>
        <p className="text-zinc-300">
          {match.participants[0].name} {match.participants[0].score} ×{" "}
          {match.participants[1].score} {match.participants[1].name}
        </p>
      </div>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-start">
        <button
          className="min-h-11 rounded-md bg-teal-300 px-4 py-3 font-bold text-zinc-950 transition hover:bg-teal-200 focus:outline-none focus:ring-2 focus:ring-teal-300 focus:ring-offset-2 focus:ring-offset-zinc-900"
          onClick={onNewMatch}
          type="button"
        >
          Novo confronto
        </button>
        <ShareResultButton match={match} />
      </div>
    </section>
  );
}
