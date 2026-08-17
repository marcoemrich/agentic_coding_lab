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

interface Damage {
  itemType: string;
  amount: number;
}

interface ClaimStep {
  op: "claim";
  policy: number;
  incident: { cause: string; damages: Damage[] };
}

export interface ScenarioResult {
  results: Array<{ premium: number } | { payout: number; remainingCap: number }>;
}

const PROCESSING_FEE = 5;
const COMPONENT_PREMIUM = 25;
const COMPONENT_BLOCK_SIZE = 3;
const COMPONENT_BLOCK_PREMIUM = 60;
const INITIAL_ASSESSMENT_RATE = 0.1;
const CURSE_RATE = 0.5;
const HIGH_ENCHANTMENT_LEVEL = 5;
const HIGH_ENCHANTMENT_RATE = 0.3;
const REDUCED_REIMBURSEMENT_LEVEL = 8;
const REDUCED_REIMBURSEMENT_RATE = 0.5;
const DEDUCTIBLE = 100;
const CAP_MULTIPLIER = 2;
const COMPONENT_VALUE = 250;
const SWORD_VALUE = 1000;
const AMULET_VALUE = 600;
const STAFF_VALUE = 800;
const POTION_VALUE = 400;
const LOYALTY_YEARS = 2;
const LOYALTY_RATE = 0.2;
const FOLLOW_UP_RATE = 0.15;
const SWORD_PREMIUM = 100;
const AMULET_PREMIUM = 60;
const STAFF_PREMIUM = 80;
const POTION_PREMIUM = 40;
const ITEM_PREMIUMS: Record<string, number> = {
  sword: SWORD_PREMIUM,
  amulet: AMULET_PREMIUM,
  staff: STAFF_PREMIUM,
  potion: POTION_PREMIUM,
};
const ITEM_VALUES: Record<string, number> = {
  sword: SWORD_VALUE,
  amulet: AMULET_VALUE,
  staff: STAFF_VALUE,
  potion: POTION_VALUE,
};
const COMPONENT_TYPES = new Set(["rune", "moonstone"]);

function itemBasePremium(item: Item): number {
  const premium = ITEM_PREMIUMS[item.type];
  if (premium === undefined && !COMPONENT_TYPES.has(item.type)) {
    throw new Error(`Unknown item type: ${item.type}`);
  }
  return premium ?? COMPONENT_PREMIUM;
}

function componentBasePremium(items: Item[]): number {
  const counts = new Map<string, number>();
  for (const item of items.filter((candidate) => COMPONENT_TYPES.has(candidate.type))) {
    counts.set(item.type, (counts.get(item.type) ?? 0) + 1);
  }
  return Array.from(counts.values()).reduce(
    (total, count) => total + (count === COMPONENT_BLOCK_SIZE ? COMPONENT_BLOCK_PREMIUM : count * COMPONENT_PREMIUM),
    0,
  );
}

function policyBasePremium(items: Item[]): number {
  const mainItemsPremium = items
    .filter((item) => !COMPONENT_TYPES.has(item.type))
    .reduce((total, item) => total + itemBasePremium(item), 0);
  return mainItemsPremium + componentBasePremium(items);
}

function quotePremium(items: Item[], yearsWithMHPCO: number, isFollowUp: boolean): number {
  const basePremium = policyBasePremium(items);
  const curseSurcharge = items
    .filter((item) => item.cursed === true)
    .reduce((total, item) => total + itemBasePremium(item) * CURSE_RATE, 0);
  const enchantmentSurcharge = items
    .filter((item) => (item.enchantment ?? 0) >= HIGH_ENCHANTMENT_LEVEL)
    .reduce((total, item) => total + itemBasePremium(item) * HIGH_ENCHANTMENT_RATE, 0);
  const loyaltyDiscount = yearsWithMHPCO >= LOYALTY_YEARS ? basePremium * LOYALTY_RATE : 0;
  const followUpDiscount = isFollowUp ? basePremium * FOLLOW_UP_RATE : 0;
  return Math.ceil(basePremium + curseSurcharge + enchantmentSurcharge
    + basePremium * INITIAL_ASSESSMENT_RATE - loyaltyDiscount - followUpDiscount + PROCESSING_FEE);
}

interface Policy {
  items: Item[];
  remainingCap: number;
}

function createPolicy(items: Item[]): Policy {
  const insuranceSum = items.reduce((total, item) => total + (ITEM_VALUES[item.type] ?? COMPONENT_VALUE), 0);
  return { items, remainingCap: insuranceSum * CAP_MULTIPLIER };
}

function damagePayout(damage: Damage, availableItems: Item[]): number {
  if (damage.amount < 0) throw new Error("Damage amount cannot be negative");
  const itemIndex = availableItems.findIndex((item) => item.type === damage.itemType);
  if (itemIndex < 0) throw new Error(`Damage item is not covered: ${damage.itemType}`);
  const [item] = availableItems.splice(itemIndex, 1);
  const reimbursementRate = (item?.enchantment ?? 0) >= REDUCED_REIMBURSEMENT_LEVEL
    ? REDUCED_REIMBURSEMENT_RATE
    : 1;
  return Math.max(0, damage.amount * reimbursementRate - DEDUCTIBLE);
}

function settleClaim(policy: Policy, damages: Damage[]): { payout: number; remainingCap: number } {
  const availableItems = [...policy.items];
  const desiredPayout = damages.reduce(
    (total, damage) => total + damagePayout(damage, availableItems),
    0,
  );
  const payout = Math.floor(Math.min(desiredPayout, policy.remainingCap));
  policy.remainingCap -= payout;
  return { payout, remainingCap: policy.remainingCap };
}

export function processScenario(scenario: Scenario): ScenarioResult {
  const policies = new Map<number, Policy>();
  const results = scenario.steps.map((step, stepIndex) => {
    if (step.op === "quote") {
      policies.set(stepIndex, createPolicy(step.items));
      const isFollowUp = scenario.steps.slice(0, stepIndex).some((previousStep) => previousStep.op === "quote");
      return { premium: quotePremium(step.items, scenario.customer.yearsWithMHPCO, isFollowUp) };
    }
    const policy = policies.get(step.policy);
    if (policy === undefined) throw new Error("Claim references an unknown policy");
    return settleClaim(policy, step.incident.damages);
  });
  return { results };
}
