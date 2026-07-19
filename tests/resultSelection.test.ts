import { describe, expect, it } from "vitest";
import { selectProfile } from "../src/logic/resultSelection";
import type { ComponentScores } from "../src/types/diagnostic";

function scores(overrides: Partial<ComponentScores> = {}): ComponentScores {
  return {
    goal_context: 5,
    iteration_collaboration: 5,
    judgment_verification: 5,
    workflow_reuse: 5,
    tools_steps: 5,
    ...overrides,
  };
}

describe("result selection", () => {
  it("selects a single strongest component", () => {
    const result = selectProfile(scores({ goal_context: 7, workflow_reuse: 4 }));
    expect(result.strongest).toEqual(["goal_context"]);
  });

  it("limits a strongest tie to two using the fixed order", () => {
    const result = selectProfile(
      scores({ goal_context: 7, iteration_collaboration: 7, judgment_verification: 7, tools_steps: 3 }),
    );
    expect(result.strongest).toEqual(["goal_context", "iteration_collaboration"]);
  });

  it("uses the fixed growth priority for a low-score tie", () => {
    const result = selectProfile(
      scores({ goal_context: 6, judgment_verification: 3, iteration_collaboration: 3 }),
    );
    expect(result.growthArea).toBe("judgment_verification");
  });

  it("handles an all-equal low profile", () => {
    const result = selectProfile(scores({
      goal_context: 4,
      iteration_collaboration: 4,
      judgment_verification: 4,
      workflow_reuse: 4,
      tools_steps: 4,
    }));
    expect(result.growthArea).toBe("goal_context");
    expect(result.summary).toMatch(/developing evenly/);
    expect(result.summaryTemplate).toBe("special");
  });

  it("handles an all-equal medium profile", () => {
    const result = selectProfile(scores());
    expect(result.growthArea).toBe("workflow_reuse");
    expect(result.summary).toMatch(/balanced practical foundation/);
  });

  it("handles an all-equal high profile", () => {
    const result = selectProfile(scores({
      goal_context: 8,
      iteration_collaboration: 8,
      judgment_verification: 8,
      workflow_reuse: 8,
      tools_steps: 8,
    }));
    expect(result.growthArea).toBe("tools_steps");
    expect(result.summary).toMatch(/refinement/);
  });

  it("uses the balanced summary template when the gap is 1", () => {
    const result = selectProfile(scores({ goal_context: 6, tools_steps: 5 }));
    expect(result.summaryTemplate).toBe("balanced");
  });

  it("uses the standard summary template when the gap is 2", () => {
    const result = selectProfile(scores({ goal_context: 7, tools_steps: 5 }));
    expect(result.summaryTemplate).toBe("standard");
  });

  it("uses the clear-gap summary template when the gap is at least 3", () => {
    const result = selectProfile(scores({ goal_context: 8, tools_steps: 4 }));
    expect(result.summaryTemplate).toBe("clearGap");
  });
});
