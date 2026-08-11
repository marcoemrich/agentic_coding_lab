export interface Customer {
  yearsWithMHPCO: number;
}

export interface QuoteStep {
  op: "quote";
  items: Item[];
}

export interface Item {
  type: string;
  material?: string;
  enchantment?: number;
  cursed?: boolean;
}

export interface ClaimStep {
  op: "claim";
  policy: number;
  incident: Incident;
}

export interface Incident {
  cause: string;
  damages: Damage[];
}

export interface Damage {
  itemType: string;
  amount: number;
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

export interface ScenarioResults {
  results: StepResult[];
}

const PROCESSING_FEE = 5;
const ITEM_BASE_PREMIUM = 100;
const FIRST_INSURANCE_SURCHARGE_PERCENT = 10;

/** All amounts are rounded to whole G in the MHPCO's favour: premiums up. */
const roundUpToWholeG = (amount: number): number => Math.ceil(amount);

const percentOf = (amount: number, percent: number): number =>
  (amount * percent) / 100;

function quotePremium(step: QuoteStep): QuoteResult {
  const policyBase = step.items.length * ITEM_BASE_PREMIUM;
  const firstInsurance = percentOf(policyBase, FIRST_INSURANCE_SURCHARGE_PERCENT);

  return {
    premium: roundUpToWholeG(policyBase + firstInsurance + PROCESSING_FEE),
  };
}

export function runScenario(scenario: Scenario): ScenarioResults {
  return { results: scenario.steps.map((step) => quotePremium(step as QuoteStep)) };
}
