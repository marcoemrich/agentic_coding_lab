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

export type Result = { premium: number } | { payout: number; remainingCap: number };

const COMPONENT_BLOCK_SIZE = 3;
const COMPONENT_BLOCK_PREMIUM = 60;
const COMPONENT_UNIT_PREMIUM = 25;
const COMPONENT_TYPES = ["rune", "moonstone"];
const CURSE_SURCHARGE = 0.5;
const HIGH_ENCHANTMENT_LEVEL = 5;
const ENCHANTMENT_SURCHARGE = 0.3;
const LOYALTY_YEARS = 2;
const LOYALTY_DISCOUNT = 0.2;
const INITIAL_ASSESSMENT = 0.1;
const FOLLOW_UP_DISCOUNT = 0.15;
const PROCESSING_FEE = 5;
const DEDUCTIBLE = 100;
const CAP_MULTIPLIER = 2;
const CLAIM_ENCHANTMENT_LEVEL = 8;
const HIGH_ENCHANTMENT_REIMBURSEMENT = 0.5;

const ITEM_INSURANCE_VALUES: Record<string, number> = {
  sword: 1000,
  amulet: 600,
  staff: 800,
  potion: 400,
  rune: 250,
  moonstone: 250,
};

const ITEM_BASE_PREMIUMS: Record<string, number> = {
  sword: 100,
  amulet: 60,
  staff: 80,
  potion: 40,
  rune: 25,
  moonstone: 25,
};

export function basePremium(items: Array<{ type: string }>): number {
  const regularTotal = items.reduce(
    (total, item) => total + (ITEM_BASE_PREMIUMS[item.type] ?? 0),
    0,
  );
  const blockSaving = COMPONENT_TYPES.reduce((saving, type) => {
    const count = items.filter((item) => item.type === type).length;
    return count === COMPONENT_BLOCK_SIZE
      ? saving + COMPONENT_BLOCK_SIZE * COMPONENT_UNIT_PREMIUM - COMPONENT_BLOCK_PREMIUM
      : saving;
  }, 0);
  return regularTotal - blockSaving;
}

export function itemAdjustedPremium(items: Item[]): number {
  const curseTotal = items.reduce(
    (total, item) => total + (item.cursed ? (ITEM_BASE_PREMIUMS[item.type] ?? 0) * CURSE_SURCHARGE : 0),
    0,
  );
  const enchantmentTotal = items.reduce((total, item) => {
    const isHighlyEnchanted = (item.enchantment ?? 0) >= HIGH_ENCHANTMENT_LEVEL;
    return total + (isHighlyEnchanted
      ? (ITEM_BASE_PREMIUMS[item.type] ?? 0) * ENCHANTMENT_SURCHARGE
      : 0);
  }, 0);
  return basePremium(items) + curseTotal + enchantmentTotal;
}

export function roundPremium(amount: number): number {
  return Math.ceil(amount);
}

export function roundPayout(amount: number): number {
  return Math.floor(amount);
}

function assertKnownItems(items: Item[]): void {
  for (const item of items) {
    if (!(item.type in ITEM_BASE_PREMIUMS)) {
      throw new Error(`Unknown item type: ${item.type}`);
    }
  }
}

function quotePremium(items: Item[], yearsWithMHPCO: number, quoteIndex: number): number {
  assertKnownItems(items);
  const base = basePremium(items);
  const loyalty = yearsWithMHPCO >= LOYALTY_YEARS ? base * LOYALTY_DISCOUNT : 0;
  const followUp = quoteIndex > 0 ? base * FOLLOW_UP_DISCOUNT : 0;
  const premium = itemAdjustedPremium(items)
    - loyalty + base * INITIAL_ASSESSMENT - followUp + PROCESSING_FEE;
  return roundPremium(premium);
}

interface Policy {
  items: Item[];
  remainingCap: number;
}

function insuranceSum(items: Item[]): number {
  return items.reduce((sum, item) => sum + (ITEM_INSURANCE_VALUES[item.type] ?? 0), 0);
}

function damagePayout(damage: Damage, item: Item | undefined): number {
  const reimbursement = (item?.enchantment ?? 0) >= CLAIM_ENCHANTMENT_LEVEL
    ? damage.amount * HIGH_ENCHANTMENT_REIMBURSEMENT
    : damage.amount;
  return Math.max(0, reimbursement - DEDUCTIBLE);
}

function desiredClaimPayout(damages: Damage[], insuredItems: Item[]): number {
  const available = [...insuredItems];
  return damages.reduce((sum, damage) => {
    if (damage.amount < 0) {
      throw new Error(`Damage amount is negative: ${String(damage.amount)}`);
    }
    const itemIndex = available.findIndex((item) => item.type === damage.itemType);
    if (itemIndex < 0) {
      throw new Error(`Damage for ${damage.itemType} exceeds policy cover`);
    }
    const [item] = available.splice(itemIndex, 1);
    return sum + damagePayout(damage, item);
  }, 0);
}

function processClaim(step: ClaimStep, policies: Array<Policy | undefined>): Result {
  const policy = policies[step.policy];
  if (!policy) throw new Error(`Unknown policy: ${String(step.policy)}`);
  const desired = desiredClaimPayout(step.incident.damages, policy.items);
  const payout = roundPayout(Math.min(desired, policy.remainingCap));
  policy.remainingCap -= payout;
  return { payout, remainingCap: policy.remainingCap };
}

export function runScenario(scenario: Scenario): { results: Result[] } {
  const results: Result[] = [];
  const policies: Array<Policy | undefined> = [];
  let quoteCount = 0;
  for (const [index, step] of scenario.steps.entries()) {
    if (step.op === "claim") {
      results.push(processClaim(step, policies));
    } else {
      const premium = quotePremium(step.items, scenario.customer.yearsWithMHPCO, quoteCount++);
      policies[index] = { items: step.items, remainingCap: insuranceSum(step.items) * CAP_MULTIPLIER };
      results.push({ premium });
    }
  }
  return { results };
}
