export const ITEM_TYPES = ['sword', 'amulet', 'staff', 'potion', 'rune', 'moonstone'] as const;
export type ItemType = typeof ITEM_TYPES[number];

export interface Item {
  type: ItemType;
  material?: string;
  enchantment?: number;
  cursed?: boolean;
}

export interface Damage { itemType: ItemType; amount: number }
export interface QuoteStep { op: 'quote'; items: Item[] }
export interface ClaimStep {
  op: 'claim';
  policy: number;
  incident: { cause: string; damages: Damage[] };
}
export type Step = QuoteStep | ClaimStep;
export interface Scenario { customer: { yearsWithMHPCO: number }; steps: Step[] }
export type Result = { premium: number } | { payout: number; remainingCap: number };

const PRICE: Record<ItemType, { value: number; premium: number }> = {
  sword: { value: 1000, premium: 100 },
  amulet: { value: 600, premium: 60 },
  staff: { value: 800, premium: 80 },
  potion: { value: 400, premium: 40 },
  rune: { value: 250, premium: 25 },
  moonstone: { value: 250, premium: 25 },
};
const BLOCK_SIZE = 3;
const BLOCK_PREMIUM = 60;
const CURSE_RATE = 0.5;
const ENCHANTMENT_RATE = 0.3;
const HIGH_ENCHANTMENT = 5;
const LOYAL_YEARS = 2;
const LOYALTY_RATE = 0.2;
const INITIAL_RATE = 0.1;
const FOLLOW_UP_RATE = 0.15;
const FEE = 5;
const CAP_MULTIPLIER = 2;
const DEDUCTIBLE = 100;
const CLAIM_ENCHANTMENT = 8;
const REDUCED_REIMBURSEMENT = 0.5;

interface Policy { items: Item[]; remainingCap: number }

function assertKnownType(type: string): asserts type is ItemType {
  if (!ITEM_TYPES.includes(type as ItemType)) throw new Error(`Unknown item type: ${type}`);
}

function itemBases(items: Item[]): number[] {
  const counts = new Map<ItemType, number>();
  for (const item of items) {
    assertKnownType(item.type);
    counts.set(item.type, (counts.get(item.type) ?? 0) + 1);
  }
  return items.map((item) => {
    const isBlock = (item.type === 'rune' || item.type === 'moonstone')
      && counts.get(item.type) === BLOCK_SIZE;
    return isBlock ? BLOCK_PREMIUM / BLOCK_SIZE : PRICE[item.type].premium;
  });
}

function quote(items: Item[], years: number, quoteNumber: number): number {
  const bases = itemBases(items);
  const base = bases.reduce((sum, value) => sum + value, 0);
  const itemRisk = items.reduce((sum, item, index) => {
    const curse = item.cursed ? bases[index] * CURSE_RATE : 0;
    const enchantment = (item.enchantment ?? 0) >= HIGH_ENCHANTMENT
      ? bases[index] * ENCHANTMENT_RATE : 0;
    return sum + curse + enchantment;
  }, 0);
  const loyalty = years >= LOYAL_YEARS ? base * LOYALTY_RATE : 0;
  const followUp = quoteNumber > 0 ? base * FOLLOW_UP_RATE : 0;
  return Math.ceil(base + itemRisk - loyalty + base * INITIAL_RATE - followUp + FEE);
}

function createPolicy(items: Item[]): Policy {
  const insuranceSum = items.reduce((sum, item) => sum + PRICE[item.type].value, 0);
  return { items: items.map((item) => ({ ...item })), remainingCap: insuranceSum * CAP_MULTIPLIER };
}

function desiredPayout(item: Item, amount: number): number {
  const reimbursed = (item.enchantment ?? 0) >= CLAIM_ENCHANTMENT
    ? amount * REDUCED_REIMBURSEMENT : amount;
  return Math.max(0, reimbursed - DEDUCTIBLE);
}

function claim(policy: Policy, damages: Damage[]): { payout: number; remainingCap: number } {
  const available = [...policy.items];
  const desired = damages.reduce((sum, damage) => {
    assertKnownType(damage.itemType);
    if (damage.amount < 0) throw new Error(`Damage amount cannot be negative: ${damage.amount}`);
    const index = available.findIndex((item) => item.type === damage.itemType);
    if (index < 0) throw new Error(`Damage references uninsured item type: ${damage.itemType}`);
    const [item] = available.splice(index, 1);
    return sum + desiredPayout(item, damage.amount);
  }, 0);
  const payout = Math.floor(Math.min(desired, policy.remainingCap));
  policy.remainingCap -= payout;
  return { payout, remainingCap: policy.remainingCap };
}

export function processScenario(scenario: Scenario): { results: Result[] } {
  const results: Result[] = [];
  const policies = new Map<number, Policy>();
  let quoteNumber = 0;
  scenario.steps.forEach((step, stepIndex) => {
    if (step.op === 'quote') {
      results.push({ premium: quote(step.items, scenario.customer.yearsWithMHPCO, quoteNumber) });
      policies.set(stepIndex, createPolicy(step.items));
      quoteNumber += 1;
      return;
    }
    const policy = policies.get(step.policy);
    if (!policy) throw new Error(`Policy ${step.policy} does not reference an earlier quote`);
    results.push(claim(policy, step.incident.damages));
  });
  return { results };
}
