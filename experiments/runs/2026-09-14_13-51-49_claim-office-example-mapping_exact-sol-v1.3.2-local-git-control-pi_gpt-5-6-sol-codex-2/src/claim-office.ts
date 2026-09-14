const PROCESSING_FEE = 5;
const COMPONENT_BLOCK_SIZE = 3;
const COMPONENT_BLOCK_PREMIUM = 60;
const CURSE_SURCHARGE = 0.5;
const HIGH_ENCHANTMENT_SURCHARGE = 0.3;
const HIGH_ENCHANTMENT_PREMIUM_LEVEL = 5;
const INITIAL_ASSESSMENT = 0.1;
const LOYALTY_DISCOUNT = 0.2;
const LOYALTY_YEARS = 2;
const FOLLOW_UP_DISCOUNT = 0.15;
const DEDUCTIBLE = 100;
const CAP_MULTIPLIER = 2;
const HIGH_ENCHANTMENT_CLAIM_LEVEL = 8;
const HIGH_ENCHANTMENT_REIMBURSEMENT = 0.5;

const ITEM_TERMS: Record<string, { insuranceValue: number; basePremium: number }> = {
  sword: { insuranceValue: 1000, basePremium: 100 },
  amulet: { insuranceValue: 600, basePremium: 60 },
  staff: { insuranceValue: 800, basePremium: 80 },
  potion: { insuranceValue: 400, basePremium: 40 },
  rune: { insuranceValue: 250, basePremium: 25 },
  moonstone: { insuranceValue: 250, basePremium: 25 },
};

export interface Item {
  type: string;
  material?: string;
  enchantment?: number;
  cursed?: boolean;
}

function validateItemTypes(items: Item[]): void {
  if (items.some((item) => ITEM_TERMS[item.type] === undefined)) {
    throw new Error("Unknown item type");
  }
}

export function calculateBasePremium(items: Item[]): number {
  validateItemTypes(items);
  const standardPremium = items.reduce((total, item) => total + ITEM_TERMS[item.type].basePremium, 0);
  const componentTypes = ["rune", "moonstone"];
  const blockDiscount = componentTypes.filter(
    (type) => items.filter((item) => item.type === type).length === COMPONENT_BLOCK_SIZE,
  ).reduce((discount, type) => discount + ITEM_TERMS[type].basePremium * COMPONENT_BLOCK_SIZE - COMPONENT_BLOCK_PREMIUM, 0);
  return standardPremium - blockDiscount;
}

export function calculateRiskAdjustedPremium(items: Item[]): number {
  return calculateBasePremium(items) + items.reduce((total, item) => {
    const basePremium = ITEM_TERMS[item.type].basePremium;
    const curse = item.cursed ? basePremium * CURSE_SURCHARGE : 0;
    const enchantment = (item.enchantment ?? 0) >= HIGH_ENCHANTMENT_PREMIUM_LEVEL
      ? basePremium * HIGH_ENCHANTMENT_SURCHARGE : 0;
    return total + curse + enchantment;
  }, 0);
}

export function calculateInsuranceSum(items: Item[]): number {
  return items.reduce((total, item) => total + ITEM_TERMS[item.type].insuranceValue, 0);
}

export interface ScenarioResult {
  results: Array<{ premium: number } | { payout: number; remainingCap: number }>;
}

interface Damage {
  itemType: string;
  amount: number;
}

interface Step {
  op: string;
  items?: Item[];
  policy?: number;
  incident?: { cause: string; damages: Damage[] };
}

interface Scenario {
  customer: { yearsWithMHPCO: number };
  steps: Step[];
}

interface Policy {
  items: Item[];
  remainingCap: number;
}

function quotePremium(items: Item[], yearsWithMHPCO: number, previousContracts: number): number {
  const basePremium = calculateBasePremium(items);
  const loyalty = yearsWithMHPCO >= LOYALTY_YEARS ? basePremium * LOYALTY_DISCOUNT : 0;
  const followUp = previousContracts > 0 ? basePremium * FOLLOW_UP_DISCOUNT : 0;
  return Math.ceil(
    calculateRiskAdjustedPremium(items) + basePremium * INITIAL_ASSESSMENT - loyalty - followUp + PROCESSING_FEE,
  );
}

function validateDamageCoverage(policy: Policy, damages: Damage[]): void {
  for (const damage of damages) {
    if (damage.amount < 0) throw new Error("Damage amount cannot be negative");
    const covered = policy.items.filter((item) => item.type === damage.itemType).length;
    const reported = damages.filter((entry) => entry.itemType === damage.itemType).length;
    if (reported > covered) throw new Error("Damage item is not covered by the policy");
  }
}

function processClaim(policy: Policy, damages: Damage[]): { payout: number; remainingCap: number } {
  validateDamageCoverage(policy, damages);
  const desiredPayout = damages.reduce((total, damage) => {
    const item = policy.items.find((candidate) => candidate.type === damage.itemType)!;
    const reimbursement = (item.enchantment ?? 0) >= HIGH_ENCHANTMENT_CLAIM_LEVEL
      ? damage.amount * HIGH_ENCHANTMENT_REIMBURSEMENT : damage.amount;
    return total + Math.max(0, reimbursement - DEDUCTIBLE);
  }, 0);
  const payout = Math.min(Math.floor(desiredPayout), policy.remainingCap);
  policy.remainingCap -= payout;
  return { payout, remainingCap: policy.remainingCap };
}

export function processScenario(input: unknown): ScenarioResult {
  const scenario = input as Scenario;
  const policies = new Map<number, Policy>();
  let quoteCount = 0;
  const results = scenario.steps.map((step, index) => {
    if (step.op === "claim") {
      const policy = policies.get(step.policy ?? -1);
      if (!policy) throw new Error("Claim references an unknown policy");
      return processClaim(policy, step.incident!.damages);
    }
    const items = step.items ?? [];
    const premium = quotePremium(items, scenario.customer.yearsWithMHPCO, quoteCount);
    policies.set(index, { items, remainingCap: calculateInsuranceSum(items) * CAP_MULTIPLIER });
    quoteCount += 1;
    return { premium };
  });
  return { results };
}
