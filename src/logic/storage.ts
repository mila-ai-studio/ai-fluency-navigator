import { diagnosticContent, orderedQuestions } from "../data/diagnostic";
import type { DiagnosticSession } from "../types/diagnostic";
import { isDiagnosticComplete } from "./scoring";
import { shuffle } from "./shuffle";

export const STORAGE_KEY = "ai-fluency-navigator:v1";

export function createSession(random: () => number = Math.random): DiagnosticSession {
  return {
    currentQuestionIndex: 0,
    selectedOptionByQuestionId: {},
    optionOrderByQuestionId: Object.fromEntries(
      orderedQuestions.map((question) => [
        question.id,
        shuffle(
          question.options.map((option) => option.id),
          random,
        ),
      ]),
    ),
    completed: false,
  };
}

function isValidSession(value: unknown): value is DiagnosticSession {
  if (!value || typeof value !== "object") return false;
  const session = value as DiagnosticSession;
  if (
    !Number.isInteger(session.currentQuestionIndex) ||
    session.currentQuestionIndex < 0 ||
    session.currentQuestionIndex >= orderedQuestions.length ||
    !session.selectedOptionByQuestionId ||
    typeof session.selectedOptionByQuestionId !== "object" ||
    !session.optionOrderByQuestionId ||
    typeof session.optionOrderByQuestionId !== "object" ||
    typeof session.completed !== "boolean"
  ) {
    return false;
  }

  for (const question of orderedQuestions) {
    const expectedIds = question.options.map((option) => option.id).sort();
    const storedIds = session.optionOrderByQuestionId[question.id];
    if (
      !Array.isArray(storedIds) ||
      storedIds.length !== expectedIds.length ||
      [...storedIds].sort().some((id, index) => id !== expectedIds[index])
    ) {
      return false;
    }

    const selectedId = session.selectedOptionByQuestionId[question.id];
    if (selectedId && !question.options.some((option) => option.id === selectedId)) {
      return false;
    }
  }

  return !session.completed || isDiagnosticComplete(session.selectedOptionByQuestionId);
}

export function loadSession(): DiagnosticSession | null {
  try {
    const serialized = window.localStorage.getItem(STORAGE_KEY);
    if (!serialized) return null;
    const parsed: unknown = JSON.parse(serialized);
    if (!isValidSession(parsed)) {
      window.localStorage.removeItem(STORAGE_KEY);
      return null;
    }
    return parsed;
  } catch {
    try {
      window.localStorage.removeItem(STORAGE_KEY);
    } catch {
      // Storage can be unavailable in privacy-restricted browsers.
    }
    return null;
  }
}

export function saveSession(session: DiagnosticSession): void {
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(session));
  } catch {
    // The diagnostic remains usable for the current page session.
  }
}

export function clearSession(): void {
  try {
    window.localStorage.removeItem(STORAGE_KEY);
  } catch {
    // Nothing else is required if storage is unavailable.
  }
}

export function hasValidCompletedSession(session: DiagnosticSession | null): boolean {
  return Boolean(
    session?.completed &&
      isDiagnosticComplete(session.selectedOptionByQuestionId, diagnosticContent),
  );
}
