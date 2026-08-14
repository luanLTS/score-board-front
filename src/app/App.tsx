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

export function App() {
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
  } = useCurrentMatch(restoredMatch);
  const { matches, selectedMatchId } = historyState;
  const selectedMatch = matches.find((match) => match.id === selectedMatchId) ?? null;

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

  return (
    <main className="min-h-screen bg-zinc-950 px-4 py-6 text-zinc-50">
      <div className="mx-auto grid min-h-[calc(100vh-3rem)] w-full max-w-6xl content-center gap-8 lg:grid-cols-[minmax(0,2fr)_minmax(320px,1fr)]">
        {currentMatch ? (
          <CurrentMatchView
            match={currentMatch}
            onFinish={finishCurrentMatch}
            onNewMatch={prepareNewMatch}
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
    </main>
  );
}
