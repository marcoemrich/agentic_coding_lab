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

export type Step =
  | { op: "quote"; items: Item[] }
  | { op: "claim"; policy: number; incident: { cause: string; damages: Damage[] } };

export interface Scenario {
  customer: { yearsWithMHPCO: number };
  steps: Step[];
}

export type Result = { premium: number } | { payout: number; remainingCap: number };

const PROCESSING_FEE = 5;
const DEDUCTIBLE = 100;
const CAP_MULTIPLIER = 2;
const CLAIM_ENCHANTMENT_LEVEL = 8;
const HIGH_ENCHANTMENT_REIMBURSEMENT = 0.5;
const FIRST_INSURANCE_RATE = 0.1;
const CURSE_RATE = 0.5;
const LOYALTY_RATE = 0.2;
const FOLLOW_UP_RATE = 0.15;
const LOYALTY_YEARS = 2;
const HIGH_ENCHANTMENT_LEVEL = 5;
const ENCHANTMENT_RATE = 0.3;
const BLOCK_SIZE = 3;
const BLOCK_PREMIUM = 60;
const ITEM_BASE_PREMIUM: Record<string, number> = {
  sword: 100,
  amulet: 60,
  staff: 80,
  potion: 40,
  rune: 25,
  moonstone: 25,
};
const ITEM_VALUE: Record<string, number> = {
  sword: 1000,
  amulet: 600,
  staff: 800,
  potion: 400,
  rune: 250,
  moonstone: 250,
};
interface Policy { items: Item[]; remainingCap: number }

function createPolicy(items: Item[]): Policy {
  const insuranceSum = items.reduce((total, item) => total + ITEM_VALUE[item.type], 0);
  return { items, remainingCap: insuranceSum * CAP_MULTIPLIER };
}

function desiredPayout(policy: Policy, damages: Damage[]): number {
  const used = new Map<string, number>();
  return damages.reduce((total, damage) => {
    if (damage.amount < 0) throw new Error("Damage amount must not be negative");
    const itemIndex = used.get(damage.itemType) ?? 0;
    const matchingItems = policy.items.filter((item) => item.type === damage.itemType);
    const item = matchingItems[itemIndex];
    if (item === undefined) throw new Error(`Damage item is not covered: ${damage.itemType}`);
    used.set(damage.itemType, itemIndex + 1);
    const rate = (item.enchantment ?? 0) >= CLAIM_ENCHANTMENT_LEVEL ? HIGH_ENCHANTMENT_REIMBURSEMENT : 1;
    return total + Math.max(0, damage.amount * rate - DEDUCTIBLE);
  }, 0);
}

function payClaim(policy: Policy, damages: Damage[]): { payout: number; remainingCap: number } {
  const roundedDesired = Math.floor(desiredPayout(policy, damages));
  const payout = Math.min(roundedDesired, policy.remainingCap);
  policy.remainingCap -= payout;
  return { payout, remainingCap: policy.remainingCap };
}

function componentBlockAdjustment(items: Item[]): number {
  return ["rune", "moonstone"].reduce((adjustment, type) => {
    const count = items.filter((item) => item.type === type).length;
    return count === BLOCK_SIZE
      ? adjustment + BLOCK_PREMIUM - count * ITEM_BASE_PREMIUM[type]
      : adjustment;
  }, 0);
}

function itemSurcharges(items: Item[]): number {
  return items.reduce((total, item) => {
    const base = ITEM_BASE_PREMIUM[item.type];
    const curse = item.cursed ? base * CURSE_RATE : 0;
    const enchantment = (item.enchantment ?? 0) >= HIGH_ENCHANTMENT_LEVEL ? base * ENCHANTMENT_RATE : 0;
    return total + curse + enchantment;
  }, 0);
}

function quotePremium(items: Item[], yearsWithMHPCO: number, isFollowUp: boolean): number {
  const unknown = items.find((item) => ITEM_BASE_PREMIUM[item.type] === undefined);
  if (unknown !== undefined) throw new Error(`Unknown item type: ${unknown.type}`);
  const itemBase = items.reduce((total, item) => total + ITEM_BASE_PREMIUM[item.type], 0);
  const base = itemBase + componentBlockAdjustment(items);
  const loyalty = yearsWithMHPCO >= LOYALTY_YEARS ? base * LOYALTY_RATE : 0;
  const followUp = isFollowUp ? base * FOLLOW_UP_RATE : 0;
  return Math.ceil(base + itemSurcharges(items) + base * FIRST_INSURANCE_RATE - loyalty - followUp + PROCESSING_FEE);
}

export function processScenario(scenario: Scenario): { results: Result[] } {
  let quoteCount = 0;
  const policies = new Map<number, Policy>();
  const results: Result[] = [];
  scenario.steps.forEach((step, index) => {
    if (step.op === "quote") {
      const premium = quotePremium(step.items, scenario.customer.yearsWithMHPCO, quoteCount > 0);
      policies.set(index, createPolicy(step.items));
      quoteCount += 1;
      results.push({ premium });
    } else {
      results.push(payClaim(policies.get(step.policy)!, step.incident.damages));
    }
  });
  return { results };
}
