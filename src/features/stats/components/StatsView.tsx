import { useMemo, useState } from "react";

import type { FinishedMatch } from "../../matches/types";
import { calculatePlayerStats } from "../utils/playerStats";
import { calculateRanking } from "../utils/ranking";
import { PlayerStatsPanel } from "./PlayerStatsPanel";
import { RankingList } from "./RankingList";

type StatsViewProps = {
  matches: readonly FinishedMatch[];
};

export function StatsView({ matches }: StatsViewProps) {
  const ranking = useMemo(() => calculateRanking(matches), [matches]);
  const stats = useMemo(() => calculatePlayerStats(matches), [matches]);
  const [selectedPlayerKey, setSelectedPlayerKey] = useState<string>();
  const selectedStats = stats.find(({ playerKey }) => playerKey === selectedPlayerKey) ?? stats[0];

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <RankingList entries={ranking} />
      <PlayerStatsPanel
        onSelectPlayer={setSelectedPlayerKey}
        players={ranking}
        stats={selectedStats}
      />
    </div>
  );
}
