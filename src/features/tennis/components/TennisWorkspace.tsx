import { useEffect, useMemo, useRef, useState } from "react";

import { advanceSuperTiebreak } from "../domain/rules/superTiebreak";
import { createSuperTiebreakMatch } from "../matchFactory";
import { createTennisMatchStorage } from "../matchFactory";
import { createTennisHistoryRecord, createTennisHistoryStorage } from "../persistence/tennisHistory";
import { tennisHistoryToFinishedMatch } from "../persistence/tennisHistory";
import { StatsView } from "../../stats/components/StatsView";
import { MatchWorkspaceLayout } from "../../matches/components/MatchWorkspaceLayout";
import type { SuperTiebreakState } from "../domain/types";

import { TennisMatchView } from "./TennisMatchView";
import { TennisMatchSetup } from "./TennisMatchSetup";
import { TennisTournamentWorkspace } from "./TennisTournamentWorkspace";

export type TennisWorkspaceSection = "match" | "ranking" | "tournament";

type TennisWorkspaceProps = {
  section?: TennisWorkspaceSection;
  onSelect?: (section: TennisWorkspaceSection) => void;
};

export function TennisWorkspace({ section, onSelect }: TennisWorkspaceProps) {
  const matchStorage = useMemo(() => createTennisMatchStorage(), []);
  const historyStorage = useMemo(() => createTennisHistoryStorage(), []);
  const [history, setHistory] = useState(() => historyStorage.list());
  const restoredMatch = useMemo(() => matchStorage.load(), [matchStorage]);
  const [localActiveSection, setLocalActiveSection] = useState<TennisWorkspaceSection>("match");
  const activeSection = section ?? localActiveSection;
  const [match, setMatch] = useState<SuperTiebreakState | null>(restoredMatch);
  const [participantNames, setParticipantNames] = useState<Record<string, string>>(restoredMatch?.participantNames ?? {});
  const [selectedHistoryId, setSelectedHistoryId] = useState<string | undefined>(() => historyStorage.list()[0]?.id);
  const tennisMatches = history.map(tennisHistoryToFinishedMatch);
  const historyId = useRef(restoredMatch ? `restored-${restoredMatch.firstServerId}-${restoredMatch.participants.join("-")}` : null);

  useEffect(() => {
    if (match) matchStorage.save(match);
    else matchStorage.clear();
  }, [match, matchStorage]);

  useEffect(() => {
    if (match?.status !== "finished" || !match.winnerId || !historyId.current) return;
    if (historyStorage.list().some((record) => record.id === historyId.current)) return;
    historyStorage.add(createTennisHistoryRecord({
      id: historyId.current,
      match,
      participantNames,
      startedAt: match.startedAt ?? new Date(),
      finishedAt: new Date(),
    }));
    setHistory(historyStorage.list());
    setSelectedHistoryId(historyId.current);
  }, [historyStorage, match, participantNames]);
  useEffect(() => {
    if (activeSection === "match" || activeSection === "ranking") {
      const latestHistory = historyStorage.list();
      setHistory(latestHistory);
      setSelectedHistoryId(latestHistory[0]?.id);
    }
  }, [activeSection, historyStorage]);
  const selectSection = (nextSection: TennisWorkspaceSection) => {
    if (section === undefined) setLocalActiveSection(nextSection);
    onSelect?.(nextSection);
  };

  const selectedRecord = history.find(({ id }) => id === selectedHistoryId) ?? null;

  return (
    <div className="space-y-6">
      <nav aria-label="Seções" className="grid grid-cols-3 rounded-lg border border-zinc-800 bg-zinc-900/60 p-1">
        <button
          aria-current={activeSection === "match" ? "page" : undefined}
          className={`flex-1 rounded-md px-4 py-2 text-sm font-semibold ${activeSection === "match" ? "bg-teal-300 text-zinc-950" : "text-zinc-300"}`}
          onClick={() => selectSection("match")}
          type="button"
        >
          Partidas
        </button>
        <button
          aria-current={activeSection === "tournament" ? "page" : undefined}
          className={`flex-1 rounded-md px-4 py-2 text-sm font-semibold ${activeSection === "tournament" ? "bg-amber-300 text-zinc-950" : "text-zinc-300"}`}
          onClick={() => selectSection("tournament")}
          type="button"
        >
          Torneio
        </button>
        <button
          aria-current={activeSection === "ranking" ? "page" : undefined}
          className={`rounded-md px-2 py-2 text-sm font-semibold sm:px-4 ${activeSection === "ranking" ? "bg-violet-300 text-zinc-950" : "text-zinc-300"}`}
          onClick={() => selectSection("ranking")}
          type="button"
        >
          Ranking
        </button>
      </nav>

      {activeSection === "match" ? (
        <MatchWorkspaceLayout
          detailsExtra={selectedRecord ? [
            ...(selectedRecord.tournamentName ? [`Torneio: ${selectedRecord.tournamentName}`] : []),
            ...(selectedRecord.roundLabel ? [`Fase: ${selectedRecord.roundLabel}`] : []),
            ...(selectedRecord.games ?? []).map((game, index) => `Game ${index + 1}: ${game.points[0]} × ${game.points[1]}`),
          ] : []}
          detailsFormatLabel={selectedRecord ? (selectedRecord.format === "super_tiebreak" ? "Super tie-break" : "Melhor de 3 games") : undefined}
          getFormatLabel={(finishedMatch) => {
            const record = history.find(({ id }) => id === finishedMatch.id)!;
            const format = record.format === "super_tiebreak" ? "Super tie-break" : "Melhor de 3 games";
            return `Tênis · ${format}${record.tournamentName ? ` · ${record.tournamentName}` : ""}`;
          }}
          matches={tennisMatches}
          onSelectMatch={setSelectedHistoryId}
          selectedMatch={selectedRecord ? tennisHistoryToFinishedMatch(selectedRecord) : null}
          selectedMatchId={selectedHistoryId}
        >
          {match ? (
            <div className="space-y-3">
              <TennisMatchView match={match} participantNames={participantNames} onPoint={(participantId) => setMatch(advanceSuperTiebreak(match, participantId))} />
              <button className="rounded-md border border-zinc-700 px-4 py-2 text-sm font-semibold text-zinc-200" onClick={() => setMatch(null)} type="button">Nova partida</button>
            </div>
          ) : (
            <TennisMatchSetup
              onStart={({ first, second }) => {
                historyId.current = `tennis-match-${Date.now()}`;
                setParticipantNames({ "player-1": first, "player-2": second });
                setMatch({
                  ...createSuperTiebreakMatch(["player-1", "player-2"]),
                  participantNames: { "player-1": first, "player-2": second },
                });
              }}
            />
          )}
        </MatchWorkspaceLayout>
      ) : null}

      {activeSection === "ranking" ? (
        <StatsView matches={tennisMatches} />
      ) : null}

      {activeSection === "tournament" ? (
        <MatchWorkspaceLayout
          detailsExtra={selectedRecord ? [
            ...(selectedRecord.tournamentName ? [`Torneio: ${selectedRecord.tournamentName}`] : []),
            ...(selectedRecord.roundLabel ? [`Fase: ${selectedRecord.roundLabel}`] : []),
            ...(selectedRecord.games ?? []).map((game, index) => `Game ${index + 1}: ${game.points[0]} × ${game.points[1]}`),
          ] : []}
          detailsFormatLabel={selectedRecord ? (selectedRecord.format === "super_tiebreak" ? "Super tie-break" : "Melhor de 3 games") : undefined}
          getFormatLabel={(finishedMatch) => {
            const record = history.find(({ id }) => id === finishedMatch.id)!;
            const format = record.format === "super_tiebreak" ? "Super tie-break" : "Melhor de 3 games";
            return `Tênis · ${format}${record.tournamentName ? ` · ${record.tournamentName}` : ""}`;
          }}
          matches={tennisMatches}
          onSelectMatch={setSelectedHistoryId}
          selectedMatch={selectedRecord ? tennisHistoryToFinishedMatch(selectedRecord) : null}
          selectedMatchId={selectedHistoryId}
        >
          <TennisTournamentWorkspace />
        </MatchWorkspaceLayout>
      ) : null}
    </div>
  );
}
