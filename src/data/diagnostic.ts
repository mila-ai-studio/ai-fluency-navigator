import rawContent from "./content.json";
import type { DiagnosticContent } from "../types/diagnostic";

const EXPECTED_COMPONENTS = 5;
const EXPECTED_QUESTIONS = 10;
const EXPECTED_OPTIONS = 5;

function assertValidContent(value: unknown): asserts value is DiagnosticContent {
  if (!value || typeof value !== "object") {
    throw new Error("Diagnostic content is unavailable.");
  }

  const data = value as DiagnosticContent;
  if (
    !Array.isArray(data.components) ||
    data.components.length !== EXPECTED_COMPONENTS ||
    !Array.isArray(data.questions) ||
    data.questions.length !== EXPECTED_QUESTIONS ||
    !Array.isArray(data.levels) ||
    data.levels.length !== 5
  ) {
    throw new Error("Diagnostic content has an unexpected structure.");
  }

  const componentIds = new Set(data.components.map((component) => component.id));
  const questionIds = new Set<string>();
  const optionIds = new Set<string>();

  for (const question of data.questions) {
    if (
      !componentIds.has(question.componentId) ||
      questionIds.has(question.id) ||
      question.options.length !== EXPECTED_OPTIONS
    ) {
      throw new Error("Diagnostic questions are invalid.");
    }
    questionIds.add(question.id);

    for (const option of question.options) {
      if (optionIds.has(option.id) || option.score < 1 || option.score > 4) {
        throw new Error("Diagnostic options are invalid.");
      }
      optionIds.add(option.id);
    }
  }

  for (const component of data.components) {
    const questionCount = data.questions.filter(
      (question) => question.componentId === component.id,
    ).length;
    if (questionCount !== 2 || !data.componentContent[component.id]) {
      throw new Error("Each dimension must contain exactly two questions.");
    }
  }
}

assertValidContent(rawContent);

export const diagnosticContent = rawContent;
export const orderedQuestions = [...diagnosticContent.questions].sort(
  (a, b) => a.displayOrder - b.displayOrder,
);
