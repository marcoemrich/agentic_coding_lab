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

export interface Result {
  premium?: number;
  payout?: number;
  remainingCap?: number;
}

const PROCESSING_FEE = 5;
const SWORD_BASE_PREMIUM = 100;
const AMULET_BASE_PREMIUM = 60;
const STAFF_BASE_PREMIUM = 80;
const POTION_BASE_PREMIUM = 40;
const COMPONENT_BASE_PREMIUM = 25;
const COMPONENT_BLOCK_SIZE = 3;
const COMPONENT_BLOCK_PREMIUM = 60;
const COMPONENT_TYPES = ["rune", "moonstone"];
const BASE_PREMIUM_BY_TYPE: Record<string, number> = {
  sword: SWORD_BASE_PREMIUM,
  amulet: AMULET_BASE_PREMIUM,
  staff: STAFF_BASE_PREMIUM,
  potion: POTION_BASE_PREMIUM,
  rune: COMPONENT_BASE_PREMIUM,
  moonstone: COMPONENT_BASE_PREMIUM,
};
const INITIAL_ASSESSMENT_RATE = 0.1;
const CURSE_RATE = 0.5;
const HIGH_ENCHANTMENT_LEVEL = 5;
const ENCHANTMENT_RATE = 0.3;
const LOYALTY_YEARS = 2;
const LOYALTY_RATE = 0.2;
const FOLLOW_UP_RATE = 0.15;
const DEDUCTIBLE = 100;
const CLAIM_ENCHANTMENT_LEVEL = 8;
const PARTIAL_REIMBURSEMENT_RATE = 0.5;
const CAP_MULTIPLIER = 2;

const SWORD_INSURANCE_VALUE = 1000;
const AMULET_INSURANCE_VALUE = 600;
const STAFF_INSURANCE_VALUE = 800;
const POTION_INSURANCE_VALUE = 400;
const COMPONENT_INSURANCE_VALUE = 250;
const INSURANCE_VALUE_BY_TYPE: Record<string, number> = {
  sword: SWORD_INSURANCE_VALUE,
  amulet: AMULET_INSURANCE_VALUE,
  staff: STAFF_INSURANCE_VALUE,
  potion: POTION_INSURANCE_VALUE,
  rune: COMPONENT_INSURANCE_VALUE,
  moonstone: COMPONENT_INSURANCE_VALUE,
};

interface Policy {
  items: Item[];
  remainingCap: number;
}

function calculateBasePremium(items: Item[]): number {
  const ordinaryBase = items.reduce(
    (total, item) => total + (BASE_PREMIUM_BY_TYPE[item.type] ?? 0),
    0,
  );
  return COMPONENT_TYPES.reduce((base, componentType) => {
    const count = items.filter((item) => item.type === componentType).length;
    return count === COMPONENT_BLOCK_SIZE
      ? base - count * COMPONENT_BASE_PREMIUM + COMPONENT_BLOCK_PREMIUM
      : base;
  }, ordinaryBase);
}

function calculateItemSurcharges(items: Item[]): number {
  return items.reduce((total, item) => {
    const itemBase = BASE_PREMIUM_BY_TYPE[item.type] ?? 0;
    const curse = item.cursed ? itemBase * CURSE_RATE : 0;
    const enchantment = (item.enchantment ?? 0) >= HIGH_ENCHANTMENT_LEVEL
      ? itemBase * ENCHANTMENT_RATE
      : 0;
    return total + curse + enchantment;
  }, 0);
}

function calculateQuote(items: Item[], yearsWithMHPCO: number, followUp: boolean): Result {
  for (const item of items) {
    if (BASE_PREMIUM_BY_TYPE[item.type] === undefined) {
      throw new Error(`Unknown item type: ${item.type}`);
    }
  }
  const basePremium = calculateBasePremium(items);
  const loyaltyDiscount = yearsWithMHPCO >= LOYALTY_YEARS ? basePremium * LOYALTY_RATE : 0;
  const followUpDiscount = followUp ? basePremium * FOLLOW_UP_RATE : 0;
  const premium = Math.ceil(
    basePremium + calculateItemSurcharges(items) + basePremium * INITIAL_ASSESSMENT_RATE
      - loyaltyDiscount - followUpDiscount + PROCESSING_FEE,
  );
  return { premium };
}

function createPolicy(items: Item[]): Policy {
  const insuranceSum = items.reduce(
    (total, item) => total + (INSURANCE_VALUE_BY_TYPE[item.type] ?? 0),
    0,
  );
  return { items, remainingCap: insuranceSum * CAP_MULTIPLIER };
}

function calculateDamagePayout(item: Item, amount: number): number {
  const reimbursable = (item.enchantment ?? 0) >= CLAIM_ENCHANTMENT_LEVEL
    ? amount * PARTIAL_REIMBURSEMENT_RATE
    : amount;
  return Math.max(0, reimbursable - DEDUCTIBLE);
}

function processClaim(policy: Policy, incident: Incident): Result {
  if (incident.damages.some((damage) => damage.amount < 0)) {
    throw new Error("Damage amount cannot be negative");
  }
  const availableItems = [...policy.items];
  const desiredPayout = incident.damages.reduce((total, damage) => {
    const itemIndex = availableItems.findIndex((item) => item.type === damage.itemType);
    if (itemIndex < 0) throw new Error("Damaged item is not insured");
    const [item] = availableItems.splice(itemIndex, 1);
    return total + calculateDamagePayout(item, damage.amount);
  }, 0);
  const payout = Math.floor(Math.min(desiredPayout, policy.remainingCap));
  policy.remainingCap -= payout;
  return { payout, remainingCap: policy.remainingCap };
}

export function runScenario(scenario: Scenario): { results: Result[] } {
  const policies = new Map<number, Policy>();
  let quoteCount = 0;
  const results = scenario.steps.map((step, stepIndex) => {
    if (step.op === "claim") {
      const policy = policies.get(step.policy ?? -1);
      if (policy === undefined || step.incident === undefined) throw new Error("Invalid policy reference");
      return processClaim(policy, step.incident);
    }
    const items = step.items ?? [];
    const result = calculateQuote(items, scenario.customer.yearsWithMHPCO, quoteCount > 0);
    policies.set(stepIndex, createPolicy(items));
    quoteCount += 1;
    return result;
  });
  return { results };
}
