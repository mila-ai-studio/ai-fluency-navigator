import { diagnosticContent } from "../data/diagnostic";
import type {
  ComponentId,
  ComponentScores,
  DiagnosticContent,
  ProfileSelection,
} from "../types/diagnostic";

function componentName(componentId: ComponentId, data: DiagnosticContent): string {
  const component = data.components.find((item) => item.id === componentId);
  if (!component) throw new Error(`Missing component: ${componentId}`);
  return component.name;
}

function fillSummaryTemplate(
  template: string,
  strongest: ComponentId,
  growthArea: ComponentId,
  data: DiagnosticContent,
): string {
  return template
    .replace("{strongest}", componentName(strongest, data))
    .replace("{growth}", componentName(growthArea, data));
}

export function selectProfile(
  scores: ComponentScores,
  data: DiagnosticContent = diagnosticContent,
): ProfileSelection {
  const orderedIds = data.resultLogic.componentOrder;
  const values = orderedIds.map((id) => scores[id]);
  if (values.some((value) => !Number.isInteger(value) || value < 2 || value > 8)) {
    throw new Error("Profile contains an invalid component score.");
  }

  const maximum = Math.max(...values);
  const minimum = Math.min(...values);
  const gap = maximum - minimum;
  const isAllEqual = maximum === minimum;

  const strongest = data.resultLogic.strongestTieOrder
    .filter((id) => scores[id] === maximum)
    .slice(0, 2);

  if (isAllEqual) {
    const specialRule = Object.values(data.resultLogic.balancedProfiles).find(
      (rule) => minimum >= rule.scoreRange[0] && minimum <= rule.scoreRange[1],
    );
    if (!specialRule) throw new Error("Missing balanced profile rule.");
    return {
      strongest,
      growthArea: specialRule.growthArea,
      summary: specialRule.summary,
      gap,
      isAllEqual,
      summaryTemplate: "special",
    };
  }

  const growthArea = data.resultLogic.growthTiePriority.find(
    (id) => scores[id] === minimum,
  );
  if (!growthArea || !strongest[0]) {
    throw new Error("Unable to select result profile.");
  }

  const summaryTemplate = gap <= 1 ? "balanced" : gap >= 3 ? "clearGap" : "standard";
  const summary = fillSummaryTemplate(
    data.resultLogic.summaryTemplates[summaryTemplate],
    strongest[0],
    growthArea,
    data,
  );

  return {
    strongest,
    growthArea,
    summary,
    gap,
    isAllEqual,
    summaryTemplate,
  };
}
