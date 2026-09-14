export const ITEM_TYPES = ['sword', 'amulet', 'staff', 'potion', 'rune', 'moonstone'] as const;
export type ItemType = typeof ITEM_TYPES[number];

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

export interface Scenario {
  customer: { yearsWithMHPCO: number };
  steps: Array<
    | { op: 'quote'; items: Item[] }
    | { op: 'claim'; policy: number; incident: { cause: string; damages: Damage[] } }
  >;
}

export interface ScenarioResult {
  results: Array<{ premium: number } | { payout: number; remainingCap: number }>;
}

const PREMIUMS: Record<ItemType, number> = {
  sword: 100,
  amulet: 60,
  staff: 80,
  potion: 40,
  rune: 25,
  moonstone: 25,
};

const VALUES: Record<ItemType, number> = {
  sword: 1000,
  amulet: 600,
  staff: 800,
  potion: 400,
  rune: 250,
  moonstone: 250,
};

const COMPONENT_TYPES = new Set<ItemType>(['rune', 'moonstone']);
const BLOCK_SIZE = 3;
const BLOCK_PREMIUM_PER_ITEM = 20;
const CURSE_RATE = 0.5;
const ENCHANTMENT_RATE = 0.3;
const HIGH_ENCHANTMENT = 5;
const CLAIM_ENCHANTMENT = 8;
const LOYALTY_YEARS = 2;
const LOYALTY_RATE = 0.2;
const INITIAL_RATE = 0.1;
const FOLLOW_UP_RATE = 0.15;
const PROCESSING_FEE = 5;
const DEDUCTIBLE = 100;
const POLICY_CAP_MULTIPLIER = 2;

function isItemType(value: unknown): value is ItemType {
  return typeof value === 'string' && (ITEM_TYPES as readonly string[]).includes(value);
}

function effectiveBases(items: readonly Item[]): number[] {
  const counts = new Map<ItemType, number>();
  for (const item of items) counts.set(item.type, (counts.get(item.type) ?? 0) + 1);
  return items.map(item => {
    const isBlock = COMPONENT_TYPES.has(item.type) && counts.get(item.type) === BLOCK_SIZE;
    return isBlock ? BLOCK_PREMIUM_PER_ITEM : PREMIUMS[item.type];
  });
}

export function quotePremium(
  items: readonly Item[],
  yearsWithMHPCO: number,
  previousContracts: number,
): number {
  validateItems(items);
  const bases = effectiveBases(items);
  const base = bases.reduce((total, value) => total + value, 0);
  const itemAdjustments = items.reduce((total, item, index) => {
    const curse = item.cursed ? bases[index] * CURSE_RATE : 0;
    const enchantment = (item.enchantment ?? 0) >= HIGH_ENCHANTMENT
      ? bases[index] * ENCHANTMENT_RATE
      : 0;
    return total + curse + enchantment;
  }, 0);
  const loyalty = yearsWithMHPCO >= LOYALTY_YEARS ? base * LOYALTY_RATE : 0;
  const followUp = previousContracts > 0 ? base * FOLLOW_UP_RATE : 0;
  return Math.ceil(base + itemAdjustments - loyalty + base * INITIAL_RATE - followUp + PROCESSING_FEE);
}

interface Policy {
  items: Item[];
  remainingCap: number;
}

function policyForClaim(policies: Map<number, Policy>, reference: number): Policy {
  if (!Number.isInteger(reference)) throw new Error('Policy reference must be an integer');
  const policy = policies.get(reference);
  if (!policy) throw new Error(`Policy ${reference} does not refer to an earlier quote`);
  return policy;
}

function matchedItems(policy: Policy, damages: readonly Damage[]): Item[] {
  const available = [...policy.items];
  return damages.map(damage => {
    if (!Number.isInteger(damage.amount) || damage.amount < 0) {
      throw new Error('Damage amounts must be non-negative integers');
    }
    const index = available.findIndex(item => item.type === damage.itemType);
    if (index < 0) throw new Error(`Damaged item '${damage.itemType}' is not covered by the policy`);
    return available.splice(index, 1)[0];
  });
}

function reimbursement(item: Item, amount: number): number {
  const rate = (item.enchantment ?? 0) >= CLAIM_ENCHANTMENT ? CURSE_RATE : 1;
  return Math.max(0, amount * rate - DEDUCTIBLE);
}

function claim(policy: Policy, damages: readonly Damage[]): { payout: number; remainingCap: number } {
  if (!Array.isArray(damages)) throw new Error('Incident damages must be an array');
  const items = matchedItems(policy, damages);
  const desired = damages.reduce(
    (total, damage, index) => total + reimbursement(items[index], damage.amount),
    0,
  );
  const payout = Math.floor(Math.min(desired, policy.remainingCap));
  policy.remainingCap -= payout;
  return { payout, remainingCap: policy.remainingCap };
}

function validateItem(item: Item): void {
  if (!item || typeof item !== 'object' || !isItemType(item.type)) {
    throw new Error(`Unknown item type '${item?.type ?? ''}'`);
  }
  if (item.material !== undefined && typeof item.material !== 'string') {
    throw new Error('Item material must be a string');
  }
  if (item.enchantment !== undefined && !Number.isInteger(item.enchantment)) {
    throw new Error('Item enchantment must be an integer');
  }
  if (item.cursed !== undefined && typeof item.cursed !== 'boolean') {
    throw new Error('Item cursed flag must be boolean');
  }
}

function validateItems(items: readonly Item[]): void {
  if (!Array.isArray(items)) throw new Error('Quote items must be an array');
  items.forEach(validateItem);
}

function validateScenario(value: unknown): asserts value is Scenario {
  if (!value || typeof value !== 'object') throw new Error('Scenario must be an object');
  const candidate = value as Partial<Scenario>;
  if (!candidate.customer || !Number.isInteger(candidate.customer.yearsWithMHPCO)) {
    throw new Error('Customer yearsWithMHPCO must be an integer');
  }
  if (!Array.isArray(candidate.steps)) throw new Error('Scenario steps must be an array');
}

export function processScenario(value: unknown): ScenarioResult {
  validateScenario(value);
  const policies = new Map<number, Policy>();
  const results: ScenarioResult['results'] = [];
  let quoteCount = 0;
  value.steps.forEach((step, stepIndex) => {
    if (step.op === 'quote') {
      validateItems(step.items);
      results.push({ premium: quotePremium(step.items, value.customer.yearsWithMHPCO, quoteCount) });
      const insuranceSum = step.items.reduce((sum, item) => sum + VALUES[item.type], 0);
      policies.set(stepIndex, { items: step.items.map(item => ({ ...item })), remainingCap: insuranceSum * POLICY_CAP_MULTIPLIER });
      quoteCount += 1;
      return;
    }
    if (step.op === 'claim' && step.incident && typeof step.incident.cause === 'string') {
      results.push(claim(policyForClaim(policies, step.policy), step.incident.damages));
      return;
    }
    throw new Error('Unknown or malformed operation');
  });
  return { results };
}
