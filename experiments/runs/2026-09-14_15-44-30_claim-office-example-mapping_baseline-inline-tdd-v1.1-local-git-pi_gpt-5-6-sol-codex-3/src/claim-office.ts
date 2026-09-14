export type ItemType = 'sword' | 'amulet' | 'staff' | 'potion' | 'rune' | 'moonstone';

export interface Item {
  type: ItemType;
  material?: string;
  enchantment?: number;
  cursed?: boolean;
}

export interface QuoteStep { op: 'quote'; items: Item[] }
export interface Damage { itemType: ItemType; amount: number }
export interface ClaimStep {
  op: 'claim';
  policy: number;
  incident: { cause: string; damages: Damage[] };
}
export interface Scenario {
  customer: { yearsWithMHPCO: number };
  steps: Array<QuoteStep | ClaimStep>;
}

const PROCESSING_FEE = 5;
const COMPONENT_BLOCK_SIZE = 3;
const COMPONENT_BLOCK_ITEM_PREMIUM = 20;
const CURSE_RATE = 0.5;
const ENCHANTMENT_PREMIUM_THRESHOLD = 5;
const ENCHANTMENT_RATE = 0.3;
const LOYALTY_YEARS = 2;
const LOYALTY_RATE = 0.2;
const ASSESSMENT_RATE = 0.1;
const FOLLOW_UP_RATE = 0.15;
const POLICY_CAP_MULTIPLIER = 2;
const CLAIM_ENCHANTMENT_THRESHOLD = 8;
const REDUCED_REIMBURSEMENT_RATE = 0.5;
const DEDUCTIBLE = 100;

const prices: Record<ItemType, { value: number; premium: number }> = {
  sword: { value: 1000, premium: 100 },
  amulet: { value: 600, premium: 60 },
  staff: { value: 800, premium: 80 },
  potion: { value: 400, premium: 40 },
  rune: { value: 250, premium: 25 },
  moonstone: { value: 250, premium: 25 },
};

