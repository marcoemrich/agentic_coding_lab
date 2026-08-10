export const ITEM_TYPES = [
  'sword',
  'amulet',
  'staff',
  'potion',
  'rune',
  'moonstone',
] as const;

export type ItemType = (typeof ITEM_TYPES)[number];

export interface Item {
  type: ItemType;
  material?: string;
  enchantment?: number;
  cursed?: boolean;
}

export interface Damage {
  itemType: string;
  amount: number;
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
  customer: { yearsWithMHPCO: number };
  steps: Array<QuoteStep | ClaimStep>;
}

export type Result = { premium: number } | { payout: number; remainingCap: number };

interface Price {
  value: number;
  premium: number;
}

interface Policy {
  items: Item[];
  remainingCap: number;
}

const PRICES: Record<ItemType, Price> = {
  sword: { value: 1000, premium: 100 },
  amulet: { value: 600, premium: 60 },
  staff: { value: 800, premium: 80 },
  potion: { value: 400, premium: 40 },
  rune: { value: 250, premium: 25 },
  moonstone: { value: 250, premium: 25 },
};

const COMPONENT_TYPES = new Set<ItemType>(['rune', 'moonstone']);
const COMPONENT_BLOCK_SIZE = 3;
const COMPONENT_BLOCK_PREMIUM = 60;
const CURSE_RATE = 0.5;
const ENCHANTMENT_RATE = 0.3;
const LOYALTY_RATE = 0.2;
const ASSESSMENT_RATE = 0.1;
const FOLLOW_UP_RATE = 0.15;
const PROCESSING_FEE = 5;
const LOYALTY_YEARS = 2;
const PREMIUM_ENCHANTMENT = 5;
const CLAIM_ENCHANTMENT = 8;
const DEDUCTIBLE = 100;
const POLICY_CAP_MULTIPLIER = 2;
const HIGH_ENCHANTMENT_REIMBURSEMENT = 0.5;

function isItemType(value: unknown): value is ItemType {
  return typeof value === 'string' && (ITEM_TYPES as readonly string[]).includes(value);
}

function requireRecord(value: unknown, description: string): asserts value is Record<string, unknown> {
  if (typeof value !== 'object' || value === null || Array.isArray(value)) {
    throw new Error(`${description} must be an object`);
  }
}

function requireInteger(value: unknown, description: string): asserts value is number {
  if (!Number.isInteger(value)) throw new Error(`${description} must be an integer`);
}

function validateItem(value: unknown): asserts value is Item {
  requireRecord(value, 'item');
  if (!isItemType(value.type)) throw new Error(`unknown item type: ${String(value.type)}`);
  if (value.enchantment !== undefined) requireInteger(value.enchantment, 'enchantment');
  if (value.material !== undefined && typeof value.material !== 'string') throw new Error('material must be a string');
  if (value.cursed !== undefined && typeof value.cursed !== 'boolean') throw new Error('cursed must be a boolean');
}

function validateQuote(value: Record<string, unknown>): asserts value is Record<string, unknown> & QuoteStep {
  if (!Array.isArray(value.items)) throw new Error('quote items must be an array');
  value.items.forEach(validateItem);
}

function validateDamage(value: unknown): asserts value is Damage {
  requireRecord(value, 'damage');
  if (typeof value.itemType !== 'string') throw new Error('damage itemType must be a string');
  requireInteger(value.amount, 'damage amount');
  if (value.amount < 0) throw new Error('damage amount cannot be negative');
}

function validateClaim(value: Record<string, unknown>): asserts value is Record<string, unknown> & ClaimStep {
  requireInteger(value.policy, 'policy');
  requireRecord(value.incident, 'incident');
  if (typeof value.incident.cause !== 'string') throw new Error('incident cause must be a string');
  if (!Array.isArray(value.incident.damages)) throw new Error('incident damages must be an array');
  value.incident.damages.forEach(validateDamage);
}

