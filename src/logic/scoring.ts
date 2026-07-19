import { diagnosticContent } from "../data/diagnostic";
import type {
  ComponentProfile,
  ComponentScores,
  DiagnosticContent,
  LevelDefinition,
  SelectedAnswers,
} from "../types/diagnostic";

export function getLevelForScore(
  score: number,
  levels: LevelDefinition[] = diagnosticContent.levels,
): LevelDefinition {
  const level = levels.find(
    (candidate) => score >= candidate.minScore && score <= candidate.maxScore,
  );
  if (!level) {
    throw new Error(`Invalid component score: ${score}`);
  }
  return level;
}

export function isDiagnosticComplete(
  selections: SelectedAnswers,
  data: DiagnosticContent = diagnosticContent,
): boolean {
  return data.questions.every((question) => {
    const selectedId = selections[question.id];
    return question.options.some((option) => option.id === selectedId);
  });
}

export function calculateComponentScores(
  selections: SelectedAnswers,
  data: DiagnosticContent = diagnosticContent,
): ComponentScores {
  const result = {} as ComponentScores;

  for (const component of data.components) {
    const questions = data.questions.filter(
      (question) => question.componentId === component.id,
    );
    if (questions.length !== 2) {
      throw new Error(`Component ${component.id} must have exactly two questions.`);
    }

    result[component.id] = questions.reduce((total, question) => {
      const selectedId = selections[question.id];
      const option = question.options.find((candidate) => candidate.id === selectedId);
      if (!option) {
        throw new Error(`Invalid or missing option for question ${question.id}.`);
      }
      return total + option.score;
    }, 0);
  }

  return result;
}

export function buildComponentProfiles(
  scores: ComponentScores,
  data: DiagnosticContent = diagnosticContent,
): ComponentProfile[] {
  return data.resultLogic.componentOrder.map((componentId) => {
    const component = data.components.find((item) => item.id === componentId);
    if (!component) {
      throw new Error(`Missing component: ${componentId}`);
    }
    const level = getLevelForScore(scores[componentId], data.levels);
    return {
      component,
      score: scores[componentId],
      level,
      description: data.componentContent[componentId].levelDescriptions[level.id],
    };
  });
}
