import { describe, expect, it } from "vitest";
import { diagnosticContent } from "../src/data/diagnostic";
import {
  calculateComponentScores,
  getLevelForScore,
  isDiagnosticComplete,
} from "../src/logic/scoring";
import type { SelectedAnswers } from "../src/types/diagnostic";

function selectionsByScore(score: 1 | 2 | 3 | 4): SelectedAnswers {
  return Object.fromEntries(
    diagnosticContent.questions.map((question) => {
      const option = question.options.find((candidate) => candidate.score === score) ?? question.options[0];
      return [question.id, option.id];
    }),
  );
}

describe("level mapping", () => {
  it("maps score 2 to Curious Beginner", () => {
    expect(getLevelForScore(2).name).toBe("Curious Beginner");
  });

  it.each([3, 4])("maps score %i to Practical User", (score) => {
    expect(getLevelForScore(score).name).toBe("Practical User");
  });

  it.each([5, 6])("maps score %i to Workflow Builder", (score) => {
    expect(getLevelForScore(score).name).toBe("Workflow Builder");
  });

  it("maps score 7 to AI Collaborator", () => {
    expect(getLevelForScore(7).name).toBe("AI Collaborator");
  });

  it("maps score 8 to AI Systems Thinker", () => {
    expect(getLevelForScore(8).name).toBe("AI Systems Thinker");
  });
});

describe("component scoring", () => {
  it("uses exactly the two selected options in each component", () => {
    const scores = calculateComponentScores(selectionsByScore(1));
    expect(scores).toEqual({
      goal_context: 2,
      iteration_collaboration: 2,
      judgment_verification: 2,
      workflow_reuse: 2,
      tools_steps: 2,
    });
  });

  it("rejects invalid option IDs", () => {
    const selections = selectionsByScore(1);
    selections.goal_context_q1 = "not-a-real-option";
    expect(() => calculateComponentScores(selections)).toThrow(/Invalid or missing option/);
  });

  it("requires every question to be answered before completion", () => {
    const selections = selectionsByScore(1);
    delete selections.tools_steps_q2;
    expect(isDiagnosticComplete(selections)).toBe(false);
    expect(isDiagnosticComplete(selectionsByScore(1))).toBe(true);
  });
});
