interface NextStepPackageInput {
  strongestCapabilities: string[];
  growthArea: string;
  typicalTrap: string;
  exerciseTitle: string;
  estimatedTime: string;
  exerciseSteps: string[];
  aiInstruction: string;
}

export function buildNextStepPackage({
  strongestCapabilities,
  growthArea,
  typicalTrap,
  exerciseTitle,
  estimatedTime,
  exerciseSteps,
  aiInstruction,
}: NextStepPackageInput): string {
  const numberedSteps = exerciseSteps.map((step, index) => `${index + 1}. ${step}`);

  return [
    "AI Fluency Navigator — My next step",
    "",
    "My strongest capability:",
    strongestCapabilities.join(", "),
    "",
    "My highest-impact growth area:",
    growthArea,
    "",
    "My typical trap:",
    typicalTrap,
    "",
    "Practice:",
    exerciseTitle,
    "",
    "Estimated time:",
    estimatedTime,
    "",
    "Steps:",
    ...numberedSteps,
    "",
    "Work through this exercise with me:",
    aiInstruction,
    "",
    "Start by asking me for the specific task, text, result, or context you need.",
    "Do not assume details I have not provided.",
    "Keep the process practical and easy to follow.",
  ].join("\n");
}
