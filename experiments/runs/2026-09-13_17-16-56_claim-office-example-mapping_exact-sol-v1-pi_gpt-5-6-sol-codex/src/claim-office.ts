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
const HALF_REIMBURSEMENT = 0.5;
const INITIAL_ASSESSMENT_RATE = 0.1;
const CURSE_RATE = 0.5;
const LOYALTY_RATE = 0.2;
const FOLLOW_UP_RATE = 0.15;
const LOYALTY_YEARS = 2;
const HIGH_ENCHANTMENT_LEVEL = 5;
const HIGH_ENCHANTMENT_RATE = 0.3;
const COMPONENT_BLOCK_SIZE = 3;
const COMPONENT_BLOCK_PREMIUM = 60;
const COMPONENT_TYPES = ["rune", "moonstone"] as const;
const BASE_PREMIUMS: Readonly<Record<string, number>> = {
  sword: 100,
  amulet: 60,
  staff: 80,
  potion: 40,
  rune: 25,
  moonstone: 25,
};
const INSURANCE_VALUES: Readonly<Record<string, number>> = {
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

function componentDiscount(items: Item[], type: string): number {
  const count = items.filter((item) => item.type === type).length;
  return count === COMPONENT_BLOCK_SIZE
    ? count * BASE_PREMIUMS[type] - COMPONENT_BLOCK_PREMIUM
    : 0;
}

function quotePremium(items: Item[], yearsWithMHPCO: number, isFollowUp: boolean): number {
  const listedBase = items.reduce((total, item) => total + BASE_PREMIUMS[item.type], 0);
  const blockDiscount = COMPONENT_TYPES.reduce(
    (discount, type) => discount + componentDiscount(items, type),
    0,
  );
  const basePremium = listedBase - blockDiscount;
  const curseSurcharge = items.reduce(
    (surcharge, item) => surcharge + (item.cursed ? BASE_PREMIUMS[item.type] * CURSE_RATE : 0),
    0,
  );
  const enchantmentSurcharge = items.reduce(
    (surcharge, item) => surcharge
      + ((item.enchantment ?? 0) >= HIGH_ENCHANTMENT_LEVEL ? BASE_PREMIUMS[item.type] * HIGH_ENCHANTMENT_RATE : 0),
    0,
  );
  const loyaltyDiscount = yearsWithMHPCO >= LOYALTY_YEARS ? basePremium * LOYALTY_RATE : 0;
  const followUpDiscount = isFollowUp ? basePremium * FOLLOW_UP_RATE : 0;
  return Math.ceil(basePremium + curseSurcharge + enchantmentSurcharge
    + basePremium * INITIAL_ASSESSMENT_RATE - loyaltyDiscount - followUpDiscount + PROCESSING_FEE);

}

function validateItems(items: Item[]): void {
  const unknown = items.find((item) => !Object.hasOwn(BASE_PREMIUMS, item.type));
  if (unknown) throw new Error(`Unknown item type: ${unknown.type}`);
}

function createPolicy(items: Item[]): Policy {
  const insuranceSum = items.reduce((sum, item) => sum + INSURANCE_VALUES[item.type], 0);
  return { items, remainingCap: insuranceSum * CAP_MULTIPLIER };
}

function validateDamageCoverage(policy: Policy, damages: Damage[]): void {
  if (damages.some((damage) => damage.amount < 0)) throw new Error("Negative damage amount");
  const coveredCounts = new Map<string, number>();
  const damageCounts = new Map<string, number>();
  for (const item of policy.items) coveredCounts.set(item.type, (coveredCounts.get(item.type) ?? 0) + 1);
  for (const damage of damages) {
    if (!coveredCounts.has(damage.itemType)) throw new Error(`Item type not covered: ${damage.itemType}`);
    const count = (damageCounts.get(damage.itemType) ?? 0) + 1;
    if (count > coveredCounts.get(damage.itemType)!) {
      throw new Error(`More damage entries than covered items: ${damage.itemType}`);
    }
    damageCounts.set(damage.itemType, count);
  }
}

function claimPolicy(policy: Policy, damages: Damage[]): Result {
  validateDamageCoverage(policy, damages);
  const desired = damages.reduce((sum, damage) => {
    const item = policy.items.find((covered) => covered.type === damage.itemType)!;
    const rate = (item.enchantment ?? 0) >= CLAIM_ENCHANTMENT_LEVEL ? HALF_REIMBURSEMENT : 1;
    return sum + Math.max(0, damage.amount * rate - DEDUCTIBLE);
  }, 0);
  const payout = Math.min(Math.floor(desired), policy.remainingCap);
  policy.remainingCap -= payout;
  return { payout, remainingCap: policy.remainingCap };
}

export function processScenario(scenario: Scenario): { results: Result[] } {
  let quoteCount = 0;
  const policies = new Map<number, Policy>();
  const results = scenario.steps.map((step, index): Result => {
    if (step.op === "claim") return claimPolicy(policies.get(step.policy)!, step.incident.damages);
    validateItems(step.items);
    const premium = quotePremium(step.items, scenario.customer.yearsWithMHPCO, quoteCount > 0);
    policies.set(index, createPolicy(step.items));
    quoteCount += 1;
    return { premium };
  });
  return { results };
}
