export interface Customer {
  yearsWithMHPCO: number;
}

export type QuoteItem = { type: string } & Record<string, unknown>;

export interface QuoteStep {
  op: "quote";
  items: QuoteItem[];
}

export interface ClaimStep {
  op: "claim";
  policy: number;
  incident: {
    cause: string;
    damages: Array<{ itemType: string; amount: number }>;
  };
}

export type Step = QuoteStep | ClaimStep;

export interface Scenario {
  customer: Customer;
  steps: Step[];
}

export type StepResult =
  | { premium: number }
  | { payout: number; remainingCap: number };

export interface ScenarioResult {
  results: StepResult[];
}

const PROCESSING_FEE = 5;
const FIRST_INSURANCE_SURCHARGE_RATE = 0.1;

const BASE_PREMIUM: Record<string, number> = {
  sword: 100,
  amulet: 60,
  staff: 80,
  potion: 40,
  rune: 25,
};

const COMPONENT_TYPES = new Set(["rune", "moonstone"]);
const BLOCK_BASE = 60;

const baseForGroup = (type: string, count: number): number => {
  if (COMPONENT_TYPES.has(type) && count === 3) return BLOCK_BASE;
  return count * (BASE_PREMIUM[type] ?? 0);
};

const countByType = (items: QuoteItem[]): Map<string, number> => {
  const counts = new Map<string, number>();
  for (const item of items) {
    counts.set(item.type, (counts.get(item.type) ?? 0) + 1);
  }
  return counts;
};

const sumBasePremiums = (counts: Map<string, number>): number => {
  let total = 0;
  for (const [type, count] of counts) {
    total += baseForGroup(type, count);
  }
  return total;
};

const quotePremium = (step: QuoteStep): StepResult => {
  const baseTotal = sumBasePremiums(countByType(step.items));
  const firstInsuranceSurcharge = baseTotal * FIRST_INSURANCE_SURCHARGE_RATE;
  return { premium: baseTotal + firstInsuranceSurcharge + PROCESSING_FEE };
};

const processStep = (step: Step): StepResult => {
  if (step.op === "quote") return quotePremium(step);
  return { payout: 0, remainingCap: 0 };
};

export const runScenario = (scenario: Scenario): ScenarioResult => ({
  results: scenario.steps.map(processStep),
});
