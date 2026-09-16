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
const FIRST_INSURANCE_RATE = 0.1;
const CURSE_RATE = 0.5;
const HIGH_ENCHANTMENT_LEVEL = 5;
const HIGH_ENCHANTMENT_RATE = 0.3;
const LOYALTY_YEARS = 2;
const LOYALTY_RATE = 0.2;
const FOLLOW_UP_RATE = 0.15;
const CLAIM_ENCHANTMENT_LEVEL = 8;
const CLAIM_ENCHANTMENT_RATE = 0.5;
const DEDUCTIBLE = 100;
const CAP_MULTIPLIER = 2;
const INSURANCE_VALUE: Record<string, number> = {
  sword: 1000, amulet: 600, staff: 800, potion: 400, rune: 250, moonstone: 250,
};
const COMPONENT_BLOCK_SIZE = 3;
const COMPONENT_BLOCK_PREMIUM = 60;
const COMPONENT_TYPES = ["rune", "moonstone"] as const;
const BASE_PREMIUM: Record<string, number> = { sword: 100, amulet: 60, staff: 80, potion: 40, rune: 25, moonstone: 25 };

function basePremiumFor(item: Item): number {
  return BASE_PREMIUM[item.type] ?? 0;
}

function itemRiskSurcharge(items: Item[]): number {
  return items.reduce((total, item) => {
    const base = basePremiumFor(item);
    const curse = item.cursed ? base * CURSE_RATE : 0;
    const enchantment = (item.enchantment ?? 0) >= HIGH_ENCHANTMENT_LEVEL
      ? base * HIGH_ENCHANTMENT_RATE
      : 0;
    return total + curse + enchantment;
  }, 0);
}

function policyBasePremium(items: Item[]): number {
  const ordinaryTotal = items.reduce((total, item) => total + basePremiumFor(item), 0);
  const ordinaryBlockPremium = COMPONENT_BLOCK_SIZE * BASE_PREMIUM.rune;
  const blockSavings = COMPONENT_TYPES.reduce((savings, type) => {
    const count = items.filter((item) => item.type === type).length;
    return count === COMPONENT_BLOCK_SIZE
      ? savings + ordinaryBlockPremium - COMPONENT_BLOCK_PREMIUM
      : savings;
  }, 0);
  return ordinaryTotal - blockSavings;
}

function quotePremium(items: Item[], yearsWithMHPCO: number, isFollowUp: boolean): number {
  if (items.some((item) => !(item.type in INSURANCE_VALUE))) {
    throw new Error("Unknown item type");
  }
  const basePremium = policyBasePremium(items);
  const riskSurcharge = itemRiskSurcharge(items);
  const loyaltyDiscount = yearsWithMHPCO >= LOYALTY_YEARS ? basePremium * LOYALTY_RATE : 0;
  const followUpDiscount = isFollowUp ? basePremium * FOLLOW_UP_RATE : 0;
  return Math.ceil(
    basePremium + riskSurcharge + basePremium * FIRST_INSURANCE_RATE
      - loyaltyDiscount - followUpDiscount + PROCESSING_FEE,
  );
}

interface Policy {
  items: Item[];
  remainingCap: number;
}

function claimPolicy(policy: Policy, incident: Incident): Result {
  if (incident.damages.some((damage) => damage.amount < 0)) {
    throw new Error("Damage amount must not be negative");
  }
  const used = new Set<number>();
  const rawPayout = incident.damages.reduce((total, damage) => {
    const index = policy.items.findIndex((item, candidate) =>
      !used.has(candidate) && item.type === damage.itemType);
    if (index < 0) throw new Error("Damage item is not covered by policy");
    used.add(index);
    const item = policy.items[index];
    const reimbursement = (item.enchantment ?? 0) >= CLAIM_ENCHANTMENT_LEVEL
      ? damage.amount * CLAIM_ENCHANTMENT_RATE
      : damage.amount;
    return total + Math.max(0, reimbursement - DEDUCTIBLE);
  }, 0);
  const payout = Math.floor(Math.min(rawPayout, policy.remainingCap));
  policy.remainingCap -= payout;
  return { payout, remainingCap: policy.remainingCap };
}

export function processScenario(scenario: Scenario): { results: Result[] } {
  let quoteCount = 0;
  const policies = new Map<number, Policy>();
  const results = scenario.steps.map((step, index) => {
    if (step.op === "claim") {
      const policy = policies.get(step.policy ?? -1);
      if (!policy || !step.incident) throw new Error("Claim references no policy");
      return claimPolicy(policy, step.incident);
    }
    const items = step.items ?? [];
    const premium = quotePremium(items, scenario.customer.yearsWithMHPCO, quoteCount > 0);
    const insuranceSum = items.reduce((sum, item) => sum + (INSURANCE_VALUE[item.type] ?? 0), 0);
    policies.set(index, { items, remainingCap: insuranceSum * CAP_MULTIPLIER });
    quoteCount += 1;
    return { premium };
  });
  return { results };
}
