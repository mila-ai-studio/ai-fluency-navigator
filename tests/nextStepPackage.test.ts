import { describe, expect, it } from "vitest";
import { diagnosticContent } from "../src/data/diagnostic";
import { buildNextStepPackage } from "../src/logic/nextStepPackage";
import type { ComponentId, LevelId } from "../src/types/diagnostic";

function packageFor(
  growthAreaId: ComponentId,
  strongestCapabilities: string[],
  levelId: LevelId = "practical_user",
) {
  const growthArea = diagnosticContent.components.find(({ id }) => id === growthAreaId);
  if (!growthArea) throw new Error(`Missing component: ${growthAreaId}`);
  const content = diagnosticContent.componentContent[growthAreaId];

  return {
    content,
    growthArea,
    text: buildNextStepPackage({
      strongestCapabilities,
      growthArea: growthArea.name,
      typicalTrap: content.traps[levelId],
      exerciseTitle: content.exercise.title,
      estimatedTime: content.exercise.duration,
      exerciseSteps: content.exercise.instructions,
      aiInstruction: content.basePrompt,
    }),
  };
}

describe("personalized next-step package", () => {
  it("contains the complete dynamic result and exercise", () => {
    const strongest = ["Goal & Context", "Tools & Steps"];
    const { content, growthArea, text } = packageFor(
      "judgment_verification",
      strongest,
    );

    expect(text).toContain("AI Fluency Navigator — My next step");
    expect(text).toContain(strongest.join(", "));
    expect(text).toContain(growthArea.name);
    expect(text).toContain(content.traps.practical_user);
    expect(text).toContain(content.exercise.title);
    expect(text).toContain(content.exercise.duration);
    content.exercise.instructions.forEach((step, index) => {
      expect(text).toContain(`${index + 1}. ${step}`);
    });
    expect(text).toContain(content.basePrompt);
  });

  it("is self-contained for a completely new AI conversation", () => {
    const forbiddenHiddenContext = [
      "improve the previous result",
      "continue the task",
      "use the information above",
      "turn this successful ai task",
      "help me verify this answer",
    ];

    for (const component of diagnosticContent.components) {
      const { content, text } = packageFor(component.id, ["Goal & Context"]);

      expect(content.basePrompt.toLowerCase()).toContain("first ask me");
      expect(text).toContain(
        "Start by asking me for the specific task, text, result, or context you need.",
      );
      expect(text).toContain("Do not assume details I have not provided.");
      forbiddenHiddenContext.forEach((phrase) => {
        expect(text.toLowerCase()).not.toContain(phrase);
      });
    }
  });

  it("generates different packages for different personalized results", () => {
    const verificationPackage = packageFor(
      "judgment_verification",
      ["Goal & Context"],
    ).text;
    const reusePackage = packageFor(
      "workflow_reuse",
      ["Iteration & Collaboration"],
    ).text;

    expect(verificationPackage).not.toBe(reusePackage);
    expect(verificationPackage).toContain("Judgment & Verification");
    expect(reusePackage).toContain("Workflow & Reuse");
    expect(verificationPackage).toContain("Goal & Context");
    expect(reusePackage).toContain("Iteration & Collaboration");
  });
});
