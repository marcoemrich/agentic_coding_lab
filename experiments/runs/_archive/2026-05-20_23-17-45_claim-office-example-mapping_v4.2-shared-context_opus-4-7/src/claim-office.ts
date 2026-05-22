const PROCESSING_FEE = 5;
const FIRST_INSURANCE_RATE = 0.1;
const CURSED_SURCHARGE_RATE = 0.5;
const HIGH_ENCHANTMENT_RATE = 0.3;
const HIGH_ENCHANTMENT_THRESHOLD = 5;
const LOYALTY_DISCOUNT_RATE = 0.2;
const LOYALTY_YEARS_THRESHOLD = 2;
const FOLLOW_UP_DISCOUNT_RATE = 0.15;

const BASE_PREMIUM: Record<string, number> = {
  sword: 100,
  amulet: 60,
  staff: 80,
  potion: 40,
  rune: 25,
  moonstone: 25,
};

const INSURANCE_VALUE_MULTIPLIER = 10;

const CLAIM_DEDUCTIBLE = 100;
const CAP_MULTIPLIER = 2;
const HIGH_ENCHANTMENT_CLAIM_THRESHOLD = 8;
const HIGH_ENCHANTMENT_CLAIM_DAMAGE_RATE = 0.5;

const COMPONENT_TYPES = new Set(["rune", "moonstone"]);
const COMPONENT_BLOCK_SIZE = 3;
const COMPONENT_BLOCK_PRICE = 60;

interface Item {
  type: string;
  cursed?: boolean;
  enchantment?: number;
}

interface QuoteStep {
  op: "quote";
  items: Item[];
}

interface ClaimStep {
  op: "claim";
  policy: number;
  incident: { cause: string; damages: { type: string; amount: number }[] };
}

type Step = QuoteStep | ClaimStep;

interface Customer {
  yearsWithMHPCO: number;
}

interface Scenario {
  customer: Customer;
  steps: Step[];
}

function computeClaim(step: ClaimStep, scenario: Scenario): { payout: number; remainingCap: number } {
  const policyStep = scenario.steps[step.policy] as QuoteStep;
  const insuranceSum = (BASE_PREMIUM[policyStep.items[0].type] ?? 0) * INSURANCE_VALUE_MULTIPLIER;
  const cap = insuranceSum * CAP_MULTIPLIER;
  const damageAmount = step.incident.damages[0].amount;
  const insuredItem = policyStep.items[0];
  const effectiveDamage =
    (insuredItem.enchantment ?? 0) >= HIGH_ENCHANTMENT_CLAIM_THRESHOLD
      ? damageAmount * HIGH_ENCHANTMENT_CLAIM_DAMAGE_RATE
      : damageAmount;
  const payout = effectiveDamage - CLAIM_DEDUCTIBLE;
  const remainingCap = cap - payout;
  return { payout, remainingCap };
}

function computeBasePremium(items: Item[]): number {
  const countsByType: Record<string, number> = {};
  for (const item of items) {
    countsByType[item.type] = (countsByType[item.type] ?? 0) + 1;
  }
  let basePremium = 0;
  for (const [type, count] of Object.entries(countsByType)) {
    if (COMPONENT_TYPES.has(type) && count === COMPONENT_BLOCK_SIZE) {
      basePremium += COMPONENT_BLOCK_PRICE;
    } else {
      const perItem = BASE_PREMIUM[type] ?? 0;
      basePremium += perItem * count;
    }
  }
  return basePremium;
}

function computeItemSurcharges(items: Item[]): number {
  let surcharges = 0;
  for (const item of items) {
    const itemBase = BASE_PREMIUM[item.type] ?? 0;
    if (item.cursed) {
      surcharges += itemBase * CURSED_SURCHARGE_RATE;
    }
    if ((item.enchantment ?? 0) >= HIGH_ENCHANTMENT_THRESHOLD) {
      surcharges += itemBase * HIGH_ENCHANTMENT_RATE;
    }
  }
  return surcharges;
}

function computeQuote(
  step: QuoteStep,
  stepIndex: number,
  customer: Customer,
): { premium: number } {
  const basePremium = computeBasePremium(step.items);
  const itemSurcharges = computeItemSurcharges(step.items);
  const firstInsurance = basePremium * FIRST_INSURANCE_RATE;
  const loyaltyDiscount =
    customer.yearsWithMHPCO >= LOYALTY_YEARS_THRESHOLD
      ? basePremium * LOYALTY_DISCOUNT_RATE
      : 0;
  const isFollowUpQuote = stepIndex >= 1;
  const followUpDiscount = isFollowUpQuote ? basePremium * FOLLOW_UP_DISCOUNT_RATE : 0;
  const rawPremium = basePremium + itemSurcharges + firstInsurance - loyaltyDiscount - followUpDiscount + PROCESSING_FEE;
  const premium = Math.ceil(rawPremium);
  return { premium };
}

export function runScenario(input: unknown): unknown {
  const scenario = input as Scenario;
  const results = scenario.steps.map((step, stepIndex) =>
    step.op === "claim" ? computeClaim(step, scenario) : computeQuote(step, stepIndex, scenario.customer),
  );
  return { results };
}
