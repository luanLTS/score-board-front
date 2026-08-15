import { useEffect, useMemo, useState } from "react";

import { HistoryList } from "../features/history/components/HistoryList";
import { MatchDetails } from "../features/history/components/MatchDetails";
import { createHistoryStorage } from "../features/history/persistence/historyStorage";
import { CurrentMatchView } from "../features/matches/components/CurrentMatchView";
import { NewMatchForm } from "../features/matches/components/NewMatchForm";
import { useCurrentMatch } from "../features/matches/hooks/useCurrentMatch";
import type { FinishedMatch } from "../features/matches/types";
import {
  createPendingMatch,
  startMatch,
  updateMatchScores,
} from "../features/matches/utils/matchLifecycle";
import { createScoreboardStorage } from "../features/scoreboard/persistence/scoreboardStorage";
import { StatsView } from "../features/stats/components/StatsView";
import { TournamentForm } from "../features/tournaments/components/TournamentForm";
import { TournamentView } from "../features/tournaments/components/TournamentView";
import { useTournament } from "../features/tournaments/hooks/useTournament";

export function App() {
  const [section, setSection] = useState<"matches" | "tournament" | "stats">("matches");
  const [activeBracketMatchId, setActiveBracketMatchId] = useState<string | null>(null);
  const historyStorage = useMemo(() => createHistoryStorage(), []);
  const scoreboardStorage = useMemo(() => createScoreboardStorage(), []);
  const restoredMatch = useMemo(() => {
    const saved = scoreboardStorage.load();
    if (!saved) return null;

    const pending = createPendingMatch({
      gameKind: saved.gameKind,
      participants: saved.players,
    });
    return updateMatchScores(startMatch(pending), [
      saved.players[0].score,
      saved.players[1].score,
    ]);
  }, [scoreboardStorage]);
  const [historyState, setHistoryState] = useState<{
    matches: FinishedMatch[];
    selectedMatchId?: string;
  }>(() => {
    const savedMatches = historyStorage.list();
    return { matches: savedMatches, selectedMatchId: savedMatches[0]?.id };
  });
  const {
    currentMatch,
    createMatch,
    finishCurrentMatch,
    prepareNewMatch,
    startCurrentMatch,
    updateCurrentMatchScores,
    renameCurrentMatchParticipant,
    changeCurrentMatchGameKind,
  } = useCurrentMatch(restoredMatch);
  const {
    tournament,
    createTournament,
    addParticipant,
    startTournament,
    recordWinner,
    clearTournament,
  } = useTournament();
  const { matches, selectedMatchId } = historyState;
  const selectedMatch = matches.find((match) => match.id === selectedMatchId) ?? null;

  useEffect(() => {
    if (activeBracketMatchId || currentMatch?.status !== "in_progress" || !tournament?.bracket) return;
    const participantIds = currentMatch.participants.map(({ id }) => id);
    const restoredBracketMatch = tournament.bracket.rounds
      .flatMap((round) => round.matches)
      .find((match) =>
        match.status === "ready" &&
        match.participants.every((participant, index) => participant?.id === participantIds[index]),
      );
    if (restoredBracketMatch) setActiveBracketMatchId(restoredBracketMatch.id);
  }, [activeBracketMatchId, currentMatch, tournament]);

  useEffect(() => {
    if (currentMatch?.status !== "finished") return;
    if (historyStorage.list().some((match) => match.id === currentMatch.id)) return;

    historyStorage.add(currentMatch);
    setHistoryState({
      matches: historyStorage.list(),
      selectedMatchId: currentMatch.id,
    });
  }, [currentMatch, historyStorage]);

  useEffect(() => {
    if (currentMatch?.status === "in_progress") {
      scoreboardStorage.save({
        gameKind: currentMatch.gameKind,
        players: currentMatch.participants as Parameters<typeof scoreboardStorage.save>[0]["players"],
      });
      return;
    }

    scoreboardStorage.clear();
  }, [currentMatch, scoreboardStorage]);

  useEffect(() => {
    if (!activeBracketMatchId || currentMatch?.status !== "finished") return;
    if (currentMatch.result?.type !== "winner") {
      setActiveBracketMatchId(null);
      return;
    }

    recordWinner(activeBracketMatchId, currentMatch.result.winnerId, currentMatch.id);
    setActiveBracketMatchId(null);
  }, [activeBracketMatchId, currentMatch, recordWinner]);

  return (
    <main className="min-h-screen bg-zinc-950 px-4 py-6 text-zinc-50">
      <div className="mx-auto w-full max-w-6xl space-y-6">
        <nav aria-label="Seções" className="grid grid-cols-3 rounded-lg border border-zinc-800 bg-zinc-900/60 p-1">
          <button
            aria-current={section === "matches" ? "page" : undefined}
            className={`flex-1 rounded-md px-4 py-2 text-sm font-semibold ${section === "matches" ? "bg-teal-300 text-zinc-950" : "text-zinc-300"}`}
            onClick={() => setSection("matches")}
            type="button"
          >
            Partidas
          </button>
          <button
            aria-current={section === "tournament" ? "page" : undefined}
            className={`flex-1 rounded-md px-4 py-2 text-sm font-semibold ${section === "tournament" ? "bg-amber-300 text-zinc-950" : "text-zinc-300"}`}
            onClick={() => setSection("tournament")}
            type="button"
          >
            Torneio
          </button>
          <button
            aria-current={section === "stats" ? "page" : undefined}
            className={`rounded-md px-2 py-2 text-sm font-semibold sm:px-4 ${section === "stats" ? "bg-violet-300 text-zinc-950" : "text-zinc-300"}`}
            onClick={() => setSection("stats")}
            type="button"
          >
            Ranking
          </button>
        </nav>

        {section === "stats" ? (
          <StatsView matches={matches} />
        ) : (
        <div className="grid gap-8 lg:grid-cols-[minmax(0,2fr)_minmax(320px,1fr)]">
          <div>
            {section === "tournament" && !activeBracketMatchId ? (
              tournament ? (
                <TournamentView
                  matchesDisabled={currentMatch?.status === "in_progress"}
                  onNewTournament={clearTournament}
                  onPlayMatch={(bracketMatch) => {
                    const [first, second] = bracketMatch.participants;
                    if (!first || !second || currentMatch?.status === "in_progress") return;
                    setActiveBracketMatchId(bracketMatch.id);
                    createMatch({ gameKind: "generic", participants: [first, second] });
                    startCurrentMatch();
                  }}
                  tournament={tournament}
                />
              ) : (
                <TournamentForm
                  onSubmit={({ name, participants }) => {
                    createTournament(name);
                    participants.forEach((participant) => addParticipant(participant.name));
                    startTournament();
                  }}
                />
              )
            ) : currentMatch ? (
              <CurrentMatchView
                match={currentMatch}
                onFinish={finishCurrentMatch}
                onGameKindChange={changeCurrentMatchGameKind}
                onNewMatch={prepareNewMatch}
                onRenameParticipant={renameCurrentMatchParticipant}
                onStart={startCurrentMatch}
                onUpdateScores={updateCurrentMatchScores}
              />
            ) : (
              <NewMatchForm
                onSubmit={({ participantOneName, participantTwoName, gameKind }) => {
                  createMatch({
                    gameKind,
                    participants: [
                      { id: "player-1", name: participantOneName },
                      { id: "player-2", name: participantTwoName },
                    ],
                  });
                  startCurrentMatch();
                }}
              />
            )}
          </div>
          <aside className="space-y-4">
          <HistoryList
            matches={matches}
            onSelectMatch={(matchId) =>
              setHistoryState((state) => ({ ...state, selectedMatchId: matchId }))
            }
            selectedMatchId={selectedMatchId}
          />
          <MatchDetails match={selectedMatch} />
          </aside>
        </div>
        )}
      </div>
    </main>
  );
}
