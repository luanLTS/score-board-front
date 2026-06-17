import { useMemo, useState } from "react";

import { HistoryList } from "../features/history/components/HistoryList";
import { MatchDetails } from "../features/history/components/MatchDetails";
import { createHistoryStorage } from "../features/history/persistence/historyStorage";
import { createFinishedMatch } from "../features/history/utils/createFinishedMatch";
import type { Match } from "../features/matches/types";
import { Scoreboard } from "../features/scoreboard/components/Scoreboard";
import type { ScoreboardState } from "../features/scoreboard/types";

export function App() {
  const historyStorage = useMemo(() => createHistoryStorage(), []);
  const [historyState, setHistoryState] = useState<{
    matches: Match[];
    selectedMatchId?: string;
  }>(() => {
    const savedMatches = historyStorage.list();

    return {
      matches: savedMatches,
      selectedMatchId: savedMatches[0]?.id,
    };
  });
  const { matches, selectedMatchId } = historyState;
  const selectedMatch =
    matches.find((match) => match.id === selectedMatchId) ?? null;

  const finishMatch = (scoreboardState: ScoreboardState) => {
    const latestMatch = matches[0];
    const latestParticipants = latestMatch?.participants;

    if (
      latestMatch?.gameKind === scoreboardState.gameKind &&
      latestParticipants?.[0].name === scoreboardState.players[0].name &&
      latestParticipants[0].score === scoreboardState.players[0].score &&
      latestParticipants[1].name === scoreboardState.players[1].name &&
      latestParticipants[1].score === scoreboardState.players[1].score
    ) {
      setHistoryState((currentState) => ({
        ...currentState,
        selectedMatchId: latestMatch.id,
      }));
      return;
    }

    const match = createFinishedMatch(scoreboardState);

    historyStorage.add(match);
    setHistoryState({
      matches: historyStorage.list(),
      selectedMatchId: match.id,
    });
  };

  return (
    <main className="min-h-screen bg-zinc-950 px-4 py-6 text-zinc-50">
      <div className="mx-auto grid min-h-[calc(100vh-3rem)] w-full max-w-6xl content-center gap-8 lg:grid-cols-[minmax(0,2fr)_minmax(320px,1fr)]">
        <Scoreboard onFinishMatch={finishMatch} />
        <aside className="space-y-4">
          <HistoryList
            matches={matches}
            onSelectMatch={(matchId) => {
              setHistoryState((currentState) => ({
                ...currentState,
                selectedMatchId: matchId,
              }));
            }}
            selectedMatchId={selectedMatchId}
          />
          <MatchDetails match={selectedMatch} />
        </aside>
      </div>
    </main>
  );
}
