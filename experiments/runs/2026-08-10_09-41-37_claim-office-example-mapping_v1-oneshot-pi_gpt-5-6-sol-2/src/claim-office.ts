export const ITEM_TYPES = [
  'sword',
  'amulet',
  'staff',
  'potion',
  'rune',
  'moonstone',
] as const;

export type ItemType = (typeof ITEM_TYPES)[number];

export interface InsuredItem {
  type: ItemType;
  material?: string;
  enchantment?: number;
  cursed?: boolean;
}

export interface Damage {
  itemType: ItemType;
  amount: number;
}

export interface QuoteStep {
  op: 'quote';
  items: InsuredItem[];
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

export type Result =
  | { premium: number }
  | { payout: number; remainingCap: number };

interface Price {
  value: number;
  premium: number;
}

interface Policy {
  items: InsuredItem[];
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
const CURSE_PERCENT = 50;
const ENCHANTMENT_PERCENT = 30;
const HIGH_ENCHANTMENT = 5;
const CLAIM_ENCHANTMENT = 8;
const LOYALTY_PERCENT = 20;
const FIRST_INSURANCE_PERCENT = 10;
const FOLLOW_UP_PERCENT = 15;
const LOYALTY_YEARS = 2;
const PROCESSING_FEE = 5;
const DEDUCTIBLE = 100;
const CAP_MULTIPLIER = 2;
const PERCENT = 100;

export class ClaimOfficeError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'ClaimOfficeError';
  }
}

function itemBasePremium(item: InsuredItem, counts: Map<ItemType, number>): number {
  const isBlock = COMPONENT_TYPES.has(item.type)
    && counts.get(item.type) === COMPONENT_BLOCK_SIZE;
  return isBlock ? COMPONENT_BLOCK_PREMIUM / COMPONENT_BLOCK_SIZE : PRICES[item.type].premium;
}

function premiumFor(items: InsuredItem[], years: number, quoteNumber: number): number {
  const counts = countTypes(items.map((item) => item.type));
  let base = 0;
  let surchargeHundredths = 0;
  for (const item of items) {
    const itemBase = itemBasePremium(item, counts);
    base += itemBase;
    surchargeHundredths += item.cursed ? itemBase * CURSE_PERCENT : 0;
    surchargeHundredths += (item.enchantment ?? 0) >= HIGH_ENCHANTMENT
      ? itemBase * ENCHANTMENT_PERCENT : 0;
  }
  let policyPercent = FIRST_INSURANCE_PERCENT;
  policyPercent -= years >= LOYALTY_YEARS ? LOYALTY_PERCENT : 0;
  policyPercent -= quoteNumber > 0 ? FOLLOW_UP_PERCENT : 0;
  const premiumHundredths = base * PERCENT + surchargeHundredths + base * policyPercent;
  return Math.ceil(premiumHundredths / PERCENT) + PROCESSING_FEE;
}

function countTypes(types: ItemType[]): Map<ItemType, number> {
  const counts = new Map<ItemType, number>();
  for (const type of types) counts.set(type, (counts.get(type) ?? 0) + 1);
  return counts;
}

function insuranceSum(items: InsuredItem[]): number {
  return items.reduce((sum, item) => sum + PRICES[item.type].value, 0);
}

function assignDamages(items: InsuredItem[], damages: Damage[]): InsuredItem[] {
  const used = new Map<ItemType, number>();
  return damages.map((damage) => {
    const occurrence = used.get(damage.itemType) ?? 0;
    const matches = items.filter((item) => item.type === damage.itemType);
    const item = matches[occurrence];
    if (!item) throw new ClaimOfficeError(`Damage references uninsured item: ${damage.itemType}`);
    used.set(damage.itemType, occurrence + 1);
    return item;
  });
}

function damagePayout(item: InsuredItem, amount: number): number {
  const reimbursement = (item.enchantment ?? 0) >= CLAIM_ENCHANTMENT
    ? amount / CAP_MULTIPLIER : amount;
  return Math.max(0, reimbursement - DEDUCTIBLE);
}

function processClaim(policy: Policy, damages: Damage[]): { payout: number; remainingCap: number } {
  const assignedItems = assignDamages(policy.items, damages);
  const desired = damages.reduce(
    (total, damage, index) => total + damagePayout(assignedItems[index], damage.amount),
    0,
  );
  const payout = Math.min(Math.floor(desired), policy.remainingCap);
  policy.remainingCap -= payout;
  return { payout, remainingCap: policy.remainingCap };
}

export function runScenario(input: unknown): { results: Result[] } {
  const scenario = validateScenario(input);
  const policies = new Map<number, Policy>();
  const results: Result[] = [];
  let quoteNumber = 0;
  scenario.steps.forEach((step, stepIndex) => {
    if (step.op === 'quote') {
      results.push({ premium: premiumFor(step.items, scenario.customer.yearsWithMHPCO, quoteNumber) });
      policies.set(stepIndex, {
        items: step.items.map((item) => ({ ...item })),
        remainingCap: insuranceSum(step.items) * CAP_MULTIPLIER,
      });
      quoteNumber += 1;
      return;
    }
    const policy = policies.get(step.policy);
    if (!policy) throw new ClaimOfficeError(`Policy ${step.policy} is not an earlier quote`);
    results.push(processClaim(policy, step.incident.damages));
  });
  return { results };
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function isItemType(value: unknown): value is ItemType {
  return typeof value === 'string' && (ITEM_TYPES as readonly string[]).includes(value);
}

function validateItem(value: unknown): InsuredItem {
  if (!isRecord(value) || !isItemType(value.type)) {
    const type = isRecord(value) ? String(value.type) : String(value);
    throw new ClaimOfficeError(`Unknown or invalid item type: ${type}`);
  }
  if (value.material !== undefined && typeof value.material !== 'string') invalid('item material');
  if (value.enchantment !== undefined && !Number.isInteger(value.enchantment)) invalid('enchantment');
  if (value.cursed !== undefined && typeof value.cursed !== 'boolean') invalid('cursed flag');
  return value as unknown as InsuredItem;
}

function validateDamage(value: unknown): Damage {
  if (!isRecord(value) || !isItemType(value.itemType)) invalid('damage item type');
  if (!Number.isInteger(value.amount) || (value.amount as number) < 0) invalid('damage amount');
  return value as unknown as Damage;
}

function validateStep(value: unknown): QuoteStep | ClaimStep {
  if (!isRecord(value)) invalid('step');
  if (value.op === 'quote') {
    if (!Array.isArray(value.items)) invalid('quote items');
    return { op: 'quote', items: value.items.map(validateItem) };
  }
  if (value.op !== 'claim') invalid('operation');
  if (!Number.isInteger(value.policy) || !isRecord(value.incident)) invalid('claim');
  if (typeof value.incident.cause !== 'string' || !Array.isArray(value.incident.damages)) {
    invalid('incident');
  }
  return {
    op: 'claim',
    policy: value.policy as number,
    incident: {
      cause: value.incident.cause,
      damages: value.incident.damages.map(validateDamage),
    },
  };
}

function validateScenario(value: unknown): Scenario {
  if (!isRecord(value) || !isRecord(value.customer) || !Array.isArray(value.steps)) {
    invalid('scenario');
  }
  if (!Number.isInteger(value.customer.yearsWithMHPCO)) invalid('yearsWithMHPCO');
  return {
    customer: { yearsWithMHPCO: value.customer.yearsWithMHPCO as number },
    steps: value.steps.map(validateStep),
  };
}

function invalid(field: string): never {
  throw new ClaimOfficeError(`Invalid ${field}`);
}
