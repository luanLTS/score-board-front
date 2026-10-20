import type { ReactNode } from "react";

import type { FinishedMatch } from "../types";
import { HistoryList } from "../../history/components/HistoryList";
import { MatchDetails } from "../../history/components/MatchDetails";

type MatchWorkspaceLayoutProps = {
  children: ReactNode;
  matches: FinishedMatch[];
  selectedMatchId?: string;
  selectedMatch: FinishedMatch | null;
  onSelectMatch: (matchId: string) => void;
  getFormatLabel?: (match: FinishedMatch) => string;
  detailsFormatLabel?: string;
  detailsExtra?: string[];
};

export function MatchWorkspaceLayout({
  children,
  matches,
  selectedMatchId,
  selectedMatch,
  onSelectMatch,
  getFormatLabel,
  detailsFormatLabel,
  detailsExtra,
}: MatchWorkspaceLayoutProps) {
  return (
    <div className="grid gap-8 lg:grid-cols-[minmax(0,2fr)_minmax(320px,1fr)]">
      <div>{children}</div>
      <aside aria-label="Histórico da partida" className="space-y-4">
        <HistoryList
          getFormatLabel={getFormatLabel}
          matches={matches}
          onSelectMatch={onSelectMatch}
          selectedMatchId={selectedMatchId}
        />
        <MatchDetails
          extraDetails={detailsExtra}
          formatLabel={detailsFormatLabel}
          match={selectedMatch}
        />
      </aside>
    </div>
  );
}
