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

export interface QuoteResult {
  premium: number;
}

export interface ClaimResult {
  payout: number;
  remainingCap: number;
}

export type StepResult = QuoteResult | ClaimResult;

export interface ScenarioResult {
  results: StepResult[];
}

const PROCESSING_FEE_GOLD = 5;
const FIRST_INSURANCE_SURCHARGE_RATE = 0.1;

const BASE_PREMIUM_BY_TYPE: Record<string, number> = {
  sword: 100,
  amulet: 60,
  staff: 80,
  potion: 40,
  rune: 25,
};

const COMPONENT_TYPES = new Set(["rune", "moonstone"]);
const BLOCK_SIZE = 3;
const BLOCK_BASE_PREMIUM = 60;

const basePremiumOf = (type: string): number => BASE_PREMIUM_BY_TYPE[type];

const isComponent = (item: Item): boolean => COMPONENT_TYPES.has(item.type);

const countByType = (items: Item[]): Map<string, number> =>
  items.reduce(
    (counts, item) => counts.set(item.type, (counts.get(item.type) ?? 0) + 1),
    new Map<string, number>(),
  );

const groupPremium = (type: string, count: number): number =>
  count === BLOCK_SIZE ? BLOCK_BASE_PREMIUM : count * basePremiumOf(type);

const componentBasePremium = (items: Item[]): number =>
  [...countByType(items.filter(isComponent))].reduce(
    (sum, [type, count]) => sum + groupPremium(type, count),
    0,
  );

const mainItemsBasePremium = (items: Item[]): number =>
  items
    .filter((item) => !isComponent(item))
    .reduce((sum, item) => sum + basePremiumOf(item.type), 0);

const totalBasePremium = (items: Item[]): number =>
  mainItemsBasePremium(items) + componentBasePremium(items);

const withFirstInsuranceSurcharge = (premium: number): number =>
  premium + premium * FIRST_INSURANCE_SURCHARGE_RATE;

const quotePremium = (items: Item[]): number =>
  Math.ceil(withFirstInsuranceSurcharge(totalBasePremium(items)) + PROCESSING_FEE_GOLD);

const runStep = (step: Step): StepResult => {
  if (step.op === "quote") return { premium: quotePremium(step.items) };
  return { payout: 0, remainingCap: 0 };
};

export const runScenario = (scenario: Scenario): ScenarioResult => ({
  results: scenario.steps.map(runStep),
});
