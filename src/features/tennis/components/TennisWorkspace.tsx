import { useEffect, useMemo, useRef, useState } from "react";

import { advanceSuperTiebreak } from "../domain/rules/superTiebreak";
import { createSuperTiebreakMatch } from "../matchFactory";
import { createTennisMatchStorage } from "../matchFactory";
import { createTennisHistoryRecord, createTennisHistoryStorage } from "../persistence/tennisHistory";
import type { SuperTiebreakState } from "../domain/types";

import { TennisMatchView } from "./TennisMatchView";
import { TennisMatchSetup } from "./TennisMatchSetup";
import { TennisTournamentWorkspace } from "./TennisTournamentWorkspace";

type TennisWorkspaceProps = {
  onSelect?: (section: "match" | "ranking" | "tournament") => void;
};

export function TennisWorkspace({ onSelect }: TennisWorkspaceProps) {
  const matchStorage = useMemo(() => createTennisMatchStorage(), []);
  const historyStorage = useMemo(() => createTennisHistoryStorage(), []);
  const history = historyStorage.list();
  const restoredMatch = useMemo(() => matchStorage.load(), [matchStorage]);
  const [activeSection, setActiveSection] = useState<"match" | "ranking" | "tournament" | null>(null);
  const [match, setMatch] = useState<SuperTiebreakState | null>(restoredMatch);
  const [participantNames, setParticipantNames] = useState<Record<string, string>>(restoredMatch?.participantNames ?? {});
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
      startedAt: new Date(),
      finishedAt: new Date(),
    }));
  }, [historyStorage, match, participantNames]);
  const selectSection = (section: "match" | "ranking" | "tournament") => {
    setActiveSection(section);
    onSelect?.(section);
  };

  return (
    <section aria-labelledby="tennis-workspace-title" className="space-y-6 rounded-xl border border-zinc-800 bg-zinc-900/60 p-6">
      <header className="space-y-2">
        <p className="text-sm font-medium uppercase text-amber-300">Workspace</p>
        <h1 className="text-3xl font-bold" id="tennis-workspace-title">Tênis</h1>
        <p className="text-sm text-zinc-400">Partidas, ranking e campeonatos de tênis.</p>
      </header>
      <div className="grid gap-3 sm:grid-cols-3">
        <button
          className="rounded-lg border border-zinc-700 bg-zinc-950 px-4 py-4 text-left font-semibold text-zinc-100 transition hover:border-amber-300/70"
          onClick={() => selectSection("match")}
          type="button"
        >
          Partida
        </button>
        <button
          className="rounded-lg border border-zinc-700 bg-zinc-950 px-4 py-4 text-left font-semibold text-zinc-100 transition hover:border-amber-300/70"
          onClick={() => selectSection("ranking")}
          type="button"
        >
          Ranking
        </button>
        <button
          className="rounded-lg border border-zinc-700 bg-zinc-950 px-4 py-4 text-left font-semibold text-zinc-100 transition hover:border-amber-300/70"
          onClick={() => selectSection("tournament")}
          type="button"
        >
          Campeonato
        </button>
      </div>

      {activeSection === "match" ? (
        match ? (
          <div className="space-y-3">
            <TennisMatchView
              match={match}
              participantNames={participantNames}
              onPoint={(participantId) => setMatch(advanceSuperTiebreak(match, participantId))}
            />
            <button
              className="rounded-md border border-zinc-700 px-4 py-2 text-sm font-semibold text-zinc-200"
              onClick={() => setMatch(null)}
              type="button"
            >
              Nova partida
            </button>
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
        )
      ) : null}

      {activeSection === "ranking" ? (
        <section className="rounded-lg border border-zinc-800 bg-zinc-950/60 p-4">
          <h2 className="text-xl font-bold">Ranking geral do tênis</h2>
          <p className="mt-2 text-sm text-zinc-400">O ranking será alimentado pelos campeonatos e partidas finalizadas.</p>
          <h3 className="mt-5 font-semibold">Partidas finalizadas</h3>
          {history.length > 0 ? (
            <ul className="mt-2 space-y-2 text-sm">
              {history.map((record) => (
                <li className="rounded border border-zinc-800 px-3 py-2" key={record.id}>
                  {record.participants[0].name} × {record.participants[1].name}: {record.finalScore[0]} × {record.finalScore[1]}
                </li>
              ))}
            </ul>
          ) : <p className="mt-2 text-sm text-zinc-500">Nenhuma partida finalizada.</p>}
        </section>
      ) : null}

      {activeSection === "tournament" ? (
        <TennisTournamentWorkspace />
      ) : null}
    </section>
  );
}
