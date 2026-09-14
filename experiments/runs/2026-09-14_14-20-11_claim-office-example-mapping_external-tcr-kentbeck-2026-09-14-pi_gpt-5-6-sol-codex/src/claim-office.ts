export interface InsuredItem {
  type: string;
  material?: string;
  enchantment?: number;
  cursed?: boolean;
}

const BASE_PREMIUM: Readonly<Record<string, number>> = {
  sword: 100,
  amulet: 60,
  staff: 80,
  potion: 40,
  rune: 25,
  moonstone: 25,
};

const COMPONENT_TYPES = ['rune', 'moonstone'] as const;
const BLOCK_SIZE = 3;
const BLOCK_PREMIUM = 60;
const CURSE_RATE = 0.5;
const HIGH_ENCHANTMENT_RATE = 0.3;
const HIGH_ENCHANTMENT = 5;
const LOYALTY_RATE = 0.2;
const INITIAL_RATE = 0.1;
const FOLLOW_UP_RATE = 0.15;
const LOYAL_YEARS = 2;
const PROCESSING_FEE = 5;
const DEDUCTIBLE = 100;
const SEVERE_ENCHANTMENT = 8;
const PARTIAL_REIMBURSEMENT = 0.5;
const CAP_MULTIPLIER = 2;

const INSURANCE_VALUE: Readonly<Record<string, number>> = {
  sword: 1000,
  amulet: 600,
  staff: 800,
  potion: 400,
  rune: 250,
  moonstone: 250,
};

export interface Damage {
  itemType: string;
  amount: number;
}

export interface Policy {
  items: InsuredItem[];
  remainingCap: number;
}

export interface Scenario {
  customer: { yearsWithMHPCO: number };
  steps: Array<
    | { op: 'quote'; items: InsuredItem[] }
    | { op: 'claim'; policy: number; incident: { cause: string; damages: Damage[] } }
  >;
}

export type OperationResult =
  | { premium: number }
  | { payout: number; remainingCap: number };

type JsonObject = Record<string, unknown>;

