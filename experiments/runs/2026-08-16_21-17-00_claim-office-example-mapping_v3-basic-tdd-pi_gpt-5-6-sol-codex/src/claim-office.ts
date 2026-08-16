export const ITEM_TYPES = ['sword', 'amulet', 'staff', 'potion', 'rune', 'moonstone'] as const;
export type ItemType = typeof ITEM_TYPES[number];

export interface Item {
  type: ItemType;
  material?: string;
  enchantment?: number;
  cursed?: boolean;
}

export interface Scenario {
  customer: { yearsWithMHPCO: number };
  steps: unknown[];
}

export type OperationResult = { premium: number } | { payout: number; remainingCap: number };

interface Policy {
  items: Item[];
  remainingCap: number;
}

const MAIN_PRICES: Record<string, { value: number; premium: number }> = {
  sword: { value: 1000, premium: 100 },
  amulet: { value: 600, premium: 60 },
  staff: { value: 800, premium: 80 },
  potion: { value: 400, premium: 40 },
};
const COMPONENT_VALUE = 250;
const COMPONENT_PREMIUM = 25;
const BLOCK_SIZE = 3;
const BLOCK_PREMIUM_PER_ITEM = 20;
const PROCESSING_FEE = 5;
const CURSE_RATE = 0.5;
const ENCHANTMENT_RATE = 0.3;
const HIGH_PREMIUM_ENCHANTMENT = 5;
const HIGH_CLAIM_ENCHANTMENT = 8;
const REDUCED_REIMBURSEMENT_RATE = 0.5;
const LOYALTY_YEARS = 2;
const LOYALTY_RATE = 0.2;
const INITIAL_RATE = 0.1;
const FOLLOW_UP_RATE = 0.15;
const DEDUCTIBLE = 100;
const CAP_MULTIPLIER = 2;

function record(value: unknown, description: string): Record<string, unknown> {
  if (typeof value !== 'object' || value === null || Array.isArray(value)) {
    throw new Error(`${description} must be an object`);
  }
  return value as Record<string, unknown>;
}

function integer(value: unknown, description: string): number {
  if (!Number.isInteger(value)) throw new Error(`${description} must be an integer`);
  return value as number;
}

function isItemType(value: unknown): value is ItemType {
  return typeof value === 'string' && (ITEM_TYPES as readonly string[]).includes(value);
}

function parseItem(value: unknown): Item {
  const input = record(value, 'item');
  if (!isItemType(input.type)) throw new Error(`Unknown item type: ${String(input.type)}`);
  if (input.enchantment !== undefined) integer(input.enchantment, 'enchantment');
  if (input.material !== undefined && typeof input.material !== 'string') throw new Error('material must be a string');
  if (input.cursed !== undefined && typeof input.cursed !== 'boolean') throw new Error('cursed must be a boolean');
  return {
    type: input.type,
    ...(input.material === undefined ? {} : { material: input.material as string }),
    ...(input.enchantment === undefined ? {} : { enchantment: input.enchantment as number }),
    ...(input.cursed === undefined ? {} : { cursed: input.cursed as boolean }),
  };
}

function isComponent(type: ItemType): boolean {
  return type === 'rune' || type === 'moonstone';
}

function componentCounts(items: Item[]): Map<ItemType, number> {
  const counts = new Map<ItemType, number>();
  for (const item of items) {
    if (isComponent(item.type)) counts.set(item.type, (counts.get(item.type) ?? 0) + 1);
  }
  return counts;
}

function itemBasePremium(item: Item, counts: Map<ItemType, number>): number {
  const mainPrice = MAIN_PRICES[item.type];
  if (mainPrice) return mainPrice.premium;
  return counts.get(item.type) === BLOCK_SIZE ? BLOCK_PREMIUM_PER_ITEM : COMPONENT_PREMIUM;
}

