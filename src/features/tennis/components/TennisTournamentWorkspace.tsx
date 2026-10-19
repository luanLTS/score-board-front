import { useEffect, useMemo, useState } from "react";

import { advanceSuperTiebreak } from "../domain/rules/superTiebreak";
import { advanceBestOfThree } from "../domain/rules/match";
import type { SuperTiebreakState, TennisMatchState } from "../domain/types";
import { createBestOfThreeMatch, createSuperTiebreakMatch } from "../matchFactory";
import { createTennisTournamentStorage } from "../persistence/tournamentStorage";
import { createTennisTournamentHistoryStorage } from "../persistence/tournamentHistory";
import { createTournamentTennisHistoryRecord, createTennisHistoryStorage } from "../persistence/tennisHistory";
import { generateQualifyingMatches } from "../tournament/schedule";
import {
  closeQualifyingTurn,
  createTennisTournament,
  startAnotherQualifyingTurn,
  startEliminationPhase,
  startQualifyingTurn,
  recordEliminationWinner,
} from "../tournament/state";
import type { TennisQualifyingMatch, TennisTournamentState } from "../tournament/types";
import type { BracketMatch } from "../../tournaments/types";

import { TennisMatchView } from "./TennisMatchView";
import { TennisTournamentView } from "./TennisTournamentView";

const participantIds = (tournament: TennisTournamentState) => tournament.participants.map(({ id }) => id);

function TennisTournamentArchive({ items }: { items: ReturnType<ReturnType<typeof createTennisTournamentHistoryStorage>["list"]> }) {
  return <section aria-label="Histórico de campeonatos" className="space-y-2 rounded-xl border border-zinc-800 bg-zinc-900/60 p-5">
    <h3 className="text-lg font-bold">Histórico de campeonatos</h3>
    {items.length ? items.map((item) => (
      <details className="rounded border border-zinc-800 p-3" key={item.id}>
        <summary>{item.name} · {item.status === "finished" ? "Finalizado" : "Cancelado"} · {new Date(item.terminalAt).toLocaleDateString("pt-BR")}</summary>
        <p className="mt-2 text-sm">Participantes: {item.participants.map(({ name }) => name).join(", ")}</p>
        <p className="text-sm">Partidas classificatórias concluídas: {item.turns.flatMap(({ matches }) => matches).filter(({ status }) => status === "finished").length}</p>
        {item.eliminationBracket ? <ul className="mt-2 space-y-1 text-sm">{item.eliminationBracket.rounds.flatMap((round) => round.matches).map((match) => <li key={match.id}>{match.participants.map((participant) => participant?.name ?? "A definir").join(" × ")}{match.status === "finished" ? ` · Vencedor: ${item.participants.find(({ id }) => id === match.winnerId)?.name ?? "não definido"}` : " · Não concluída"}</li>)}</ul> : null}
      </details>
    )) : <p className="text-sm text-zinc-400">Ainda não há campeonatos no histórico.</p>}
  </section>;
}

