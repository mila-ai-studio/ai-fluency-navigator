export type ComponentId =
  | "goal_context"
  | "iteration_collaboration"
  | "judgment_verification"
  | "workflow_reuse"
  | "tools_steps";

export type LevelId =
  | "curious_beginner"
  | "practical_user"
  | "workflow_builder"
  | "ai_collaborator"
  | "ai_systems_thinker";

export interface ProductContent {
  name: string;
  language: string;
  version: string;
  questionCount: number;
  estimatedTime: string;
  privacyNote: string;
}

export interface DiagnosticComponent {
  id: ComponentId;
  name: string;
  ukrainianWorkingName: string;
  measures: string;
}

export interface AnswerOption {
  id: string;
  text: string;
  score: 1 | 2 | 3 | 4;
  behavior: string;
}

export interface DiagnosticQuestion {
  id: string;
  componentId: ComponentId;
  displayOrder: number;
  type: string;
  text: string;
  options: AnswerOption[];
}

export interface LevelDefinition {
  id: LevelId;
  name: string;
  minScore: number;
  maxScore: number;
  visualLevel: 1 | 2 | 3 | 4 | 5;
}

export interface ComponentResultContent {
  levelDescriptions: Record<LevelId, string>;
  traps: Record<LevelId, string>;
  strengthPhrase: string;
  growthPhrase: string;
  exercise: {
    title: string;
    duration: string;
    instructions: string[];
  };
  basePrompt: string;
}

export interface BalancedProfileRule {
  scoreRange: [number, number];
  growthArea: ComponentId;
  summary: string;
}

export interface DiagnosticContent {
  product: ProductContent;
  components: DiagnosticComponent[];
  questions: DiagnosticQuestion[];
  levels: LevelDefinition[];
  componentContent: Record<ComponentId, ComponentResultContent>;
  growthLevelIntros: Record<LevelId, string>;
  resultLogic: {
    componentOrder: ComponentId[];
    strongestTieOrder: ComponentId[];
    growthTiePriority: ComponentId[];
    balancedProfiles: {
      low: BalancedProfileRule;
      medium: BalancedProfileRule;
      high: BalancedProfileRule;
    };
    summaryTemplates: {
      balanced: string;
      clearGap: string;
      standard: string;
    };
  };
}

export type SelectedAnswers = Record<string, string>;
export type ComponentScores = Record<ComponentId, number>;

export interface DiagnosticSession {
  currentQuestionIndex: number;
  selectedOptionByQuestionId: SelectedAnswers;
  optionOrderByQuestionId: Record<string, string[]>;
  completed: boolean;
}

export interface ComponentProfile {
  component: DiagnosticComponent;
  score: number;
  level: LevelDefinition;
  description: string;
}

export interface ProfileSelection {
  strongest: ComponentId[];
  growthArea: ComponentId;
  summary: string;
  gap: number;
  isAllEqual: boolean;
  summaryTemplate: "balanced" | "clearGap" | "standard" | "special";
}
