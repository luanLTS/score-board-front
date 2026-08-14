import type {
  CreateMatchInput,
  FinishedMatch,
  InProgressMatch,
  Match,
  PendingMatch,
} from "../types";
import { calculateMatchResult } from "./matchResult";

export class MatchLifecycleError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "MatchLifecycleError";
  }
}

type CreatePendingMatchOptions = { id?: string; now?: Date };

const createMatchId = (): string => {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID();
  }
  return `match-${Date.now()}`;
};

const assertValidScore = (score: number): void => {
  if (!Number.isInteger(score) || score < 0) {
    throw new MatchLifecycleError("Match scores must be non-negative integers.");
  }
};

export const createPendingMatch = (
  input: CreateMatchInput,
  options: CreatePendingMatchOptions = {},
): PendingMatch => ({
  id: options.id ?? createMatchId(),
  gameKind: input.gameKind,
  participants: input.participants.map((participant) => ({
    ...participant,
    score: 0,
  })) as PendingMatch["participants"],
  status: "pending",
  createdAt: options.now ?? new Date(),
});

export const startMatch = (match: Match, now: Date = new Date()): InProgressMatch => {
  if (match.status !== "pending") {
    throw new MatchLifecycleError("Only a pending match can be started.");
  }
  return { ...match, status: "in_progress", startedAt: now };
};

export const updateMatchScores = (
  match: Match,
  scores: readonly [number, number],
): InProgressMatch => {
  if (match.status !== "in_progress") {
    throw new MatchLifecycleError("Scores can only be changed during a match.");
  }
  scores.forEach(assertValidScore);
  return {
    ...match,
    participants: match.participants.map((participant, index) => ({
      ...participant,
      score: scores[index],
    })) as InProgressMatch["participants"],
  };
};

export const finishMatch = (
  match: Match,
  now: Date = new Date(),
): FinishedMatch => {
  if (match.status !== "in_progress") {
    throw new MatchLifecycleError("Only a match in progress can be finished.");
  }
  const result = calculateMatchResult(match.participants);
  return {
    ...match,
    status: "finished",
    finishedAt: now,
    result,
    winnerId: result.type === "winner" ? result.winnerId : undefined,
  };
};
