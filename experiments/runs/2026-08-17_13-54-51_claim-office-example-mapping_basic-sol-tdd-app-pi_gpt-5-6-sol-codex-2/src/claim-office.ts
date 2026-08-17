export interface Item {
  type: string;
  material?: string;
  enchantment?: number;
  cursed?: boolean;
}

export interface QuoteStep { op: "quote"; items: Item[] }
export interface Damage { itemType: string; amount: number }
export interface ClaimStep {
  op: "claim";
  policy: number;
  incident: { cause: string; damages: Damage[] };
}
export interface Scenario {
  customer: { yearsWithMHPCO: number };
  steps: Array<QuoteStep | ClaimStep>;
}
export type Result = { premium: number } | { payout: number; remainingCap: number };

const PROCESSING_FEE = 5;
const INITIAL_ASSESSMENT_RATE = 0.1;
const CURSE_SURCHARGE_RATE = 0.5;
const ENCHANTMENT_SURCHARGE_RATE = 0.3;
const HIGH_ENCHANTMENT_LEVEL = 5;
const LOYALTY_RATE = 0.2;
const LOYALTY_YEARS = 2;
const FOLLOW_UP_DISCOUNT_RATE = 0.15;
const DEDUCTIBLE = 100;
const REDUCED_REIMBURSEMENT_LEVEL = 8;
const REDUCED_REIMBURSEMENT_RATE = 0.5;
const CAP_MULTIPLIER = 2;
const COMPONENT_BLOCK_SIZE = 3;
const COMPONENT_BLOCK_PREMIUM = 60;
const COMPONENT_TYPES = ["rune", "moonstone"];
const BASE_PREMIUM: Record<string, number> = {
  sword: 100,
  amulet: 60,
  staff: 80,
  potion: 40,
  rune: 25,
  moonstone: 25,
};
const INSURANCE_VALUE: Record<string, number> = {
  sword: 1000,
  amulet: 600,
  staff: 800,
  potion: 400,
  rune: 250,
  moonstone: 250,
};

interface Policy { items: Item[]; remainingCap: number }

function componentPremium(type: string, items: Item[]): number {
  const count = items.filter((item) => item.type === type).length;
  return count === COMPONENT_BLOCK_SIZE ? COMPONENT_BLOCK_PREMIUM : count * BASE_PREMIUM[type];
}

function policyBasePremium(items: Item[]): number {
  const mainItems = items.filter(({ type }) => !COMPONENT_TYPES.includes(type));
  const mainPremium = mainItems.reduce((total, item) => total + BASE_PREMIUM[item.type], 0);
  return mainPremium + COMPONENT_TYPES.reduce((total, type) => total + componentPremium(type, items), 0);
}

function itemRiskSurcharge(item: Item): number {
  const curseRate = item.cursed ? CURSE_SURCHARGE_RATE : 0;
  const enchantmentRate = item.enchantment !== undefined && item.enchantment >= HIGH_ENCHANTMENT_LEVEL
    ? ENCHANTMENT_SURCHARGE_RATE
    : 0;
  return BASE_PREMIUM[item.type] * (curseRate + enchantmentRate);
}

function quotePremium(items: Item[], yearsWithMHPCO: number, isFollowUp: boolean): number {
  const base = policyBasePremium(items);
  const riskSurcharge = items.reduce((total, item) => total + itemRiskSurcharge(item), 0);
  const loyaltyDiscount = yearsWithMHPCO >= LOYALTY_YEARS ? base * LOYALTY_RATE : 0;
  const followUpDiscount = isFollowUp ? base * FOLLOW_UP_DISCOUNT_RATE : 0;
  return Math.ceil(
    base + riskSurcharge + base * INITIAL_ASSESSMENT_RATE - loyaltyDiscount - followUpDiscount + PROCESSING_FEE,
  );
}

function isKnownType(type: string): boolean {
  return Object.hasOwn(BASE_PREMIUM, type);
}

function validateQuote(items: Item[]): void {
  const unknown = items.find(({ type }) => !isKnownType(type));
  if (unknown) throw new Error(`Unknown item type: ${unknown.type}`);
}

function validateClaim(policy: Policy | undefined, damages: Damage[]): asserts policy is Policy {
  if (!policy) throw new Error("Claim policy must reference an earlier quote");
  const remainingTypes = policy.items.map(({ type }) => type);
  damages.forEach((damage) => {
    if (damage.amount < 0) throw new Error("Damage amount cannot be negative");
    const coveredIndex = remainingTypes.indexOf(damage.itemType);
    if (!isKnownType(damage.itemType) || coveredIndex < 0) throw new Error(`Item is not covered: ${damage.itemType}`);
    remainingTypes.splice(coveredIndex, 1);
  });
}

function createPolicy(items: Item[]): Policy {
  const insuranceSum = items.reduce((total, item) => total + INSURANCE_VALUE[item.type], 0);
  return { items, remainingCap: insuranceSum * CAP_MULTIPLIER };
}

function reimbursementRate(item: Item): number {
  return item.enchantment !== undefined && item.enchantment >= REDUCED_REIMBURSEMENT_LEVEL
    ? REDUCED_REIMBURSEMENT_RATE
    : 1;
}

function desiredDamagePayout(policy: Policy, damage: Damage): number {
  const insuredItem = policy.items.find(({ type }) => type === damage.itemType)!;
  return Math.max(0, damage.amount * reimbursementRate(insuredItem) - DEDUCTIBLE);
}

function settleClaim(policy: Policy, step: ClaimStep): Result {
  const desiredPayout = step.incident.damages.reduce(
    (total, damage) => total + desiredDamagePayout(policy, damage),
    0,
  );
  const payout = Math.floor(Math.min(desiredPayout, policy.remainingCap));
  policy.remainingCap -= payout;
  return { payout, remainingCap: policy.remainingCap };
}

export function processScenario(scenario: Scenario): { results: Result[] } {
  const results: Result[] = [];
  const policies = new Map<number, Policy>();
  let quoteCount = 0;
  scenario.steps.forEach((step, index) => {
    if (step.op === "quote") {
      validateQuote(step.items);
      results.push({ premium: quotePremium(step.items, scenario.customer.yearsWithMHPCO, quoteCount > 0) });
      policies.set(index, createPolicy(step.items));
      quoteCount += 1;
    } else {
      const policy = policies.get(step.policy);
      validateClaim(policy, step.incident.damages);
      results.push(settleClaim(policy, step));
    }
  });
  return { results };
}
