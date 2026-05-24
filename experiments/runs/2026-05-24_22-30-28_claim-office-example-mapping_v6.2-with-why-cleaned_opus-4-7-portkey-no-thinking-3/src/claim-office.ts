export interface Customer {
  yearsWithMHPCO: number;
}

export interface Item {
  type: string;
  material?: string;
  enchantment?: number;
  cursed?: boolean;
}

export interface QuoteStep {
  op: "quote";
  items: Item[];
}

export interface Damage {
  itemType: string;
  amount: number;
}

export interface Incident {
  cause: string;
  damages: Damage[];
}

export interface ClaimStep {
  op: "claim";
  policy: number;
  incident: Incident;
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

const BASE_PREMIUMS: Record<string, number> = {
  sword: 100,
  amulet: 60,
  staff: 80,
  potion: 40,
  rune: 25,
};

const basePremiumFor = (item: Item): number => BASE_PREMIUMS[item.type] ?? 0;

const RUNE_BLOCK_SIZE = 3;
const RUNE_BLOCK_DISCOUNT = 15;

const runeBlockDiscount = (items: Item[]): number => {
  const runeCount = items.filter((i) => i.type === "rune").length;
  return runeCount === RUNE_BLOCK_SIZE ? RUNE_BLOCK_DISCOUNT : 0;
};

const sumOfBasePremiums = (items: Item[]): number =>
  items.reduce((sum, item) => sum + basePremiumFor(item), 0);

const policyBasePremium = (items: Item[]): number =>
  sumOfBasePremiums(items) - runeBlockDiscount(items);

const quotePremium = (items: Item[]): number => {
  const base = policyBasePremium(items);
  const firstInsuranceSurcharge = base * FIRST_INSURANCE_SURCHARGE_RATE;
  return base + firstInsuranceSurcharge + PROCESSING_FEE;
};

const claimPayout = (_step: ClaimStep): StepResult => ({
  payout: 0,
  remainingCap: 0,
});

const runStep = (step: Step): StepResult =>
  step.op === "quote"
    ? { premium: quotePremium(step.items) }
    : claimPayout(step);

export const runScenario = (scenario: Scenario): ScenarioResult => ({
  results: scenario.steps.map(runStep),
});