function isObject(value: unknown): value is JsonObject {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function assertItem(value: unknown): asserts value is InsuredItem {
  if (!isObject(value) || typeof value.type !== 'string') throw new Error('Invalid insured item');
  if (value.material !== undefined && typeof value.material !== 'string') throw new Error('Invalid item material');
  if (value.enchantment !== undefined && !Number.isInteger(value.enchantment)) throw new Error('Invalid enchantment');
  if (value.cursed !== undefined && typeof value.cursed !== 'boolean') throw new Error('Invalid cursed flag');
}

function assertDamage(value: unknown): asserts value is Damage {
  if (!isObject(value) || typeof value.itemType !== 'string' || !Number.isInteger(value.amount)) {
    throw new Error('Invalid damage entry');
  }
}

function assertStep(value: unknown): void {
  if (!isObject(value)) throw new Error('Invalid scenario step');
  if (value.op === 'quote' && Array.isArray(value.items)) return value.items.forEach(assertItem);
  if (value.op !== 'claim' || !Number.isInteger(value.policy) || !isObject(value.incident)) {
    throw new Error('Invalid scenario step');
  }
  if (typeof value.incident.cause !== 'string' || !Array.isArray(value.incident.damages)) {
    throw new Error('Invalid incident');
  }
  value.incident.damages.forEach(assertDamage);
}

export function assertScenario(value: unknown): asserts value is Scenario {
  if (!isObject(value) || !isObject(value.customer) || !Number.isInteger(value.customer.yearsWithMHPCO)) {
    throw new Error('Invalid customer');
  }
  if (!Array.isArray(value.steps)) throw new Error('Invalid steps');
  value.steps.forEach(assertStep);
}

function assertKnownItems(items: InsuredItem[]): void {
  const unknown = items.find((item) => BASE_PREMIUM[item.type] === undefined);
  if (unknown) throw new Error(`Unknown item type: ${unknown.type}`);
}

export function basePremium(items: InsuredItem[]): number {
  assertKnownItems(items);
  const regularTotal = items.reduce((total, item) => total + BASE_PREMIUM[item.type], 0);
  const blockDiscount = COMPONENT_TYPES.reduce((discount, type) => {
    const count = items.filter((item) => item.type === type).length;
    return discount + (count === BLOCK_SIZE ? BLOCK_SIZE * BASE_PREMIUM[type] - BLOCK_PREMIUM : 0);
  }, 0);
  return regularTotal - blockDiscount;
}

function itemPremiumBase(item: InsuredItem, items: InsuredItem[]): number {
  const isDiscountedBlock = COMPONENT_TYPES.some(
    (type) => item.type === type && items.filter((candidate) => candidate.type === type).length === BLOCK_SIZE,
  );
  return isDiscountedBlock ? BLOCK_PREMIUM / BLOCK_SIZE : BASE_PREMIUM[item.type] ?? 0;
}

export function quotePremium(items: InsuredItem[], yearsWithMHPCO: number, previousContracts = 0): number {
  const base = basePremium(items);
  const risk = items.reduce((total, item) => {
    const itemBase = itemPremiumBase(item, items);
    const curse = item.cursed ? itemBase * CURSE_RATE : 0;
    const enchantment = (item.enchantment ?? 0) >= HIGH_ENCHANTMENT ? itemBase * HIGH_ENCHANTMENT_RATE : 0;
    return total + curse + enchantment;
  }, 0);
  const loyalty = yearsWithMHPCO >= LOYAL_YEARS ? base * LOYALTY_RATE : 0;
  const followUp = previousContracts > 0 ? base * FOLLOW_UP_RATE : 0;
  return Math.ceil(base + risk - loyalty + base * INITIAL_RATE - followUp + PROCESSING_FEE);
}

export function createPolicy(items: InsuredItem[]): Policy {
  assertKnownItems(items);
  const insuranceSum = items.reduce((sum, item) => sum + INSURANCE_VALUE[item.type], 0);
  return { items: items.map((item) => ({ ...item })), remainingCap: insuranceSum * CAP_MULTIPLIER };
}

function reimbursement(item: InsuredItem, amount: number): number {
  const factor = (item.enchantment ?? 0) >= SEVERE_ENCHANTMENT ? PARTIAL_REIMBURSEMENT : 1;
  return Math.max(0, amount * factor - DEDUCTIBLE);
}

export function processClaim(policy: Policy, damages: Damage[]): { payout: number; remainingCap: number } {
  const available = [...policy.items];
  const desired = damages.reduce((sum, damage) => {
    if (damage.amount < 0) throw new Error(`Damage amount cannot be negative: ${damage.amount}`);
    const index = available.findIndex((item) => item.type === damage.itemType);
    if (index < 0) throw new Error(`Damage item is not covered: ${damage.itemType}`);
    const [item] = available.splice(index, 1);
    return sum + reimbursement(item, damage.amount);
  }, 0);
  const payout = Math.min(Math.floor(desired), policy.remainingCap);
  policy.remainingCap -= payout;
  return { payout, remainingCap: policy.remainingCap };
}

export function processScenario(scenario: Scenario): { results: OperationResult[] } {
  assertScenario(scenario);
  const policies = new Map<number, Policy>();
  const results: OperationResult[] = [];
  let previousContracts = 0;
  scenario.steps.forEach((step, stepIndex) => {
    if (step.op === 'quote') {
      results.push({ premium: quotePremium(step.items, scenario.customer.yearsWithMHPCO, previousContracts) });
      policies.set(stepIndex, createPolicy(step.items));
      previousContracts += 1;
      return;
    }
    const policy = policies.get(step.policy);
    if (!policy) throw new Error(`Policy does not reference an earlier quote: ${step.policy}`);
    results.push(processClaim(policy, step.incident.damages));
  });
  return { results };
}
