export interface Customer {
  yearsWithMHPCO: number;
}

export interface Item {
  type: string;
  material: string;
  enchantment: number;
  cursed: boolean;
}

export interface QuoteStep {
  op: "quote";
  items: Item[];
}

export type Step = QuoteStep;

export interface Scenario {
  customer: Customer;
  steps: Step[];
}

export interface QuoteResult {
  premium: number;
}

export type StepResult = QuoteResult;

export interface ScenarioResult {
  results: StepResult[];
}

const BASE_PREMIUM_BY_TYPE: Record<string, number> = {
  sword: 100,
  amulet: 60,
  staff: 80,
  potion: 40,
};

const COMPONENT_BASE_PREMIUM = 25;
const PROCESSING_FEE = 5;

const itemBasePremium = (item: Item): number =>
  BASE_PREMIUM_BY_TYPE[item.type] ?? COMPONENT_BASE_PREMIUM;

const quote = (step: QuoteStep): QuoteResult => {
  const itemsBase = step.items.reduce(
    (sum, item) => sum + itemBasePremium(item),
    0,
  );
  // First-insurance surcharge of +10% applied via integer math to avoid float drift.
  const premium = (itemsBase * 110) / 100 + PROCESSING_FEE;
  return { premium: Math.ceil(premium) };
};

export const processScenario = (scenario: Scenario): ScenarioResult => {
  return { results: scenario.steps.map(quote) };
};
