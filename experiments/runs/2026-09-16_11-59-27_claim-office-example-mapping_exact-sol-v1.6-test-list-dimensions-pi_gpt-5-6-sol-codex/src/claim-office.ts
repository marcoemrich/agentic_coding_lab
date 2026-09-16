export interface Scenario {
  customer: { yearsWithMHPCO: number };
  steps: Array<Record<string, unknown>>;
}

export type Result = { premium: number } | { payout: number; remainingCap: number };

const PROCESSING_FEE = 5;
const DEDUCTIBLE = 100;
const CAP_MULTIPLIER = 2;
const SWORD_BASE_PREMIUM = 100;
const SWORD_INSURANCE_VALUE = 1000;
const AMULET_INSURANCE_VALUE = 600;
const STAFF_INSURANCE_VALUE = 800;
const POTION_INSURANCE_VALUE = 400;
const COMPONENT_INSURANCE_VALUE = 250;
const AMULET_BASE_PREMIUM = 60;
const STAFF_BASE_PREMIUM = 80;
const POTION_BASE_PREMIUM = 40;
const COMPONENT_BASE_PREMIUM = 25;
const COMPONENT_BLOCK_SIZE = 3;
const COMPONENT_BLOCK_PREMIUM = 60;
const INITIAL_ASSESSMENT_RATE = 0.1;
const CURSE_SURCHARGE_RATE = 0.5;
const HIGH_ENCHANTMENT_LEVEL = 5;
const CLAIM_ENCHANTMENT_LEVEL = 8;
const ENCHANTED_REIMBURSEMENT_RATE = 0.5;
const HIGH_ENCHANTMENT_RATE = 0.3;
const LOYALTY_YEARS = 2;
const LOYALTY_DISCOUNT_RATE = 0.2;
const FOLLOW_UP_DISCOUNT_RATE = 0.15;
const PREMIUMS: Record<string, number> = {
  sword: SWORD_BASE_PREMIUM,
  amulet: AMULET_BASE_PREMIUM,
  staff: STAFF_BASE_PREMIUM,
  potion: POTION_BASE_PREMIUM,
  rune: COMPONENT_BASE_PREMIUM,
  moonstone: COMPONENT_BASE_PREMIUM,
};
const INSURANCE_VALUES: Record<string, number> = {
  sword: SWORD_INSURANCE_VALUE,
  amulet: AMULET_INSURANCE_VALUE,
  staff: STAFF_INSURANCE_VALUE,
  potion: POTION_INSURANCE_VALUE,
  rune: COMPONENT_INSURANCE_VALUE,
  moonstone: COMPONENT_INSURANCE_VALUE,
};

const COMPONENT_TYPES = ["rune", "moonstone"];

const componentBlockAdjustment = (items: Array<Record<string, unknown>>): number =>
  COMPONENT_TYPES.reduce((adjustment, type) => {
    const count = items.filter((item) => item.type === type).length;
    return count === COMPONENT_BLOCK_SIZE
      ? adjustment + COMPONENT_BLOCK_PREMIUM - count * COMPONENT_BASE_PREMIUM
      : adjustment;
  }, 0);

export const basePremium = (items: Array<Record<string, unknown>>): number =>
  items.reduce((total, item) => total + (PREMIUMS[String(item.type)] ?? 0), 0)
  + componentBlockAdjustment(items);

const initialAssessment = (base: number): number => base * INITIAL_ASSESSMENT_RATE;

const curseSurcharge = (items: Array<Record<string, unknown>>): number =>
  items.reduce((total, item) => item.cursed === true
    ? total + (PREMIUMS[String(item.type)] ?? 0) * CURSE_SURCHARGE_RATE
    : total, 0);

const enchantmentSurcharge = (items: Array<Record<string, unknown>>): number =>
  items.reduce((total, item) => Number(item.enchantment) >= HIGH_ENCHANTMENT_LEVEL
    ? total + (PREMIUMS[String(item.type)] ?? 0) * HIGH_ENCHANTMENT_RATE
    : total, 0);

const loyaltyDiscount = (base: number, years: number): number =>
  years >= LOYALTY_YEARS ? base * LOYALTY_DISCOUNT_RATE : 0;

const followUpDiscount = (base: number, isFollowUp: boolean): number =>
  isFollowUp ? base * FOLLOW_UP_DISCOUNT_RATE : 0;

const validateItems = (items: Array<Record<string, unknown>>): void => {
  const unknown = items.find((item) => PREMIUMS[String(item.type)] === undefined);
  if (unknown !== undefined) {
    throw new Error(`Unknown item type: ${String(unknown.type)}`);
  }
};

const quotePremium = (
  items: Array<Record<string, unknown>>,
  years: number,
  isFollowUp: boolean,
): number => {
  const base = basePremium(items);
  return Math.ceil(base + curseSurcharge(items) + enchantmentSurcharge(items)
    + initialAssessment(base) - loyaltyDiscount(base, years)
    - followUpDiscount(base, isFollowUp) + PROCESSING_FEE);
};

interface Policy {
  items: Array<Record<string, unknown>>;
  remainingCap: number;
}

const createPolicy = (items: Array<Record<string, unknown>>): Policy => ({
  items,
  remainingCap: items.reduce(
    (sum, item) => sum + (INSURANCE_VALUES[String(item.type)] ?? 0),
    0,
  ) * CAP_MULTIPLIER,
});

const damagePayout = (item: Record<string, unknown>, amount: number): number => {
  const reimbursement = Number(item.enchantment) >= CLAIM_ENCHANTMENT_LEVEL
    ? amount * ENCHANTED_REIMBURSEMENT_RATE
    : amount;
  return reimbursement - DEDUCTIBLE;
};

const validateDamageAmount = (damage: Record<string, unknown>): void => {
  if (Number(damage.amount) < 0) {
    throw new Error("Damage amount cannot be negative");
  }
};

const validateDamages = (policy: Policy, damages: Array<Record<string, unknown>>): void => {
  damages.forEach((damage, index) => {
    validateDamageAmount(damage);
    const priorCount = damages.slice(0, index + 1)
      .filter((entry) => entry.itemType === damage.itemType).length;
    const insuredCount = policy.items.filter((item) => item.type === damage.itemType).length;
    if (priorCount > insuredCount) {
      throw new Error(`Damage to ${String(damage.itemType)} exceeds insured items`);
    }
  });
};

const settleClaim = (policy: Policy, damages: Array<Record<string, unknown>>): Result => {
  validateDamages(policy, damages);
  const desired = damages.reduce((sum, damage) => {
    const item = policy.items.find((candidate) => candidate.type === damage.itemType) as Record<string, unknown>;
    return sum + damagePayout(item, Number(damage.amount));
  }, 0);
  const payout = Math.floor(Math.min(desired, policy.remainingCap));
  policy.remainingCap -= payout;
  return { payout, remainingCap: policy.remainingCap };
};

export const processScenario = (scenario: Scenario): { results: Result[] } => {
  const results: Result[] = [];
  const policies = new Map<number, Policy>();
  let quoteCount = 0;
  scenario.steps.forEach((step, index) => {
    if (step.op === "quote") {
      const items = step.items as Array<Record<string, unknown>>;
      validateItems(items);
      results.push({ premium: quotePremium(items, scenario.customer.yearsWithMHPCO, quoteCount > 0) });
      policies.set(index, createPolicy(items));
      quoteCount += 1;
    } else {
      const policy = policies.get(Number(step.policy)) as Policy;
      const incident = step.incident as Record<string, unknown>;
      results.push(settleClaim(policy, incident.damages as Array<Record<string, unknown>>));
    }
  });
  return { results };
};
