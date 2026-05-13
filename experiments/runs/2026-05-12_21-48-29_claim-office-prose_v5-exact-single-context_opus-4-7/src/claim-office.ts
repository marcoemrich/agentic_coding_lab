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

const BASE_PREMIUM_BY_TYPE: Record<string, number> = {
  sword: 100,
  amulet: 60,
  staff: 80,
  potion: 40,
  rune: 25,
};

const INSURANCE_SUM_BY_TYPE: Record<string, number> = {
  sword: 1000,
  amulet: 600,
  staff: 800,
  potion: 400,
  rune: 250,
};

const DEDUCTIBLE = 100;
const PAYOUT_CAP_MULTIPLIER = 2;

const COMPONENT_TYPES = new Set(["rune"]);
const COMPONENT_BLOCK_SIZE = 3;
const COMPONENT_BLOCK_PREMIUM = 60;

const FIRST_INSURANCE_SURCHARGE_PERCENT = 10;
const CURSED_SURCHARGE_PERCENT = 50;
const HIGH_ENCHANTMENT_SURCHARGE_PERCENT = 30;
const HIGH_ENCHANTMENT_THRESHOLD = 5;
const LOYALTY_DISCOUNT_PERCENT = 20;
const LOYALTY_YEARS_THRESHOLD = 2;
const SUBSEQUENT_CONTRACT_DISCOUNT_PERCENT = 15;
const PROCESSING_FEE = 5;

const itemsAreOneComponentBlock = (items: Item[]): boolean =>
  items.length === COMPONENT_BLOCK_SIZE &&
  COMPONENT_TYPES.has(items[0].type) &&
  items.every((item) => item.type === items[0].type);

const basePremiumForItems = (items: Item[]): number => {
  if (itemsAreOneComponentBlock(items)) {
    return COMPONENT_BLOCK_PREMIUM;
  }
  return items.reduce(
    (sum, item) => sum + BASE_PREMIUM_BY_TYPE[item.type],
    0,
  );
};

const modifierPercentFor = (
  items: Item[],
  customer: Customer,
  isFirstContract: boolean,
): number => {
  const cursedSurcharge = items.some((item) => item.cursed)
    ? CURSED_SURCHARGE_PERCENT
    : 0;
  const highEnchantmentSurcharge = items.some(
    (item) => item.enchantment >= HIGH_ENCHANTMENT_THRESHOLD,
  )
    ? HIGH_ENCHANTMENT_SURCHARGE_PERCENT
    : 0;
  const loyaltyDiscount =
    customer.yearsWithMHPCO >= LOYALTY_YEARS_THRESHOLD
      ? LOYALTY_DISCOUNT_PERCENT
      : 0;
  const firstOrSubsequentAdjustment = isFirstContract
    ? FIRST_INSURANCE_SURCHARGE_PERCENT
    : -SUBSEQUENT_CONTRACT_DISCOUNT_PERCENT;
  return (
    100 +
    firstOrSubsequentAdjustment +
    cursedSurcharge +
    highEnchantmentSurcharge -
    loyaltyDiscount
  );
};

const computeQuotePremium = (
  step: QuoteStep,
  customer: Customer,
  isFirstContract: boolean,
): QuoteResult => {
  const base = basePremiumForItems(step.items);
  const modifierPercent = modifierPercentFor(
    step.items,
    customer,
    isFirstContract,
  );
  const premium = Math.ceil((base * modifierPercent) / 100) + PROCESSING_FEE;
  return { premium };
};

interface Policy {
  items: Item[];
  remainingCap: number;
}

const DRAGON_MATERIAL = "dragon";
const HIGH_ENCHANTMENT_CLAIM_THRESHOLD = 8;
const HIGH_ENCHANTMENT_REIMBURSEMENT_RATE = 0.5;

const insuranceSumForItems = (items: Item[]): number =>
  items.reduce((sum, item) => sum + INSURANCE_SUM_BY_TYPE[item.type], 0);

const reimbursableAmountForDamage = (
  damage: Damage,
  policy: Policy,
): number => {
  const item = policy.items.find((i) => i.type === damage.itemType)!;
  if (item.material === DRAGON_MATERIAL) {
    return damage.amount;
  }
  const rate =
    item.enchantment >= HIGH_ENCHANTMENT_CLAIM_THRESHOLD
      ? HIGH_ENCHANTMENT_REIMBURSEMENT_RATE
      : 1;
  return damage.amount * rate - DEDUCTIBLE;
};

const processClaim = (
  step: ClaimStep,
  policies: Policy[],
): ClaimResult => {
  const policy = policies[step.policy];
  const reimbursable = step.incident.damages.reduce(
    (sum, damage) => sum + reimbursableAmountForDamage(damage, policy),
    0,
  );
  const payout = Math.min(reimbursable, policy.remainingCap);
  policy.remainingCap -= payout;
  return { payout, remainingCap: policy.remainingCap };
};

export const runScenario = (scenario: Scenario): ScenarioResult => {
  const policies: Policy[] = [];
  let quoteCount = 0;
  const results = scenario.steps.map((step): StepResult => {
    if (step.op === "quote") {
      const isFirstContract = quoteCount === 0;
      quoteCount += 1;
      policies.push({
        items: step.items,
        remainingCap:
          insuranceSumForItems(step.items) * PAYOUT_CAP_MULTIPLIER,
      });
      return computeQuotePremium(step, scenario.customer, isFirstContract);
    }
    return processClaim(step, policies);
  });
  return { results };
};