export function parseScenario(value: unknown): Scenario {
  requireRecord(value, 'scenario');
  requireRecord(value.customer, 'customer');
  requireInteger(value.customer.yearsWithMHPCO, 'yearsWithMHPCO');
  if (!Array.isArray(value.steps)) throw new Error('steps must be an array');
  for (const step of value.steps) {
    requireRecord(step, 'step');
    if (step.op === 'quote') validateQuote(step);
    else if (step.op === 'claim') validateClaim(step);
    else throw new Error(`unknown operation: ${String(step.op)}`);
  }
  return value as unknown as Scenario;
}

function premiumsByItem(items: Item[]): number[] {
  const counts = new Map<ItemType, number>();
  for (const item of items) counts.set(item.type, (counts.get(item.type) ?? 0) + 1);
  return items.map((item) => {
    const isBlock = COMPONENT_TYPES.has(item.type) && counts.get(item.type) === COMPONENT_BLOCK_SIZE;
    return isBlock ? COMPONENT_BLOCK_PREMIUM / COMPONENT_BLOCK_SIZE : PRICES[item.type].premium;
  });
}

export function quotePremium(items: Item[], years: number, quoteNumber: number): number {
  const itemPremiums = premiumsByItem(items);
  const base = itemPremiums.reduce((sum, premium) => sum + premium, 0);
  const curse = items.reduce((sum, item, index) => sum + (item.cursed ? itemPremiums[index] * CURSE_RATE : 0), 0);
  const enchantment = items.reduce((sum, item, index) =>
    sum + ((item.enchantment ?? 0) >= PREMIUM_ENCHANTMENT ? itemPremiums[index] * ENCHANTMENT_RATE : 0), 0);
  const loyalty = years >= LOYALTY_YEARS ? base * LOYALTY_RATE : 0;
  const followUp = quoteNumber > 0 ? base * FOLLOW_UP_RATE : 0;
  return Math.ceil(base + curse + enchantment - loyalty + base * ASSESSMENT_RATE - followUp + PROCESSING_FEE);
}

function createPolicy(items: Item[]): Policy {
  const insuranceSum = items.reduce((sum, item) => sum + PRICES[item.type].value, 0);
  return { items: items.map((item) => ({ ...item })), remainingCap: insuranceSum * POLICY_CAP_MULTIPLIER };
}

function matchDamages(policy: Policy, damages: Damage[]): Array<{ item: Item; damage: Damage }> {
  const available = new Map<ItemType, Item[]>();
  for (const item of policy.items) available.set(item.type, [...(available.get(item.type) ?? []), item]);
  return damages.map((damage) => {
    if (!isItemType(damage.itemType)) throw new Error(`unknown damaged item type: ${damage.itemType}`);
    const candidates = available.get(damage.itemType);
    const item = candidates?.shift();
    if (!item) throw new Error(`item is not covered by policy: ${damage.itemType}`);
    return { item, damage };
  });
}

function reimbursement(item: Item, amount: number): number {
  const adjusted = (item.enchantment ?? 0) >= CLAIM_ENCHANTMENT
    ? amount * HIGH_ENCHANTMENT_REIMBURSEMENT
    : amount;
  return Math.max(0, adjusted - DEDUCTIBLE);
}

function processClaim(policy: Policy, damages: Damage[]): { payout: number; remainingCap: number } {
  const matched = matchDamages(policy, damages);
  const rawPayout = matched.reduce((sum, entry) => sum + reimbursement(entry.item, entry.damage.amount), 0);
  const payout = Math.min(Math.floor(rawPayout), policy.remainingCap);
  policy.remainingCap -= payout;
  return { payout, remainingCap: policy.remainingCap };
}

export function processScenario(scenario: Scenario): { results: Result[] } {
  const policies = new Map<number, Policy>();
  const results: Result[] = [];
  let quoteNumber = 0;
  scenario.steps.forEach((step, stepIndex) => {
    if (step.op === 'quote') {
      results.push({ premium: quotePremium(step.items, scenario.customer.yearsWithMHPCO, quoteNumber) });
      policies.set(stepIndex, createPolicy(step.items));
      quoteNumber += 1;
      return;
    }
    const policy = policies.get(step.policy);
    if (!policy) throw new Error(`policy ${step.policy} does not refer to an earlier quote`);
    results.push(processClaim(policy, step.incident.damages));
  });
  return { results };
}