export function TennisTournamentWorkspace() {
  const storage = useMemo(() => createTennisTournamentStorage(), []);
  const archive = useMemo(() => createTennisTournamentHistoryStorage(), []);
  const matchHistory = useMemo(() => createTennisHistoryStorage(), []);
  const [tournament, setTournament] = useState<TennisTournamentState | null>(() => storage.load());
  const [archived, setArchived] = useState(() => archive.list());
  const [participantText, setParticipantText] = useState("Ana, Bia, Carlos, Davi");
  const [activeMatch, setActiveMatch] = useState<SuperTiebreakState | TennisMatchState | null>(() => tournament?.activeMatch ?? null);
  const [activeMatchId, setActiveMatchId] = useState<string | null>(() => tournament?.activeMatchId ?? null);
  const [error, setError] = useState<string | null>(null);
  const [confirmCancel, setConfirmCancel] = useState(false);

  useEffect(() => {
    if (tournament?.status === "finished" && !tournament.terminalAt) {
      const snapshot = { ...tournament, terminalAt: new Date() };
      archive.archive(snapshot);
      setArchived(archive.list());
      setTournament(snapshot);
    }
  }, [archive, tournament]);

  useEffect(() => {
    if (tournament) storage.save(tournament);
    else storage.clear();
  }, [storage, tournament]);

  const startChampionship = () => {
    const names = participantText.split(",").map((name) => name.trim()).filter(Boolean);
    if (names.length < 2) {
      setError("Informe pelo menos dois participantes.");
      return;
    }
    const ids = names.map((_, index) => `tennis-player-${index + 1}`);
    const created = createTennisTournament("Campeonato de tênis", ids);
    const withNames = {
      ...created,
      participants: created.participants.map((participant, index) => ({ ...participant, name: names[index] })),
    };
    setTournament(startQualifyingTurn(withNames, generateQualifyingMatches(ids, 1)));
    setError(null);
  };

  const startMatch = (match: TennisQualifyingMatch) => {
    const savedTournament = tournament;
    if (savedTournament?.activeMatchId === match.id && savedTournament.activeMatch?.format === "super_tiebreak") {
      setActiveMatchId(match.id);
      setActiveMatch(savedTournament.activeMatch);
      setError(null);
      return;
    }
    const createdMatch = createSuperTiebreakMatch(match.participants);
    setActiveMatchId(match.id);
    setActiveMatch(createdMatch);
    setTournament((current) => current ? { ...current, activeMatch: createdMatch, activeMatchId: match.id } : current);
    setError(null);
  };

  const startEliminationMatch = (match: BracketMatch) => {
    const participants = match.participants;
    if (!participants[0] || !participants[1]) return;
    const savedTournament = tournament;
    if (savedTournament?.activeMatchId === match.id && savedTournament.activeMatch?.format === "best_of_three_games") {
      setActiveMatchId(match.id);
      setActiveMatch(savedTournament.activeMatch);
      setError(null);
      return;
    }
    const createdMatch = createBestOfThreeMatch([participants[0].id, participants[1].id]);
    setActiveMatchId(match.id);
    setActiveMatch(createdMatch);
    setTournament((current) => current ? { ...current, activeMatch: createdMatch, activeMatchId: match.id } : current);
    setError(null);
  };

  const updateActiveMatch = (next: SuperTiebreakState) => {
    setActiveMatch(next);
    if (!activeMatchId) return;
    if (next.status === "finished" && next.winnerId && tournament) {
      matchHistory.add(createTournamentTennisHistoryRecord({
        id: `${tournament.id}:turn-${tournament.currentTurn}:${activeMatchId}`,
        match: next,
        participantNames: Object.fromEntries(tournament.participants.map(({ id, name }) => [id, name])),
        source: "qualifying",
        tournamentId: tournament.id,
        tournamentName: tournament.name,
        roundLabel: `Turno ${tournament.currentTurn}`,
        finishedAt: new Date(),
      }));
    }
    setTournament((current) => {
      if (!current) return current;
      const turns = structuredClone(current.turns);
      const turn = turns.at(-1);
      if (!turn) return current;
      if (next.status === "finished" && next.winnerId) {
        turn.matches = turn.matches.map((match) => match.id === activeMatchId
          ? { ...match, status: "finished" as const, scores: next.scores, winnerId: next.winnerId }
          : match);
      }
      return next.status === "finished" && next.winnerId
        ? { ...current, turns, activeMatch: undefined, activeMatchId: undefined }
        : { ...current, turns, activeMatch: next, activeMatchId };
    });
  };

  const updateActiveEliminationMatch = (next: TennisMatchState) => {
    setActiveMatch(next);
    if (next.status !== "finished" || !next.winnerId || !activeMatchId) return;
    const winnerId = next.winnerId;
    const matchId = activeMatchId;
    if (tournament) matchHistory.add(createTournamentTennisHistoryRecord({
      id: `${tournament.id}:elimination:${matchId}`,
      match: next,
      participantNames: Object.fromEntries(tournament.participants.map(({ id, name }) => [id, name])),
      source: "elimination",
      tournamentId: tournament.id,
      tournamentName: tournament.name,
      roundLabel: `Eliminatórias · ${matchId}`,
      finishedAt: new Date(),
    }));
    setActiveMatch(null);
    setActiveMatchId(null);
    setTournament((current) => {
      if (!current || current.status !== "elimination_in_progress" || !current.eliminationBracket) {
        return current;
      }

      return {
        ...recordEliminationWinner(current, matchId, winnerId),
        activeMatch: undefined,
        activeMatchId: undefined,
      };
    });
  };

  if (!tournament) {
    return (
      <section className="space-y-4 rounded-xl border border-zinc-800 bg-zinc-900/60 p-6">
        <h2 className="text-2xl font-bold">Campeonato de tênis</h2>
        <label className="block text-sm text-zinc-300" htmlFor="tennis-participants">
          Participantes
          <input className="mt-1 w-full rounded-md border border-zinc-700 bg-zinc-950 px-3 py-2" id="tennis-participants" onChange={(event) => setParticipantText(event.target.value)} value={participantText} />
        </label>
        {error ? <p role="alert" className="text-sm text-red-300">{error}</p> : null}
        <button className="rounded-md bg-amber-300 px-4 py-3 font-bold text-zinc-950" onClick={startChampionship} type="button">Iniciar campeonato</button>
        <TennisTournamentArchive items={archived} />
      </section>
    );
  }

  if (activeMatch && activeMatchId) {
    const names = Object.fromEntries(tournament.participants.map((participant) => [participant.id, participant.name]));
    const isEliminationMatch = activeMatch.format === "best_of_three_games";
    return (
      <div className="space-y-3">
        <TennisMatchView
          match={activeMatch}
          participantNames={names}
          onPoint={(participantId) => {
            if (isEliminationMatch) {
              const next = advanceBestOfThree(activeMatch, participantId);
              if (next.status === "finished") updateActiveEliminationMatch(next);
              else {
                setActiveMatch(next);
                setTournament((current) => current ? { ...current, activeMatch: next, activeMatchId } : current);
              }
            } else updateActiveMatch(advanceSuperTiebreak(activeMatch, participantId));
          }}
        />
        <button className="rounded-md border border-zinc-700 px-4 py-2 text-sm font-semibold" onClick={() => { setActiveMatch(null); setActiveMatchId(null); }} type="button">Voltar ao campeonato</button>
        <button className="rounded-md border border-red-400 px-4 py-2 text-sm text-red-200" onClick={() => setConfirmCancel(true)} type="button">Cancelar campeonato</button>
        {confirmCancel ? <div role="alertdialog" aria-label="Confirmar cancelamento" className="rounded-lg border border-red-400/50 bg-zinc-950 p-4">
          <p>Cancelar o campeonato? Resultados concluídos permanecem no histórico; a partida em andamento será descartada.</p>
          <div className="mt-3 flex gap-2">
            <button type="button" onClick={() => { const cancelled = { ...tournament, status: "cancelled" as const, activeMatch: undefined, activeMatchId: undefined, terminalAt: new Date() }; archive.archive(cancelled); setArchived(archive.list()); setTournament(cancelled); setActiveMatch(null); setActiveMatchId(null); setConfirmCancel(false); }}>Confirmar cancelamento</button>
            <button type="button" onClick={() => setConfirmCancel(false)}>Continuar campeonato</button>
          </div>
        </div> : null}
      </div>
    );
  }

  const handleCloseTurn = () => {
    try {
      setTournament(closeQualifyingTurn(tournament));
      setError(null);
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "Não foi possível fechar o turno.");
    }
  };

  return (
    <div className="space-y-3">
      {error ? <p role="alert" className="rounded-md bg-red-300/10 p-3 text-sm text-red-200">{error}</p> : null}
      <TennisTournamentView
        onCloseTurn={handleCloseTurn}
        onPlayMatch={startMatch}
        onPlayEliminationMatch={startEliminationMatch}
        onStartElimination={() => setTournament(startEliminationPhase(tournament))}
        onStartNextTurn={() => setTournament(startAnotherQualifyingTurn(tournament, generateQualifyingMatches(participantIds(tournament), tournament.currentTurn + 1)))}
        onStartTurn={() => undefined}
        onCancel={() => setConfirmCancel(true)}
        onNew={() => { setTournament(null); setActiveMatch(null); setActiveMatchId(null); }}
        tournament={tournament}
      />
      <TennisTournamentArchive items={archived} />
      {confirmCancel ? (
        <div role="alertdialog" aria-label="Confirmar cancelamento" className="rounded-lg border border-red-400/50 bg-zinc-950 p-4">
          <p>Cancelar o campeonato? Resultados concluídos permanecem no histórico; a partida em andamento será descartada.</p>
          <div className="mt-3 flex gap-2">
            <button type="button" onClick={() => { const cancelled = { ...tournament, status: "cancelled" as const, activeMatch: undefined, activeMatchId: undefined, terminalAt: new Date() }; archive.archive(cancelled); setArchived(archive.list()); setTournament(cancelled); setActiveMatch(null); setActiveMatchId(null); setConfirmCancel(false); }}>Confirmar cancelamento</button>
            <button type="button" onClick={() => setConfirmCancel(false)}>Continuar campeonato</button>
          </div>
        </div>
      ) : null}
    </div>
  );
}
