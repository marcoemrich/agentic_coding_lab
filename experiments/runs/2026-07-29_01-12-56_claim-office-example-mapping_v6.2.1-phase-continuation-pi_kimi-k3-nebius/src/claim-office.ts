export interface QuoteItem {
  type: string;
  material?: string;
  enchantment?: number;
  cursed?: boolean;
}

export interface Damage {
  itemType: string;
  amount: number;
}

export interface QuoteStep {
  op: "quote";
  items: QuoteItem[];
}

export interface ClaimStep {
  op: "claim";
  policy: number;
  incident: { cause: string; damages: Damage[] };
}

export type Step = QuoteStep | ClaimStep;

export interface Scenario {
  customer: { yearsWithMHPCO: number };
  steps: Step[];
}

export type StepResult = { premium: number } | { payout: number; remainingCap: number };

const PROCESSING_FEE = 5;
const BLOCK_SIZE = 3;
const BLOCK_DISCOUNT = 15; // a block of 3 alike components costs 60 instead of 75
const HIGH_ENCHANTMENT_THRESHOLD = 5;
const LOYALTY_MIN_YEARS = 2;

const BASE_PREMIUMS: Record<string, number> = {
  sword: 100,
  amulet: 60,
  staff: 80,
  potion: 40,
  rune: 25,
  moonstone: 25,
};

const COMPONENT_TYPES = ["rune", "moonstone"];

function buildingBlockDiscountFor(items: QuoteItem[]): number {
  const countOfType = (componentType: string) =>
    items.filter((item) => item.type === componentType).length;
  const blockCount = COMPONENT_TYPES.filter(
    (componentType) => countOfType(componentType) === BLOCK_SIZE,
  ).length;
  return blockCount * BLOCK_DISCOUNT;
}

function itemBasePremium(item: QuoteItem): number {
  return BASE_PREMIUMS[item.type];
}

function basePremiumFor(items: QuoteItem[]): number {
  const undiscountedTotal = items.reduce(
    (sum, item) => sum + itemBasePremium(item),
    0,
  );
  return undiscountedTotal - buildingBlockDiscountFor(items);
}

function firstInsuranceFor(basePremium: number): number {
  return basePremium / 10; // fraction kept; only the final premium is rounded
}

function loyaltyDiscountFor(
  basePremium: number,
  yearsWithMHPCO: number,
): number {
  return yearsWithMHPCO >= LOYALTY_MIN_YEARS ? basePremium / 5 : 0;
}

function surchargeFor(
  items: QuoteItem[],
  appliesTo: (item: QuoteItem) => boolean,
  numerator: number,
  denominator: number,
): number {
  return items
    .filter(appliesTo)
    .reduce(
      (sum, item) => sum + (itemBasePremium(item) * numerator) / denominator,
      0,
    );
}

function cursedSurchargeFor(items: QuoteItem[]): number {
  return surchargeFor(items, (item) => !!item.cursed, 1, 2);
}

function highEnchantmentSurchargeFor(items: QuoteItem[]): number {
  return surchargeFor(
    items,
    (item) => (item.enchantment ?? 0) >= HIGH_ENCHANTMENT_THRESHOLD,
    3,
    10,
  );
}

function followUpDiscountFor(
  basePremium: number,
  isFollowUp: boolean,
): number {
  return isFollowUp ? (basePremium * 3) / 20 : 0;
}

function premiumFor(
  items: QuoteItem[],
  yearsWithMHPCO: number,
  isFollowUp: boolean,
): number {
  const basePremium = basePremiumFor(items);
  const unroundedPremium =
    basePremium +
    cursedSurchargeFor(items) +
    highEnchantmentSurchargeFor(items) +
    firstInsuranceFor(basePremium) -
    loyaltyDiscountFor(basePremium, yearsWithMHPCO) -
    followUpDiscountFor(basePremium, isFollowUp);
  return Math.ceil(unroundedPremium) + PROCESSING_FEE;
}

const DEDUCTIBLE = 100;

const INSURANCE_VALUES: Record<string, number> = {
  sword: 1000,
};

interface Policy {
  items: QuoteItem[];
  remainingCap: number;
}

function insuranceSumFor(items: QuoteItem[]): number {
  return items.reduce((sum, item) => sum + INSURANCE_VALUES[item.type], 0);
}

function processClaim(step: ClaimStep, policies: Map<number, Policy>): StepResult {
  const policy = policies.get(step.policy);
  if (!policy) throw new Error(`No policy created at step ${step.policy}`);
  const payout = step.incident.damages.reduce((sum, damage) => {
    const isCovered = policy.items.some(
      (item) => item.type === damage.itemType,
    );
    if (!isCovered)
      throw new Error(`Damaged item type not covered: ${damage.itemType}`);
    return sum + damage.amount - DEDUCTIBLE;
  }, 0);
  policy.remainingCap -= payout;
  return { payout, remainingCap: policy.remainingCap };
}

function processQuote(
  step: QuoteStep,
  stepIndex: number,
  customer: Scenario["customer"],
  policies: Map<number, Policy>,
): StepResult {
  const isFollowUp = policies.size > 0;
  policies.set(stepIndex, {
    items: step.items,
    remainingCap: 2 * insuranceSumFor(step.items),
  });
  return {
    premium: premiumFor(step.items, customer.yearsWithMHPCO, isFollowUp),
  };
}

export function processScenario(scenario: Scenario): { results: StepResult[] } {
  const policies = new Map<number, Policy>();
  return {
    results: scenario.steps.map((step, stepIndex) =>
      step.op === "quote"
        ? processQuote(step, stepIndex, scenario.customer, policies)
        : processClaim(step, policies),
    ),
  };
}
