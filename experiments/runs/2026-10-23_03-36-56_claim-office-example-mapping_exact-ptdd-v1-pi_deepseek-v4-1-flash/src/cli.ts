export interface Scenario {
  customer: { yearsWithMHPCO: number };
  steps: Step[];
}

export type Step = QuoteStep | ClaimStep;

export interface QuoteStep {
  op: "quote";
  items: { type: string; material?: string; enchantment?: number; cursed?: boolean }[];
}

export interface ClaimStep {
  op: "claim";
  policy: number;
  incident: {
    cause: string;
    damages: { itemType: string; amount: number }[];
  };
}

export interface ScenarioResults {
  results: Record<string, number>[];
}

export function runScenario(_scenario: Scenario): ScenarioResults {
  return { results: [] };
}
