export interface Scenario {
  customer: { yearsWithMHPCO: number };
  steps: Array<{ op: "quote"; items: Item[] } | ClaimStep>;
}

export interface Item {
  type: string;
  material?: string;
  enchantment?: number;
  cursed?: boolean;
}

interface ClaimStep {
  op: "claim";
  policy: number;
  incident: { cause: string; damages: Array<{ itemType: string; amount: number }> };
}

export type Result = { premium: number } | { payout: number; remainingCap: number };

const INSURANCE_VALUE: Record<string, number> = {
  sword: 1000,
  amulet: 600,
  staff: 800,
  potion: 400,
  rune: 250,
  moonstone: 250,
};
const BASE_PREMIUM: Record<string, number> = {
  sword: 100,
  amulet: 60,
  staff: 80,
  potion: 40,
  rune: 25,
  moonstone: 25,
};
const PROCESSING_FEE = 5;
const FIRST_INSURANCE_RATE = 0.1;
const CURSE_RATE = 0.5;
const LOYALTY_YEARS = 2;
const LOYALTY_RATE = 0.2;
const HIGH_ENCHANTMENT = 5;
const ENCHANTMENT_RATE = 0.3;
const FOLLOW_UP_RATE = 0.15;
const POLICY_CAP_MULTIPLIER = 2;
const DEDUCTIBLE = 100;
const CLAIM_ENCHANTMENT_THRESHOLD = 8;
const HALF_REIMBURSEMENT_RATE = 0.5;

const COMPONENT_TYPES = ["rune", "moonstone"];
const BLOCK_SIZE = 3;
const BLOCK_PREMIUM = 60;

function componentBlockPremium(items: Item[], item: Item): number | undefined {
  if (!COMPONENT_TYPES.includes(item.type)) return undefined;
  const alike = items.filter((candidate) => candidate.type === item.type);
  if (alike.length !== BLOCK_SIZE) return undefined;
  return alike[0] === item ? BLOCK_PREMIUM : 0;
}

function basePremium(items: Item[]): number {
  return items.reduce((total, item) => {
    const ordinaryPremium = BASE_PREMIUM[item.type];
    if (ordinaryPremium === undefined) throw new Error(`Unknown item type: ${item.type}`);
    return total + (componentBlockPremium(items, item) ?? ordinaryPremium);
  }, 0);
}

function itemRiskSurcharge(items: Item[]): number {
  return items.reduce((total, item) => {
    const curseRate = item.cursed === true ? CURSE_RATE : 0;
    const enchantmentRate = (item.enchantment ?? 0) >= HIGH_ENCHANTMENT ? ENCHANTMENT_RATE : 0;
    return total + BASE_PREMIUM[item.type] * (curseRate + enchantmentRate);
  }, 0);
}

function quotePremium(items: Item[], yearsWithMHPCO: number, isFollowUp: boolean): number {
  const base = basePremium(items);
  const loyalty = yearsWithMHPCO >= LOYALTY_YEARS ? base * LOYALTY_RATE : 0;
  const followUp = isFollowUp ? base * FOLLOW_UP_RATE : 0;
  return Math.ceil(base + itemRiskSurcharge(items) + base * FIRST_INSURANCE_RATE - loyalty - followUp + PROCESSING_FEE);
}

function damageReimbursement(item: Item, amount: number): number {
  const reimbursable = (item.enchantment ?? 0) >= CLAIM_ENCHANTMENT_THRESHOLD
    ? amount * HALF_REIMBURSEMENT_RATE
    : amount;
  return Math.max(0, reimbursable - DEDUCTIBLE);
}

function desiredClaimPayout(policyItems: Item[], claim: ClaimStep): number {
  const matchedCount = new Map<string, number>();
  return claim.incident.damages.reduce((sum, damage) => {
    if (damage.amount < 0) throw new Error("Damage amount cannot be negative");
    const occurrence = matchedCount.get(damage.itemType) ?? 0;
    const matchingItems = policyItems.filter((item) => item.type === damage.itemType);
    const item = matchingItems[occurrence];
    if (item === undefined) {
      if (matchingItems.length === 0) throw new Error(`Damage item is not covered: ${damage.itemType}`);
      throw new Error(`More ${damage.itemType} damages than insured items`);
    }
    matchedCount.set(damage.itemType, occurrence + 1);
    return sum + damageReimbursement(item, damage.amount);
  }, 0);
}

export function processScenario(scenario: Scenario): { results: Result[] } {
  const results: Result[] = [];
  const paidByPolicy = new Map<number, number>();
  scenario.steps.forEach((step, index) => {
    if (step.op === "quote") {
      const isFollowUp = scenario.steps.slice(0, index).some((prior) => prior.op === "quote");
      results.push({ premium: quotePremium(step.items, scenario.customer.yearsWithMHPCO, isFollowUp) });
      return;
    }
    const policy = scenario.steps[step.policy];
    if (policy?.op !== "quote") throw new Error("Claim policy must reference an earlier quote");
    const cap = policy.items.reduce((sum, item) => sum + INSURANCE_VALUE[item.type], 0) * POLICY_CAP_MULTIPLIER;
    const desired = desiredClaimPayout(policy.items, step);
    const alreadyPaid = paidByPolicy.get(step.policy) ?? 0;
    const payout = Math.floor(Math.min(desired, cap - alreadyPaid));
    paidByPolicy.set(step.policy, alreadyPaid + payout);
    results.push({ payout, remainingCap: cap - alreadyPaid - payout });
  });
  return { results };
}
