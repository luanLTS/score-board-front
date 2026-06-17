# Fase 3 Persistencia E Historico Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Persistir o placar atual no navegador e salvar partidas finalizadas em um historico local consultavel.

**Architecture:** A persistencia fica isolada em `src/lib/storage` e em pequenos modulos de persistence por feature. O placar continua sendo a experiencia principal; historico e detalhes entram como area secundaria na tela.

**Tech Stack:** React 19, TypeScript, Vite, Vitest, Testing Library, TailwindCSS.

---

### Task 1: Storage Infrastructure

**Files:**
- Create: `src/lib/storage/types.ts`
- Create: `src/lib/storage/localStorageAdapter.ts`
- Create: `src/lib/storage/keys.ts`
- Create: `src/lib/storage/index.ts`
- Test: `src/lib/storage/localStorageAdapter.test.ts`

- [ ] Write failing tests for empty, valid, invalid, unavailable, save, and clear storage behavior.
- [ ] Run `npm.cmd test -- src/lib/storage/localStorageAdapter.test.ts` and confirm failures are from missing implementation.
- [ ] Implement `StorageAdapter<T>`, versioned keys, and `createLocalStorageAdapter<T>()`.
- [ ] Run the storage test and confirm it passes.

### Task 2: Match And History Domain

**Files:**
- Create: `src/features/matches/types.ts`
- Create: `src/features/history/utils/createFinishedMatch.ts`
- Test: `src/features/history/utils/createFinishedMatch.test.ts`

- [ ] Write failing tests showing a finished match copies player names and scores, uses `generic` by default, creates dates, and does not keep mutable references.
- [ ] Run `npm.cmd test -- src/features/history/utils/createFinishedMatch.test.ts` and confirm failures are from missing implementation.
- [ ] Implement `Match`, `MatchParticipant`, and `createFinishedMatch()`.
- [ ] Run the history utility test and confirm it passes.

### Task 3: Scoreboard Persistence

**Files:**
- Create: `src/features/scoreboard/persistence/scoreboardStorage.ts`
- Test: `src/features/scoreboard/persistence/scoreboardStorage.test.ts`
- Create: `src/features/scoreboard/hooks/usePersistentScoreboard.ts`
- Test: `src/features/scoreboard/hooks/usePersistentScoreboard.test.tsx`

- [ ] Write failing tests for safe scoreboard load, invalid data fallback, save, clear current scoreboard, and hook initialization.
- [ ] Run targeted tests and confirm failures are from missing implementation.
- [ ] Implement parse/save/load helpers and `usePersistentScoreboard()`.
- [ ] Run targeted tests and confirm they pass.

### Task 4: History Storage

**Files:**
- Create: `src/features/history/persistence/historyStorage.ts`
- Test: `src/features/history/persistence/historyStorage.test.ts`

- [ ] Write failing tests for listing empty history, rejecting invalid saved lists, adding a finished match, and preserving newest-first order.
- [ ] Run `npm.cmd test -- src/features/history/persistence/historyStorage.test.ts` and confirm failures are from missing implementation.
- [ ] Implement `createHistoryStorage()`.
- [ ] Run the history storage test and confirm it passes.

### Task 5: History UI Components

**Files:**
- Create: `src/features/history/components/HistoryItem.tsx`
- Create: `src/features/history/components/HistoryList.tsx`
- Create: `src/features/history/components/MatchDetails.tsx`
- Test: `src/features/history/components/HistoryList.test.tsx`
- Test: `src/features/history/components/MatchDetails.test.tsx`

- [ ] Write failing tests for empty state, list rendering, item selection, and finalized match details.
- [ ] Run targeted component tests and confirm failures are from missing implementation.
- [ ] Implement accessible, mobile-friendly history components.
- [ ] Run targeted component tests and confirm they pass.

### Task 6: App Integration

**Files:**
- Modify: `src/features/scoreboard/components/Scoreboard.tsx`
- Modify: `src/features/scoreboard/components/ScoreboardActions.tsx`
- Modify: `src/features/scoreboard/components/Scoreboard.test.tsx`
- Modify: `src/app/App.tsx`
- Test: `src/app/App.test.tsx`

- [ ] Write failing integration tests for persisted scoreboard restore, finishing a match, visible history, details opening, and clearing current scoreboard without deleting history.
- [ ] Run targeted tests and confirm failures are from missing integration.
- [ ] Replace `useScoreboard()` usage with `usePersistentScoreboard()` in the composition point.
- [ ] Add finish and clear-current actions, save completed matches, and render history/details.
- [ ] Run targeted tests and confirm they pass.

### Task 7: Final Verification

**Files:**
- No required file changes.

- [ ] Run `npm.cmd test`.
- [ ] Run `npm.cmd run typecheck`.
- [ ] Run `npm.cmd run build`.
- [ ] Check the phase 3 acceptance criteria against the implemented behavior.
