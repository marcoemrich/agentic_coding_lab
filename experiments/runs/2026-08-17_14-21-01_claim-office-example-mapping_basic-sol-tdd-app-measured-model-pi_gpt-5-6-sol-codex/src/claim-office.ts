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
  steps: (QuoteStep | ClaimStep)[];
}

export interface ScenarioResult { results: ({ premium: number } | { payout: number; remainingCap: number })[] }

const PROCESSING_FEE = 5;
const FIRST_INSURANCE_RATE = 0.1;
const CURSE_RATE = 0.5;
const ENCHANTMENT_RATE = 0.3;
const PREMIUM_ENCHANTMENT_LEVEL = 5;
const LOYALTY_RATE = 0.2;
const LOYALTY_YEARS = 2;
const FOLLOW_UP_RATE = 0.15;
const BLOCK_SIZE = 3;
const BLOCK_PREMIUM = 60;
const DEDUCTIBLE = 100;
const CAP_MULTIPLIER = 2;
const CLAIM_ENCHANTMENT_LEVEL = 8;
const HIGH_ENCHANTMENT_REIMBURSEMENT = 0.5;
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

function policyBasePremium(items: Item[]): number {
  const counts = new Map<string, number>();
  for (const item of items) counts.set(item.type, (counts.get(item.type) ?? 0) + 1);
  return [...counts].reduce((total, [type, count]) => {
    const isComponentBlock = count === BLOCK_SIZE && BASE_PREMIUM[type] === BASE_PREMIUM.rune;
    return total + (isComponentBlock ? BLOCK_PREMIUM : count * BASE_PREMIUM[type]);
  }, 0);
}

function itemRiskSurcharge(item: Item): number {
  const curse = item.cursed ? BASE_PREMIUM[item.type] * CURSE_RATE : 0;
  const enchantment = (item.enchantment ?? 0) >= PREMIUM_ENCHANTMENT_LEVEL
    ? BASE_PREMIUM[item.type] * ENCHANTMENT_RATE
    : 0;
  return curse + enchantment;
}

function quotePremium(items: Item[], yearsWithMHPCO: number, isFollowUp: boolean): number {
  const base = policyBasePremium(items);
  const riskSurcharge = items.reduce((total, item) => total + itemRiskSurcharge(item), 0);
  const loyaltyDiscount = yearsWithMHPCO >= LOYALTY_YEARS ? base * LOYALTY_RATE : 0;
  const followUpDiscount = isFollowUp ? base * FOLLOW_UP_RATE : 0;
  return Math.ceil(
    base + riskSurcharge + base * FIRST_INSURANCE_RATE
      - loyaltyDiscount - followUpDiscount + PROCESSING_FEE,
  );
}

function validateItems(items: Item[]): void {
  for (const item of items) {
    if (!(item.type in BASE_PREMIUM)) throw new Error(`Unknown item type: ${item.type}`);
  }
}

function createPolicy(items: Item[]): Policy {
  const insuranceSum = items.reduce((total, item) => total + INSURANCE_VALUE[item.type], 0);
  return { items, remainingCap: insuranceSum * CAP_MULTIPLIER };
}

function damagePayout(item: Item, amount: number): number {
  const reimbursement = (item.enchantment ?? 0) >= CLAIM_ENCHANTMENT_LEVEL
    ? amount * HIGH_ENCHANTMENT_REIMBURSEMENT
    : amount;
  return Math.max(0, reimbursement - DEDUCTIBLE);
}

function validateDamageAmount(amount: number): void {
  if (amount < 0) throw new Error("Damage amount cannot be negative");
}

function settleClaim(step: ClaimStep, policy: Policy): { payout: number; remainingCap: number } {
  const unmatchedItems = [...policy.items];
  const desiredPayout = step.incident.damages.reduce((total, damage) => {
    validateDamageAmount(damage.amount);
    const itemIndex = unmatchedItems.findIndex((covered) => covered.type === damage.itemType);
    if (itemIndex < 0) throw new Error(`Damage to uninsured item type: ${damage.itemType}`);
    const [item] = unmatchedItems.splice(itemIndex, 1);
    return total + damagePayout(item, damage.amount);
  }, 0);
  const payout = Math.floor(Math.min(desiredPayout, policy.remainingCap));
  policy.remainingCap -= payout;
  return { payout, remainingCap: policy.remainingCap };
}

export function runScenario(scenario: Scenario): ScenarioResult {
  let quoteCount = 0;
  const policies = new Map<number, Policy>();
  return {
    results: scenario.steps.map((step, stepIndex) => {
      if (step.op === "quote") {
        validateItems(step.items);
        const premium = quotePremium(step.items, scenario.customer.yearsWithMHPCO, quoteCount > 0);
        policies.set(stepIndex, createPolicy(step.items));
        quoteCount += 1;
        return { premium };
      }
      const policy = policies.get(step.policy);
      if (!policy) throw new Error("Claim references a policy that does not exist");
      return settleClaim(step, policy);
    }),
  };
}
