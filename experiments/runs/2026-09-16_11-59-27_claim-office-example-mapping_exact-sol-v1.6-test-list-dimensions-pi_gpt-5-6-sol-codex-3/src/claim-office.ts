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

interface Incident {
  cause: string;
  damages: Array<{ itemType: string; amount: number }>;
}

export interface ScenarioResult {
  results: Array<{ premium: number } | { payout: number; remainingCap: number }>;
}

const BASE_PREMIUM: Record<string, number> = { sword: 100, amulet: 60, staff: 80, potion: 40, rune: 25, moonstone: 25 };
const INSURANCE_VALUE: Record<string, number> = { sword: 1000, amulet: 600, staff: 800, potion: 400, rune: 250, moonstone: 250 };
const CAP_MULTIPLIER = 2;
const DEDUCTIBLE = 100;
const CLAIM_ENCHANTMENT_LEVEL = 8;
const HIGH_ENCHANTMENT_REIMBURSEMENT_RATE = 0.5;
const INITIAL_ASSESSMENT_RATE = 0.1;
const CURSE_RATE = 0.5;
const HIGH_ENCHANTMENT_RATE = 0.3;
const HIGH_ENCHANTMENT_LEVEL = 5;
const LOYALTY_RATE = 0.2;
const LOYALTY_YEARS = 2;
const FOLLOW_UP_RATE = 0.15;
const PROCESSING_FEE = 5;

const COMPONENT_TYPES = ["rune", "moonstone"];
const COMPONENT_BLOCK_SIZE = 3;
const COMPONENT_BLOCK_PREMIUM = 60;

function basePremium(items: Item[]): number {
  const counts = items.reduce<Record<string, number>>((all, item) => {
    all[item.type] = (all[item.type] ?? 0) + 1;
    return all;
  }, {});
  return Object.entries(counts).reduce((sum, [type, count]) => {
    if (COMPONENT_TYPES.includes(type) && count === COMPONENT_BLOCK_SIZE) {
      return sum + COMPONENT_BLOCK_PREMIUM;
    }
    return sum + (BASE_PREMIUM[type] ?? 0) * count;
  }, 0);
}

function itemRiskSurcharge(items: Item[]): number {
  return items.reduce((sum, item) => {
    const itemBase = BASE_PREMIUM[item.type] ?? 0;
    const curse = item.cursed ? itemBase * CURSE_RATE : 0;
    const enchantment = (item.enchantment ?? 0) >= HIGH_ENCHANTMENT_LEVEL
      ? itemBase * HIGH_ENCHANTMENT_RATE
      : 0;
    return sum + curse + enchantment;
  }, 0);
}

function quotePremium(items: Item[], yearsWithMHPCO: number, isFollowUp: boolean): number {
  const base = basePremium(items);
  const loyalty = yearsWithMHPCO >= LOYALTY_YEARS ? base * LOYALTY_RATE : 0;
  const followUp = isFollowUp ? base * FOLLOW_UP_RATE : 0;
  return Math.ceil(
    base + itemRiskSurcharge(items) + base * INITIAL_ASSESSMENT_RATE - loyalty - followUp + PROCESSING_FEE,
  );
}

function policyCap(items: Item[]): number {
  const insuranceSum = items.reduce((sum, item) => sum + (INSURANCE_VALUE[item.type] ?? 0), 0);
  return insuranceSum * CAP_MULTIPLIER;
}

interface PolicyState {
  items: Item[];
  remainingCap: number;
}

function damageReimbursement(item: Item, amount: number): number {
  const reimbursementRate = (item.enchantment ?? 0) >= CLAIM_ENCHANTMENT_LEVEL
    ? HIGH_ENCHANTMENT_REIMBURSEMENT_RATE
    : 1;
  return Math.max(0, amount * reimbursementRate - DEDUCTIBLE);
}

function matchDamageItems(items: Item[], incident: Incident): Item[] {
  const matchedCount: Record<string, number> = {};
  return incident.damages.map((damage) => {
    const sameType = items.filter((item) => item.type === damage.itemType);
    const matchIndex = matchedCount[damage.itemType] ?? 0;
    matchedCount[damage.itemType] = matchIndex + 1;
    const matched = sameType[matchIndex];
    if (!matched) throw new Error("Damage item is not insured");
    return matched;
  });
}

function validateIncident(incident: Incident): void {
  if (incident.damages.some((damage) => damage.amount < 0)) {
    throw new Error("Damage amount cannot be negative");
  }
}

function processClaim(policy: PolicyState, incident: Incident): { payout: number; remainingCap: number } {
  validateIncident(incident);
  const matchedItems = matchDamageItems(policy.items, incident);
  const desired = incident.damages.reduce((sum, damage, index) => {
    return sum + damageReimbursement(matchedItems[index], damage.amount);
  }, 0);
  const payout = Math.floor(Math.min(desired, policy.remainingCap));
  policy.remainingCap -= payout;
  return { payout, remainingCap: policy.remainingCap };
}

export function runScenario(scenario: Scenario): ScenarioResult {
  let quoteCount = 0;
  const policies = new Map<number, PolicyState>();
  const results = scenario.steps.map((step, stepIndex) => {
    if (step.op === "claim") {
      const policy = policies.get(step.policy ?? -1) ?? { items: [], remainingCap: 0 };
      return processClaim(policy, step.incident ?? { cause: "", damages: [] });
    }
    const items = step.items ?? [];
    const unknown = items.find((item) => BASE_PREMIUM[item.type] === undefined);
    if (unknown) throw new Error(`Unknown item type: ${unknown.type}`);
    policies.set(stepIndex, { items, remainingCap: policyCap(items) });
    const premium = quotePremium(items, scenario.customer.yearsWithMHPCO, quoteCount > 0);
    quoteCount += 1;
    return { premium };
  });
  return { results };
}