function assertItemType(value: unknown): asserts value is ItemType {
  if (typeof value !== 'string' || !(value in prices)) throw new Error(`Unknown item type: ${String(value)}`);
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

function basePremium(item: Item, counts: Map<ItemType, number>): number {
  const hasBlock = isComponent(item.type) && counts.get(item.type) === COMPONENT_BLOCK_SIZE;
  return hasBlock ? COMPONENT_BLOCK_ITEM_PREMIUM : prices[item.type].premium;
}

function riskSurcharge(item: Item, base: number): number {
  const curse = item.cursed === true ? base * CURSE_RATE : 0;
  const enchantment = (item.enchantment ?? 0) >= ENCHANTMENT_PREMIUM_THRESHOLD ? base * ENCHANTMENT_RATE : 0;
  return curse + enchantment;
}

function quote(items: Item[], years: number, contractNumber: number): number {
  const counts = componentCounts(items);
  const itemPremiums = items.map((item) => basePremium(item, counts));
  const base = itemPremiums.reduce((sum, premium) => sum + premium, 0);
  const risks = items.reduce((sum, item, index) => sum + riskSurcharge(item, itemPremiums[index]), 0);
  const loyalty = years >= LOYALTY_YEARS ? base * LOYALTY_RATE : 0;
  const followUp = contractNumber > 0 ? base * FOLLOW_UP_RATE : 0;
  return Math.ceil(base + risks - loyalty + base * ASSESSMENT_RATE - followUp + PROCESSING_FEE);
}

interface Policy { items: Item[]; remainingCap: number }

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function validateItem(value: unknown): void {
  if (!isRecord(value)) throw new Error('Each item must be an object');
  assertItemType(value.type);
  if (value.material !== undefined && typeof value.material !== 'string') throw new Error('Item material must be a string');
  if (value.enchantment !== undefined && !Number.isInteger(value.enchantment)) throw new Error('Item enchantment must be an integer');
  if (value.cursed !== undefined && typeof value.cursed !== 'boolean') throw new Error('Item cursed must be a boolean');
}

function validateDamage(value: unknown): void {
  if (!isRecord(value)) throw new Error('Each damage must be an object');
  assertItemType(value.itemType);
  if (!Number.isInteger(value.amount)) throw new Error('Damage amount must be an integer');
}

function validateQuote(value: Record<string, unknown>): void {
  if (!Array.isArray(value.items)) throw new Error('Quote items must be an array');
  value.items.forEach(validateItem);
}

function validateClaim(value: Record<string, unknown>): void {
  if (!Number.isInteger(value.policy) || !isRecord(value.incident)) throw new Error('Claim must contain a policy and incident');
  const { incident } = value;
  if (typeof incident.cause !== 'string' || !Array.isArray(incident.damages)) throw new Error('Incident must contain cause and damages');
  incident.damages.forEach(validateDamage);
}

function validateStep(value: unknown): void {
  if (!isRecord(value)) throw new Error('Each step must be an object');
  if (value.op === 'quote') validateQuote(value);
  else if (value.op === 'claim') validateClaim(value);
  else throw new Error(`Unknown operation: ${String(value.op)}`);
}

function validateScenario(value: unknown): asserts value is Scenario {
  if (!isRecord(value) || !isRecord(value.customer) || !Array.isArray(value.steps)) {
    throw new Error('Scenario must contain customer and steps');
  }
  if (!Number.isInteger(value.customer.yearsWithMHPCO)) throw new Error('yearsWithMHPCO must be an integer');
  value.steps.forEach(validateStep);
}

function newPolicy(items: Item[]): Policy {
  const insuranceSum = items.reduce((sum, item) => sum + prices[item.type].value, 0);
  return { items: [...items], remainingCap: insuranceSum * POLICY_CAP_MULTIPLIER };
}

function availableItems(items: Item[]): Map<ItemType, Item[]> {
  const available = new Map<ItemType, Item[]>();
  for (const item of items) available.set(item.type, [...(available.get(item.type) ?? []), item]);
  return available;
}

function reimbursement(item: Item, amount: number): number {
  const isHighlyEnchanted = (item.enchantment ?? 0) >= CLAIM_ENCHANTMENT_THRESHOLD;
  const rate = isHighlyEnchanted ? REDUCED_REIMBURSEMENT_RATE : 1;
  return Math.max(0, amount * rate - DEDUCTIBLE);
}

function desiredPayout(step: ClaimStep, policy: Policy): number {
  const available = availableItems(policy.items);
  let total = 0;
  for (const damage of step.incident.damages) {
    if (damage.amount < 0) throw new Error(`Invalid damage amount: ${damage.amount}`);
    const item = available.get(damage.itemType)?.shift();
    if (!item) throw new Error(`Damage to uninsured item: ${damage.itemType}`);
    total += reimbursement(item, damage.amount);
  }
  return total;
}

function processClaim(step: ClaimStep, policy: Policy): { payout: number; remainingCap: number } {
  const payout = Math.floor(Math.min(desiredPayout(step, policy), policy.remainingCap));
  policy.remainingCap -= payout;
  return { payout, remainingCap: policy.remainingCap };
}

export function processScenario(scenario: unknown): { results: Array<{ premium: number } | { payout: number; remainingCap: number }> } {
  validateScenario(scenario);
  const results: Array<{ premium: number } | { payout: number; remainingCap: number }> = [];
  const policies = new Map<number, Policy>();
  let contractNumber = 0;
  scenario.steps.forEach((step, index) => {
    if (step.op === 'quote') {
      results.push({ premium: quote(step.items, scenario.customer.yearsWithMHPCO, contractNumber++) });
      policies.set(index, newPolicy(step.items));
      return;
    }
    const policy = policies.get(step.policy);
    if (!policy) throw new Error(`Invalid policy reference: ${step.policy}`);
    results.push(processClaim(step, policy));
  });
  return { results };
}
