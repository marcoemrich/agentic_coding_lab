export interface Scenario {
  customer: { yearsWithMHPCO: number };
  steps: Array<{ op: string; items?: Item[]; policy?: number; incident?: Incident }>;
}

export interface Item {
  type: string;
  material?: string;
  enchantment?: number;
  cursed?: boolean;
}

export interface Incident {
  cause: string;
  damages: Array<{ itemType: string; amount: number }>;
}

const PROCESSING_FEE = 5;
const FIRST_INSURANCE_RATE = 0.1;
const CURSE_RATE = 0.5;
const LOYALTY_RATE = 0.2;
const LOYALTY_YEARS = 2;
const HIGH_ENCHANTMENT = 5;
const ENCHANTMENT_RATE = 0.3;
const FOLLOW_UP_RATE = 0.15;
const DEDUCTIBLE = 100;
const CLAIM_ENCHANTMENT = 8;
const ENCHANTED_REIMBURSEMENT_RATE = 0.5;
const CAP_MULTIPLIER = 2;
const INSURANCE_VALUE: Record<string, number> = {
  sword: 1000,
  amulet: 600,
  staff: 800,
  potion: 400,
  rune: 250,
  moonstone: 250,
};

interface Policy {
  items: Item[];
  remainingCap: number;
}
const COMPONENT_PREMIUM = 25;
const BASE_PREMIUM: Record<string, number> = {
  sword: 100,
  amulet: 60,
  staff: 80,
  potion: 40,
  rune: COMPONENT_PREMIUM,
  moonstone: COMPONENT_PREMIUM,
};

const BLOCK_SIZE = 3;
const BLOCK_DISCOUNT = 15;

function quote(items: Item[], yearsWithMHPCO: number, isFollowUp: boolean): number {
  const counts = items.reduce<Record<string, number>>((result, item) => {
    result[item.type] = (result[item.type] ?? 0) + 1;
    return result;
  }, {});
  const regularBase = items.reduce((total, item) => total + (BASE_PREMIUM[item.type] ?? 0), 0);
  const blockDiscount = Object.entries(counts)
    .filter(([type, count]) => BASE_PREMIUM[type] === COMPONENT_PREMIUM && count === BLOCK_SIZE)
    .length * BLOCK_DISCOUNT;
  const base = regularBase - blockDiscount;
  const curseSurcharge = items.reduce(
    (total, item) => total + (item.cursed ? (BASE_PREMIUM[item.type] ?? 0) * CURSE_RATE : 0),
    0,
  );
  const enchantmentSurcharge = items.reduce(
    (total, item) => total + ((item.enchantment ?? 0) >= HIGH_ENCHANTMENT ? (BASE_PREMIUM[item.type] ?? 0) * ENCHANTMENT_RATE : 0),
    0,
  );
  const loyaltyDiscount = yearsWithMHPCO >= LOYALTY_YEARS ? base * LOYALTY_RATE : 0;
  const followUpDiscount = isFollowUp ? base * FOLLOW_UP_RATE : 0;
  return Math.ceil(base + curseSurcharge + enchantmentSurcharge + base * FIRST_INSURANCE_RATE - loyaltyDiscount - followUpDiscount + PROCESSING_FEE);
}

function insuranceSum(items: Item[]): number {
  return items.reduce((total, item) => total + (INSURANCE_VALUE[item.type] ?? 0), 0);
}

function validateItems(items: Item[]): void {
  const unknown = items.find((item) => BASE_PREMIUM[item.type] === undefined);
  if (unknown) throw new Error(`Unknown item type: ${unknown.type}`);
}

function validateDamageCounts(policy: Policy, incident: Incident): void {
  const available = policy.items.reduce<Record<string, number>>((counts, item) => {
    counts[item.type] = (counts[item.type] ?? 0) + 1;
    return counts;
  }, {});
  const damaged: Record<string, number> = {};
  incident.damages.forEach((damage) => {
    if (damage.amount < 0) throw new Error(`Damage amount cannot be negative: ${String(damage.amount)}`);
    damaged[damage.itemType] = (damaged[damage.itemType] ?? 0) + 1;
    if (damaged[damage.itemType] > (available[damage.itemType] ?? 0)) throw new Error("Damage item is not covered by policy");
  });
}

function claim(policy: Policy, incident: Incident): Record<string, number> {
  validateDamageCounts(policy, incident);
  const desired = incident.damages.reduce((total, damage) => {
    const item = policy.items.find((candidate) => candidate.type === damage.itemType);
    const rate = (item?.enchantment ?? 0) >= CLAIM_ENCHANTMENT ? ENCHANTED_REIMBURSEMENT_RATE : 1;
    return total + Math.max(0, damage.amount * rate - DEDUCTIBLE);
  }, 0);
  const payout = Math.floor(Math.min(desired, policy.remainingCap));
  policy.remainingCap -= payout;
  return { payout, remainingCap: policy.remainingCap };
}

export function processScenario(scenario: Scenario): { results: Array<Record<string, number>> } {
  let quoteCount = 0;
  const policies = new Map<number, Policy>();
  const results = scenario.steps.map((step, index) => {
    if (step.op === "claim") return claim(policies.get(step.policy ?? -1)!, step.incident!);
    const items = step.items ?? [];
    validateItems(items);
    const premium = quote(items, scenario.customer.yearsWithMHPCO, quoteCount > 0);
    policies.set(index, { items, remainingCap: insuranceSum(items) * CAP_MULTIPLIER });
    quoteCount += 1;
    return { premium };
  });
  return { results };
}
