export interface Scenario {
  customer: { yearsWithMHPCO: number };
  steps: Array<Record<string, unknown>>;
}

export interface ScenarioResult {
  results: Array<Record<string, number>>;
}

interface Item {
  type: string;
  material?: string;
  enchantment?: number;
  cursed?: boolean;
}

interface Damage {
  itemType: string;
  amount: number;
}

interface Policy {
  items: Item[];
  remainingCap: number;
}

const PROCESSING_FEE = 5;
const INITIAL_ASSESSMENT_RATE = 0.1;
const CURSE_RATE = 0.5;
const LOYALTY_RATE = 0.2;
const LOYALTY_YEARS = 2;
const HIGH_ENCHANTMENT_LEVEL = 5;
const ENCHANTMENT_RATE = 0.3;
const FOLLOW_UP_RATE = 0.15;
const SEVERE_ENCHANTMENT_LEVEL = 8;
const SEVERE_REIMBURSEMENT_RATE = 0.5;
const DEDUCTIBLE = 100;
const CAP_MULTIPLIER = 2;
const INSURANCE_VALUE: Record<string, number> = {
  sword: 1000,
  amulet: 600,
  staff: 800,
  potion: 400,
  rune: 250,
  moonstone: 250,
};
const COMPONENT_BLOCK_SIZE = 3;
const COMPONENT_BLOCK_PREMIUM = 60;
const COMPONENT_TYPES = new Set(["rune", "moonstone"]);
const BASE_PREMIUM: Record<string, number> = {
  sword: 100,
  amulet: 60,
  staff: 80,
  potion: 40,
  rune: 25,
  moonstone: 25,
};

function itemPremiumBases(items: Item[]): number[] {
  const counts = new Map<string, number>();
  for (const item of items) counts.set(item.type, (counts.get(item.type) ?? 0) + 1);
  return items.map((item) => {
    const isBlock = COMPONENT_TYPES.has(item.type) && counts.get(item.type) === COMPONENT_BLOCK_SIZE;
    return isBlock ? COMPONENT_BLOCK_PREMIUM / COMPONENT_BLOCK_SIZE : (BASE_PREMIUM[item.type] ?? 0);
  });
}

function quote(items: Item[], yearsWithMHPCO: number, isFollowUp = false): Record<string, number> {
  const itemBases = itemPremiumBases(items);
  const base = itemBases.reduce((sum, itemBase) => sum + itemBase, 0);
  const curseSurcharge = items.reduce(
    (sum, item, index) => sum + (item.cursed ? itemBases[index] * CURSE_RATE : 0),
    0,
  );
  const enchantmentSurcharge = items.reduce(
    (sum, item, index) => sum + ((item.enchantment ?? 0) >= HIGH_ENCHANTMENT_LEVEL ? itemBases[index] * ENCHANTMENT_RATE : 0),
    0,
  );
  const loyaltyDiscount = yearsWithMHPCO >= LOYALTY_YEARS ? base * LOYALTY_RATE : 0;
  const followUpDiscount = isFollowUp ? base * FOLLOW_UP_RATE : 0;
  return { premium: Math.ceil(base + curseSurcharge + enchantmentSurcharge + base * INITIAL_ASSESSMENT_RATE - loyaltyDiscount - followUpDiscount + PROCESSING_FEE) };
}

function createPolicy(items: Item[]): Policy {
  const unknown = items.find((item) => INSURANCE_VALUE[item.type] === undefined);
  if (unknown) throw new Error(`Unknown item type: ${unknown.type}`);
  const insuranceSum = items.reduce((sum, item) => sum + (INSURANCE_VALUE[item.type] ?? 0), 0);
  return { items, remainingCap: insuranceSum * CAP_MULTIPLIER };
}

function settleClaim(policy: Policy, damages: Damage[]): Record<string, number> {
  const available = [...policy.items];
  const desired = damages.reduce((sum, damage) => {
    if (damage.amount < 0) throw new Error("Damage amount cannot be negative");
    const itemIndex = available.findIndex((item) => item.type === damage.itemType);
    if (itemIndex < 0) throw new Error(`Item ${damage.itemType} is not covered`);
    const [item] = available.splice(itemIndex, 1);
    const rate = (item.enchantment ?? 0) >= SEVERE_ENCHANTMENT_LEVEL ? SEVERE_REIMBURSEMENT_RATE : 1;
    return sum + Math.max(0, damage.amount * rate - DEDUCTIBLE);
  }, 0);
  const payout = Math.floor(Math.min(desired, policy.remainingCap));
  policy.remainingCap -= payout;
  return { payout, remainingCap: policy.remainingCap };
}

export function processScenario(scenario: Scenario): ScenarioResult {
  const policies = new Map<number, Policy>();
  const results: Array<Record<string, number>> = [];
  let quoteCount = 0;
  scenario.steps.forEach((step, stepIndex) => {
    if (step.op === "quote") {
      const items = step.items as Item[];
      policies.set(stepIndex, createPolicy(items));
      results.push(quote(items, scenario.customer.yearsWithMHPCO, quoteCount > 0));
      quoteCount += 1;
    } else {
      const policy = policies.get(step.policy as number);
      if (!policy) throw new Error("Claim does not reference an earlier policy");
      const incident = step.incident as { damages: Damage[] };
      results.push(settleClaim(policy, incident.damages));
    }
  });
  return { results };
}
