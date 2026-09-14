export type Item = {
  type: string;
  material?: string;
  enchantment?: number;
  cursed?: boolean;
};

const PRICE_LIST: Record<string, { value: number; premium: number }> = {
  sword: { value: 1000, premium: 100 },
  amulet: { value: 600, premium: 60 },
  staff: { value: 800, premium: 80 },
  potion: { value: 400, premium: 40 },
  rune: { value: 250, premium: 25 },
  moonstone: { value: 250, premium: 25 },
};

export function itemPrice(item: Item): { value: number; premium: number } {
  const price = PRICE_LIST[item.type];
  if (!price) throw new Error(`Unknown item type: ${item.type}`);
  return price;
}

const COMPONENT_TYPES = new Set(['rune', 'moonstone']);
const BLOCK_SIZE = 3;
const BLOCK_PREMIUM = 60;
const CURSE_PERCENT = 50;
const ENCHANTMENT_PERCENT = 30;
const LOYALTY_PERCENT = 20;
const LOYALTY_YEARS = 2;
const ASSESSMENT_PERCENT = 10;
const FOLLOW_UP_PERCENT = 15;
const ENCHANTMENT_THRESHOLD = 5;
const PROCESSING_FEE = 5;
const CLAIM_ENCHANTMENT_THRESHOLD = 8;
const HIGH_ENCHANTMENT_REIMBURSEMENT = 0.5;
const DEDUCTIBLE = 100;
const CAP_MULTIPLIER = 2;
const PERCENT = 100;

function componentCounts(items: Item[]): Map<string, number> {
  const counts = new Map<string, number>();
  for (const item of items) {
    if (COMPONENT_TYPES.has(item.type)) counts.set(item.type, (counts.get(item.type) ?? 0) + 1);
  }
  return counts;
}

function premiumBases(items: Item[]): number[] {
  const counts = componentCounts(items);
  return items.map((item) => {
    const standard = itemPrice(item).premium;
    return counts.get(item.type) === BLOCK_SIZE ? BLOCK_PREMIUM / BLOCK_SIZE : standard;
  });
}

export function quotePremium(items: Item[], yearsWithMHPCO: number, previousContracts = 0): number {
  const bases = premiumBases(items);
  const baseTotal = bases.reduce((sum, base) => sum + base, 0);
  let policyPercentage = ASSESSMENT_PERCENT;
  if (yearsWithMHPCO >= LOYALTY_YEARS) policyPercentage -= LOYALTY_PERCENT;
  if (previousContracts > 0) policyPercentage -= FOLLOW_UP_PERCENT;

  const itemModifiers = items.reduce((sum, item, index) => {
    const curse = item.cursed ? CURSE_PERCENT : 0;
    const enchanted = (item.enchantment ?? 0) >= ENCHANTMENT_THRESHOLD ? ENCHANTMENT_PERCENT : 0;
    return sum + bases[index] * (curse + enchanted) / PERCENT;
  }, 0);
  return Math.ceil(baseTotal + itemModifiers + baseTotal * policyPercentage / PERCENT + PROCESSING_FEE);
}

export type Damage = { itemType: string; amount: number };
export type Policy = { items: Item[]; remainingCap: number };

export function createPolicy(items: Item[]): Policy {
  const insuranceSum = items.reduce((sum, item) => sum + itemPrice(item).value, 0);
  return { items: items.map((item) => ({ ...item })), remainingCap: insuranceSum * CAP_MULTIPLIER };
}

function itemsByType(items: Item[]): Map<string, Item[]> {
  const grouped = new Map<string, Item[]>();
  for (const item of items) grouped.set(item.type, [...(grouped.get(item.type) ?? []), item]);
  return grouped;
}

function damagePayout(item: Item, amount: number): number {
  if (amount < 0) throw new Error('Damage amount cannot be negative');
  const reimbursement = (item.enchantment ?? 0) >= CLAIM_ENCHANTMENT_THRESHOLD
    ? amount * HIGH_ENCHANTMENT_REIMBURSEMENT
    : amount;
  return Math.max(0, reimbursement - DEDUCTIBLE);
}

export function processClaim(policy: Policy, damages: Damage[]): { payout: number; remainingCap: number } {
  const available = itemsByType(policy.items);
  let desiredPayout = 0;
  for (const damage of damages) {
    const matchingItems = available.get(damage.itemType);
    const item = matchingItems?.shift();
    if (!item) throw new Error(`Damage item is not covered by policy: ${damage.itemType}`);
    desiredPayout += damagePayout(item, damage.amount);
  }
  const payout = Math.min(Math.floor(desiredPayout), policy.remainingCap);
  policy.remainingCap -= payout;
  return { payout, remainingCap: policy.remainingCap };
}

export type Result = { premium: number } | { payout: number; remainingCap: number };

type JsonObject = Record<string, unknown>;

function object(value: unknown, name: string): JsonObject {
  if (typeof value !== 'object' || value === null || Array.isArray(value)) throw new Error(`${name} must be an object`);
  return value as JsonObject;
}

function integer(value: unknown, name: string): number {
  if (!Number.isInteger(value)) throw new Error(`${name} must be an integer`);
  return value as number;
}

function readItem(value: unknown): Item {
  const input = object(value, 'item');
  if (typeof input.type !== 'string') throw new Error('Item type must be a string');
  if (input.enchantment !== undefined) integer(input.enchantment, 'Item enchantment');
  if (input.material !== undefined && typeof input.material !== 'string') throw new Error('Item material must be a string');
  if (input.cursed !== undefined && typeof input.cursed !== 'boolean') throw new Error('Item cursed must be a boolean');
  return input as Item;
}

function readDamages(value: unknown): Damage[] {
  if (!Array.isArray(value)) throw new Error('Incident damages must be an array');
  return value.map((entry) => {
    const damage = object(entry, 'damage');
    if (typeof damage.itemType !== 'string') throw new Error('Damage itemType must be a string');
    return { itemType: damage.itemType, amount: integer(damage.amount, 'Damage amount') };
  });
}

export function runScenario(value: unknown): { results: Result[] } {
  const scenario = object(value, 'Scenario');
  const customer = object(scenario.customer, 'Customer');
  const years = integer(customer.yearsWithMHPCO, 'Customer yearsWithMHPCO');
  if (!Array.isArray(scenario.steps)) throw new Error('Scenario steps must be an array');

  const policies = new Map<number, Policy>();
  const results: Result[] = [];
  let contractCount = 0;
  scenario.steps.forEach((rawStep, stepIndex) => {
    const step = object(rawStep, 'Step');
    if (step.op === 'quote') {
      if (!Array.isArray(step.items)) throw new Error('Quote items must be an array');
      const items = step.items.map(readItem);
      results.push({ premium: quotePremium(items, years, contractCount) });
      policies.set(stepIndex, createPolicy(items));
      contractCount += 1;
      return;
    }
    if (step.op !== 'claim') throw new Error(`Unknown operation: ${String(step.op)}`);
    const policyIndex = integer(step.policy, 'Claim policy');
    const policy = policies.get(policyIndex);
    if (!policy) throw new Error(`Claim policy does not reference an earlier quote: ${policyIndex}`);
    const incident = object(step.incident, 'Incident');
    if (typeof incident.cause !== 'string') throw new Error('Incident cause must be a string');
    results.push(processClaim(policy, readDamages(incident.damages)));
  });
  return { results };
}
