export interface Item {
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
  items: Item[];
}

export interface ClaimStep {
  op: "claim";
  policy: number;
  incident: { cause: string; damages: Damage[] };
}

export interface Scenario {
  customer: { yearsWithMHPCO: number };
  steps: Array<QuoteStep | ClaimStep>;
}

export interface QuoteResult {
  premium: number;
}

export interface ClaimResult {
  payout: number;
  remainingCap: number;
}

const PROCESSING_FEE = 5;
const COMPONENT_BLOCK_SIZE = 3;
const COMPONENT_BLOCK_PREMIUM = 60;
const COMPONENT_TYPES = ["rune", "moonstone"];
const CURSE_RATE = 0.5;
const INITIAL_ASSESSMENT_RATE = 0.1;
const LOYALTY_RATE = 0.2;
const LOYALTY_YEARS = 2;
const HIGH_ENCHANTMENT_RATE = 0.3;
const HIGH_ENCHANTMENT_PREMIUM_LEVEL = 5;
const FOLLOW_UP_DISCOUNT_RATE = 0.15;
const DEDUCTIBLE = 100;
const CAP_MULTIPLIER = 2;
const HIGH_ENCHANTMENT_CLAIM_LEVEL = 8;
const HIGH_ENCHANTMENT_REIMBURSEMENT_RATE = 0.5;

const PRICE_LIST: Record<string, { premium: number; value: number }> = {
  sword: { premium: 100, value: 1000 },
  amulet: { premium: 60, value: 600 },
  staff: { premium: 80, value: 800 },
  potion: { premium: 40, value: 400 },
  rune: { premium: 25, value: 250 },
  moonstone: { premium: 25, value: 250 },
};

export function insuranceValue(item: Item): number {
  return PRICE_LIST[item.type].value;
}

function componentPremium(items: Item[], type: string): number {
  const count = items.filter((item) => item.type === type).length;
  return count === COMPONENT_BLOCK_SIZE ? COMPONENT_BLOCK_PREMIUM : count * PRICE_LIST[type].premium;
}

export function basePremium(items: Item[]): number {
  const mainItems = items.filter((item) => !COMPONENT_TYPES.includes(item.type));
  const mainPremium = mainItems.reduce((total, item) => total + PRICE_LIST[item.type].premium, 0);
  return mainPremium + COMPONENT_TYPES.reduce((total, type) => total + componentPremium(items, type), 0);
}

function cursedSurcharge(items: Item[]): number {
  return items.reduce(
    (total, item) => total + (item.cursed ? PRICE_LIST[item.type].premium * CURSE_RATE : 0),
    0,
  );
}

function enchantmentSurcharge(items: Item[]): number {
  return items.reduce(
    (total, item) => total + ((item.enchantment ?? 0) >= HIGH_ENCHANTMENT_PREMIUM_LEVEL
      ? PRICE_LIST[item.type].premium * HIGH_ENCHANTMENT_RATE : 0),
    0,
  );
}

function quotePremium(items: Item[], yearsWithMHPCO: number, isFollowUp: boolean): number {
  const policyBase = basePremium(items);
  const loyaltyDiscount = yearsWithMHPCO >= LOYALTY_YEARS ? policyBase * LOYALTY_RATE : 0;
  const followUpDiscount = isFollowUp ? policyBase * FOLLOW_UP_DISCOUNT_RATE : 0;
  return Math.ceil(
    policyBase + cursedSurcharge(items) + enchantmentSurcharge(items)
      + policyBase * INITIAL_ASSESSMENT_RATE - loyaltyDiscount - followUpDiscount + PROCESSING_FEE,
  );
}

interface Policy {
  items: Item[];
  remainingCap: number;
}

function createPolicy(items: Item[]): Policy {
  const insuranceSum = items.reduce((total, item) => total + insuranceValue(item), 0);
  return { items, remainingCap: insuranceSum * CAP_MULTIPLIER };
}

function damagePayout(item: Item, amount: number): number {
  const reimbursement = (item.enchantment ?? 0) >= HIGH_ENCHANTMENT_CLAIM_LEVEL
    ? amount * HIGH_ENCHANTMENT_REIMBURSEMENT_RATE
    : amount;
  return Math.max(reimbursement - DEDUCTIBLE, 0);
}

function validateDamage(damage: Damage): void {
  if (damage.amount < 0) {
    throw new Error("Damage amount cannot be negative");
  }
}

function settleClaim(policy: Policy, damages: Damage[]): ClaimResult {
  const availableItems = [...policy.items];
  const desiredPayout = damages.reduce((total, damage) => {
    validateDamage(damage);
    const itemIndex = availableItems.findIndex((item) => item.type === damage.itemType);
    const [item] = itemIndex >= 0 ? availableItems.splice(itemIndex, 1) : [];
    if (!item) {
      throw new Error("Damage item is not covered by the policy");
    }
    return total + damagePayout(item, damage.amount);
  }, 0);
  const payout = Math.min(Math.floor(desiredPayout), policy.remainingCap);
  policy.remainingCap -= payout;
  return { payout, remainingCap: policy.remainingCap };
}

export function runScenario(scenario: Scenario): { results: Array<QuoteResult | ClaimResult> } {
  const results: Array<QuoteResult | ClaimResult> = [];
  const policies = new Map<number, Policy>();
  scenario.steps.forEach((step, index) => {
    if (step.op === "quote") {
      const isFollowUp = scenario.steps.slice(0, index).some((priorStep) => priorStep.op === "quote");
      policies.set(index, createPolicy(step.items));
      results.push({ premium: quotePremium(step.items, scenario.customer.yearsWithMHPCO, isFollowUp) });
      return;
    }
    const policy = policies.get(step.policy);
    if (!policy) {
      throw new Error("Claim references an unknown policy");
    }
    results.push(settleClaim(policy, step.incident.damages));
  });
  return { results };
}
