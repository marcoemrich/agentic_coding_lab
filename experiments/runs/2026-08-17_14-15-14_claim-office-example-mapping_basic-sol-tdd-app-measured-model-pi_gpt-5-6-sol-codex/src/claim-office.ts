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

const MAIN_BASE_PREMIUMS: Record<string, number> = {
  sword: 100,
  amulet: 60,
  staff: 80,
  potion: 40,
  rune: 25,
  moonstone: 25,
};

const COMPONENT_BLOCK_SIZE = 3;
const COMPONENT_BLOCK_DISCOUNT = 15;
const COMPONENT_TYPES = ["rune", "moonstone"];

export function basePremium(items: Item[]): number {
  const regularTotal = items.reduce((total, item) => total + (MAIN_BASE_PREMIUMS[item.type] ?? 0), 0);
  const blockCount = COMPONENT_TYPES.filter((type) =>
    items.filter((item) => item.type === type).length === COMPONENT_BLOCK_SIZE).length;
  return regularTotal - blockCount * COMPONENT_BLOCK_DISCOUNT;
}

const CURSE_SURCHARGE = 0.5;
const HIGH_ENCHANTMENT_SURCHARGE = 0.3;
const HIGH_ENCHANTMENT_LEVEL = 5;

export function premiumBeforePolicyModifiers(items: Item[]): number {
  const itemSurcharges = items.reduce((total, item) => {
    const itemBase = MAIN_BASE_PREMIUMS[item.type] ?? 0;
    const curse = item.cursed ? itemBase * CURSE_SURCHARGE : 0;
    const enchantment = (item.enchantment ?? 0) >= HIGH_ENCHANTMENT_LEVEL
      ? itemBase * HIGH_ENCHANTMENT_SURCHARGE : 0;
    return total + curse + enchantment;
  }, 0);
  return basePremium(items) + itemSurcharges;
}

const LOYALTY_YEARS = 2;
const LOYALTY_DISCOUNT = 0.2;
const INITIAL_ASSESSMENT = 0.1;
const PROCESSING_FEE = 5;
const FOLLOW_UP_DISCOUNT = 0.15;
const INSURANCE_VALUES: Record<string, number> = {
  sword: 1000,
  amulet: 600,
  staff: 800,
  potion: 400,
  rune: 250,
  moonstone: 250,
};
const POLICY_CAP_MULTIPLIER = 2;
const CLAIM_ENCHANTMENT_LEVEL = 8;
const HIGH_ENCHANTMENT_REIMBURSEMENT = 0.5;
const DEDUCTIBLE = 100;

interface Policy {
  items: Item[];
  remainingCap: number;
}

function quotePremium(items: Item[], yearsWithMHPCO: number, previousQuotes: number): number {
  const policyBase = basePremium(items);
  const loyaltyDiscount = yearsWithMHPCO >= LOYALTY_YEARS ? policyBase * LOYALTY_DISCOUNT : 0;
  const followUpDiscount = previousQuotes > 0 ? policyBase * FOLLOW_UP_DISCOUNT : 0;
  return Math.ceil(premiumBeforePolicyModifiers(items) + policyBase * INITIAL_ASSESSMENT
    - loyaltyDiscount - followUpDiscount + PROCESSING_FEE);
}

function validateItems(items: Item[]): void {
  if (items.some((item) => INSURANCE_VALUES[item.type] === undefined)) {
    throw new Error("Unknown item type");
  }
}

function createPolicy(items: Item[]): Policy {
  validateItems(items);
  const insuranceSum = items.reduce((sum, item) => sum + (INSURANCE_VALUES[item.type] ?? 0), 0);
  return { items, remainingCap: insuranceSum * POLICY_CAP_MULTIPLIER };
}

function validateCoveredDamages(policy: Policy, damages: Damage[]): void {
  if (damages.some((damage) => damage.amount < 0)) throw new Error("Damage amount cannot be negative");
  const damagedTypes = new Set(damages.map((damage) => damage.itemType));
  for (const type of damagedTypes) {
    const insuredCount = policy.items.filter((item) => item.type === type).length;
    const damageCount = damages.filter((damage) => damage.itemType === type).length;
    if (damageCount > insuredCount) throw new Error("Damage exceeds insured item count");
  }
}

function processClaim(policy: Policy, damages: Damage[]): Result {
  validateCoveredDamages(policy, damages);
  const desired = damages.reduce((sum, damage) => {
    const item = policy.items.find((candidate) => candidate.type === damage.itemType);
    const reimbursable = (item?.enchantment ?? 0) >= CLAIM_ENCHANTMENT_LEVEL
      ? damage.amount * HIGH_ENCHANTMENT_REIMBURSEMENT : damage.amount;
    return sum + Math.max(0, reimbursable - DEDUCTIBLE);
  }, 0);
  const payout = Math.floor(Math.min(desired, policy.remainingCap));
  policy.remainingCap -= payout;
  return { payout, remainingCap: policy.remainingCap };
}

export function processScenario(scenario: Scenario): { results: Result[] } {
  let quoteCount = 0;
  const policies = new Map<number, Policy>();
  const results = scenario.steps.map((step, index): Result => {
    if (step.op === "quote") {
      policies.set(index, createPolicy(step.items));
      const premium = quotePremium(step.items, scenario.customer.yearsWithMHPCO, quoteCount);
      quoteCount += 1;
      return { premium };
    }
    const policy = policies.get(step.policy);
    if (!policy) throw new Error("Claim policy does not exist");
    return processClaim(policy, step.incident.damages);
  });
  return { results };
}
