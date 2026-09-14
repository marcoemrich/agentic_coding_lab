export interface Item {
  type: string;
  material?: string;
  enchantment?: number;
  cursed?: boolean;
}

export interface Customer {
  yearsWithMHPCO: number;
}

const MAIN_PREMIUM: Record<string, number> = {
  sword: 100,
  amulet: 60,
  staff: 80,
  potion: 40,
};
const COMPONENT_TYPES = new Set(['rune', 'moonstone']);
const COMPONENT_PREMIUM = 25;
const COMPONENT_BLOCK_PREMIUM = 60;
const BLOCK_SIZE = 3;
const CURSE_PERCENT = 50;
const ENCHANTMENT_PERCENT = 30;
const ENCHANTMENT_THRESHOLD = 5;
const LOYALTY_PERCENT = 20;
const LOYALTY_YEARS = 2;
const ASSESSMENT_PERCENT = 10;
const FOLLOW_UP_PERCENT = 15;
const PERCENT_DENOMINATOR = 100;
const PROCESSING_FEE = 5;
const MAIN_VALUES: Record<string, number> = {
  sword: 1000,
  amulet: 600,
  staff: 800,
  potion: 400,
};
const COMPONENT_VALUE = 250;
const CAP_MULTIPLIER = 2;
const HIGH_ENCHANTMENT_CLAIM_THRESHOLD = 8;
const HIGH_ENCHANTMENT_REIMBURSEMENT = 0.5;
const DEDUCTIBLE = 100;

export interface Policy {
  items: Item[];
  remainingCap: number;
}

export interface Damage {
  itemType: string;
  amount: number;
}

function insuranceValue(item: Item): number {
  const mainValue = MAIN_VALUES[item.type];
  if (mainValue !== undefined) return mainValue;
  if (COMPONENT_TYPES.has(item.type)) return COMPONENT_VALUE;
  throw new Error(`Unknown item type: ${item.type}`);
}

export function createPolicy(items: Item[]): Policy {
  const sum = items.reduce((total, item) => total + insuranceValue(item), 0);
  return { items: items.map((item) => ({ ...item })), remainingCap: sum * CAP_MULTIPLIER };
}

function reimbursement(item: Item, amount: number): number {
  const eligible = (item.enchantment ?? 0) >= HIGH_ENCHANTMENT_CLAIM_THRESHOLD
    ? amount * HIGH_ENCHANTMENT_REIMBURSEMENT
    : amount;
  return Math.max(0, eligible - DEDUCTIBLE);
}

function coveredItems(policy: Policy, damages: Damage[]): Item[] {
  const available = policy.items.map((item) => ({ item, used: false }));
  return damages.map((damage) => {
    if (!Number.isInteger(damage.amount) || damage.amount < 0) {
      throw new Error(`Invalid damage amount: ${damage.amount}`);
    }
    const covered = available.find((entry) => !entry.used && entry.item.type === damage.itemType);
    if (!covered) throw new Error(`Damaged item is not covered: ${damage.itemType}`);
    covered.used = true;
    return covered.item;
  });
}

export function processClaim(policy: Policy, damages: Damage[]): { payout: number; remainingCap: number } {
  const items = coveredItems(policy, damages);
  const desired = damages.reduce(
    (total, damage, index) => total + reimbursement(items[index], damage.amount),
    0,
  );
  const payout = Math.min(Math.floor(desired), policy.remainingCap);
  policy.remainingCap -= payout;
  return { payout, remainingCap: policy.remainingCap };
}

function componentCounts(items: Item[]): Map<string, number> {
  const counts = new Map<string, number>();
  for (const item of items) {
    if (COMPONENT_TYPES.has(item.type)) {
      counts.set(item.type, (counts.get(item.type) ?? 0) + 1);
    }
  }
  return counts;
}

function itemBase(item: Item, counts: Map<string, number>): number {
  const mainPremium = MAIN_PREMIUM[item.type];
  if (mainPremium !== undefined) return mainPremium;
  if (!COMPONENT_TYPES.has(item.type)) throw new Error(`Unknown item type: ${item.type}`);
  return counts.get(item.type) === BLOCK_SIZE
    ? COMPONENT_BLOCK_PREMIUM / BLOCK_SIZE
    : COMPONENT_PREMIUM;
}

function itemSurchargePercent(item: Item): number {
  let percent = 0;
  if (item.cursed) percent += CURSE_PERCENT;
  if ((item.enchantment ?? 0) >= ENCHANTMENT_THRESHOLD) percent += ENCHANTMENT_PERCENT;
  return percent;
}

export interface QuoteStep {
  op: 'quote';
  items: Item[];
}

export interface ClaimStep {
  op: 'claim';
  policy: number;
  incident: { cause: string; damages: Damage[] };
}

export interface Scenario {
  customer: Customer;
  steps: Array<QuoteStep | ClaimStep>;
}

export type Result = { premium: number } | { payout: number; remainingCap: number };

export function quotePremium(customer: Customer, items: Item[], priorQuotes = 0): number {
  const counts = componentCounts(items);
  const bases = items.map((item) => itemBase(item, counts));
  const base = bases.reduce((sum, value) => sum + value, 0);
  const surcharges = items.reduce(
    (sum, item, index) => sum + bases[index] * itemSurchargePercent(item),
    0,
  );
  const loyalty = customer.yearsWithMHPCO >= LOYALTY_YEARS ? base * LOYALTY_PERCENT : 0;
  const followUp = priorQuotes > 0 ? base * FOLLOW_UP_PERCENT : 0;
  const hundredths = base * PERCENT_DENOMINATOR + surcharges - loyalty
    + base * ASSESSMENT_PERCENT - followUp + PROCESSING_FEE * PERCENT_DENOMINATOR;
  return Math.ceil(hundredths / PERCENT_DENOMINATOR);
}

export function processScenario(scenario: Scenario): { results: Result[] } {
  if (!scenario || !scenario.customer || !Array.isArray(scenario.steps)) {
    throw new Error('Invalid scenario');
  }
  if (!Number.isInteger(scenario.customer.yearsWithMHPCO)) {
    throw new Error('Invalid customer yearsWithMHPCO');
  }
  const policies = new Map<number, Policy>();
  const results: Result[] = [];
  let quoteCount = 0;
  scenario.steps.forEach((step, index) => {
    if (step.op === 'quote') {
      if (!Array.isArray(step.items)) throw new Error('Quote items must be an array');
      const premium = quotePremium(scenario.customer, step.items, quoteCount);
      policies.set(index, createPolicy(step.items));
      results.push({ premium });
      quoteCount += 1;
      return;
    }
    if (step.op !== 'claim') throw new Error('Unknown operation');
    const policy = policies.get(step.policy);
    if (!policy) throw new Error(`Invalid policy reference: ${step.policy}`);
    if (!step.incident || !Array.isArray(step.incident.damages)) {
      throw new Error('Invalid claim incident');
    }
    results.push(processClaim(policy, step.incident.damages));
  });
  return { results };
}
