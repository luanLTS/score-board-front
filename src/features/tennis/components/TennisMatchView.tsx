import type { SuperTiebreakState, TennisMatchState, TennisParticipantId } from "../domain/types";

type TennisMatchViewProps = {
  match: SuperTiebreakState | TennisMatchState;
  participantNames: Record<TennisParticipantId, string>;
  onPoint: (participantId: TennisParticipantId) => void;
};

export function TennisMatchView({
  match,
  participantNames,
  onPoint,
}: TennisMatchViewProps) {
  const [firstParticipant, secondParticipant] = match.participants;
  const latestSideChange = match.format === "super_tiebreak" ? match.sidesChangedAt.at(-1) : undefined;
  const currentGame = match.format === "best_of_three_games" ? match.games.at(-1) : undefined;

  return (
    <section aria-labelledby="tennis-match-title" className="space-y-6 rounded-xl border border-zinc-800 bg-zinc-900/60 p-6">
      <header className="space-y-2">
        <p className="text-sm font-medium uppercase text-amber-300">Partida de tênis</p>
        <h2 className="text-2xl font-bold" id="tennis-match-title">
          {match.format === "super_tiebreak" ? "Super tie-break" : "Melhor de 3 games"}
        </h2>
        <p className="text-zinc-300">
          Sacando: {participantNames[match.serverId]}
        </p>
      </header>

      {match.format === "super_tiebreak" ? (
        <output aria-label="Placar do super tie-break" className="block text-center text-6xl font-black tabular-nums">
          {match.scores[0]} × {match.scores[1]}
        </output>
      ) : (
        <div className="space-y-2 text-center">
          <output aria-label="Games da partida" className="block text-5xl font-black tabular-nums">
            Games: {match.gamesWon[0]} × {match.gamesWon[1]}
          </output>
          <output aria-label="Pontos do game atual" className="block text-3xl font-bold tabular-nums">
            {currentGame?.points[0]} × {currentGame?.points[1]}
          </output>
        </div>
      )}

      {latestSideChange ? (
        <p className="rounded-md bg-amber-300/10 p-3 text-center text-sm text-amber-200">
          Troca de lado após {latestSideChange} pontos
        </p>
      ) : null}

      {match.status === "finished" && match.winnerId ? (
        <p className="text-center font-semibold text-amber-300">
          Vencedor: {participantNames[match.winnerId]}
        </p>
      ) : (
        <div className="grid gap-3 sm:grid-cols-2">
          {[firstParticipant, secondParticipant].map((participantId) => (
            <button
              className="rounded-md bg-amber-300 px-4 py-3 font-bold text-zinc-950 disabled:cursor-not-allowed disabled:opacity-50"
              disabled={match.status === "finished"}
              key={participantId}
              onClick={() => onPoint(participantId)}
              type="button"
            >
              Ponto para {participantNames[participantId]}
            </button>
          ))}
        </div>
      )}
    </section>
  );
}