export function calculatePremium(items: Item[], yearsWithMHPCO: number, previousQuotes: number): number {
  const counts = componentCounts(items);
  let base = 0;
  let itemSurcharges = 0;
  for (const item of items) {
    const itemBase = itemBasePremium(item, counts);
    base += itemBase;
    if (item.cursed) itemSurcharges += itemBase * CURSE_RATE;
    if ((item.enchantment ?? 0) >= HIGH_PREMIUM_ENCHANTMENT) itemSurcharges += itemBase * ENCHANTMENT_RATE;
  }
  const loyalty = yearsWithMHPCO >= LOYALTY_YEARS ? base * LOYALTY_RATE : 0;
  const followUp = previousQuotes > 0 ? base * FOLLOW_UP_RATE : 0;
  return Math.ceil(base + itemSurcharges + base * INITIAL_RATE - loyalty - followUp + PROCESSING_FEE);
}

function insuranceValue(item: Item): number {
  return MAIN_PRICES[item.type]?.value ?? COMPONENT_VALUE;
}

function createPolicy(items: Item[]): Policy {
  const insuranceSum = items.reduce((sum, item) => sum + insuranceValue(item), 0);
  return { items, remainingCap: insuranceSum * CAP_MULTIPLIER };
}

function parseDamages(value: unknown): Array<{ itemType: ItemType; amount: number }> {
  if (!Array.isArray(value)) throw new Error('damages must be an array');
  return value.map((damageValue) => {
    const damage = record(damageValue, 'damage');
    if (!isItemType(damage.itemType)) throw new Error(`Unknown item type: ${String(damage.itemType)}`);
    const amount = integer(damage.amount, 'damage amount');
    if (amount < 0) throw new Error('damage amount cannot be negative');
    return { itemType: damage.itemType, amount };
  });
}

function matchDamages(policy: Policy, damages: Array<{ itemType: ItemType; amount: number }>): Item[] {
  const used = new Map<ItemType, number>();
  return damages.map(({ itemType }) => {
    const matches = policy.items.filter((item) => item.type === itemType);
    const occurrence = used.get(itemType) ?? 0;
    const matched = matches[occurrence];
    if (!matched) throw new Error(`Damage references uninsured item: ${itemType}`);
    used.set(itemType, occurrence + 1);
    return matched;
  });
}

function desiredPayout(item: Item, amount: number): number {
  const reimbursement = (item.enchantment ?? 0) >= HIGH_CLAIM_ENCHANTMENT
    ? amount * REDUCED_REIMBURSEMENT_RATE
    : amount;
  return Math.max(0, reimbursement - DEDUCTIBLE);
}

function processClaim(step: Record<string, unknown>, policies: Map<number, Policy>) {
  const policyIndex = integer(step.policy, 'policy');
  const policy = policies.get(policyIndex);
  if (!policy) throw new Error('Claim must reference an earlier quote policy');
  const incident = record(step.incident, 'incident');
  if (typeof incident.cause !== 'string') throw new Error('incident cause must be a string');
  const damages = parseDamages(incident.damages);
  const matchedItems = matchDamages(policy, damages);
  const desired = damages.reduce((sum, damage, index) => sum + desiredPayout(matchedItems[index], damage.amount), 0);
  const payout = Math.floor(Math.min(desired, policy.remainingCap));
  policy.remainingCap -= payout;
  return { payout, remainingCap: policy.remainingCap };
}

export function processScenario(value: unknown): { results: OperationResult[] } {
  const scenario = record(value, 'scenario');
  const customerInput = record(scenario.customer, 'customer');
  const years = integer(customerInput.yearsWithMHPCO, 'yearsWithMHPCO');
  if (!Array.isArray(scenario.steps)) throw new Error('steps must be an array');
  const results: OperationResult[] = [];
  const policies = new Map<number, Policy>();
  let previousQuotes = 0;
  scenario.steps.forEach((stepValue, stepIndex) => {
    const step = record(stepValue, 'step');
    if (step.op === 'quote') {
      if (!Array.isArray(step.items)) throw new Error('items must be an array');
      const items = step.items.map(parseItem);
      results.push({ premium: calculatePremium(items, years, previousQuotes) });
      policies.set(stepIndex, createPolicy(items));
      previousQuotes += 1;
    } else if (step.op === 'claim') {
      results.push(processClaim(step, policies));
    } else {
      throw new Error(`Unknown operation: ${String(step.op)}`);
    }
  });
  return { results };
}
