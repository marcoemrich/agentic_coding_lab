export interface Item {
  type: string;
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
  steps: unknown[];
}

interface QuoteStep { op: 'quote'; items: Item[] }
interface ClaimStep {
  op: 'claim';
  policy: number;
  incident: { cause: string; damages: Damage[] };
}
type Step = QuoteStep | ClaimStep;
interface Policy { items: Item[]; remainingCap: number }

const MAIN_PRICES: Record<string, { value: number; premium: number }> = {
  sword: { value: 1000, premium: 100 },
  amulet: { value: 600, premium: 60 },
  staff: { value: 800, premium: 80 },
  potion: { value: 400, premium: 40 },
};
const COMPONENT_TYPES = new Set(['rune', 'moonstone']);
const COMPONENT_VALUE = 250;
const COMPONENT_PREMIUM = 25;
const BLOCK_SIZE = 3;
const BLOCK_PREMIUM = 60;
const PROCESSING_FEE = 5;
const DEDUCTIBLE = 100;
const CURSE_RATE = 0.5;
const HIGH_ENCHANTMENT_LEVEL = 5;
const HIGH_ENCHANTMENT_RATE = 0.3;
const LOYALTY_YEARS = 2;
const LOYALTY_RATE = 0.2;
const ASSESSMENT_RATE = 0.1;
const FOLLOW_UP_RATE = 0.15;
const POLICY_CAP_MULTIPLIER = 2;
const CLAIM_ENCHANTMENT_LEVEL = 8;
const CLAIM_ENCHANTMENT_RATE = 0.5;

function fail(message: string): never {
  throw new Error(message);
}

function isObject(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function validateItem(value: unknown): Item {
  if (!isObject(value) || typeof value.type !== 'string') fail('Item must have a type');
  if (!(value.type in MAIN_PRICES) && !COMPONENT_TYPES.has(value.type)) {
    fail(`Unknown item type: ${value.type}`);
  }
  if (value.enchantment !== undefined && !Number.isInteger(value.enchantment)) {
    fail('Item enchantment must be an integer');
  }
  return value as unknown as Item;
}

function parseQuote(raw: Record<string, unknown>): QuoteStep {
  if (!Array.isArray(raw.items)) fail('Quote items must be an array');
  return { op: 'quote', items: raw.items.map(validateItem) };
}

function validateDamage(value: unknown): Damage {
  if (!isObject(value) || typeof value.itemType !== 'string') fail('Invalid damage item type');
  if (!Number.isInteger(value.amount) || (value.amount as number) < 0) {
    fail('Damage amount must be a non-negative integer');
  }
  return value as unknown as Damage;
}

function parseClaim(raw: Record<string, unknown>): ClaimStep {
  if (!Number.isInteger(raw.policy) || !isObject(raw.incident)) fail('Invalid claim policy or incident');
  if (typeof raw.incident.cause !== 'string' || !Array.isArray(raw.incident.damages)) {
    fail('Invalid claim incident');
  }
  return {
    op: 'claim',
    policy: raw.policy as number,
    incident: { cause: raw.incident.cause, damages: raw.incident.damages.map(validateDamage) },
  };
}

function parseStep(value: unknown): Step {
  if (!isObject(value)) fail('Invalid step');
  if (value.op === 'quote') return parseQuote(value);
  if (value.op === 'claim') return parseClaim(value);
  return fail('Unknown operation');
}

function itemBasePremium(item: Item): number {
  return MAIN_PRICES[item.type]?.premium ?? COMPONENT_PREMIUM;
}

function componentBase(items: Item[]): number {
  let total = 0;
  for (const type of COMPONENT_TYPES) {
    const count = items.filter((item) => item.type === type).length;
    total += count === BLOCK_SIZE ? BLOCK_PREMIUM : count * COMPONENT_PREMIUM;
  }
  return total;
}

function modifierBase(item: Item, items: Item[]): number {
  if (item.type in MAIN_PRICES) return itemBasePremium(item);
  const alikeCount = items.filter((candidate) => candidate.type === item.type).length;
  return alikeCount === BLOCK_SIZE ? BLOCK_PREMIUM / BLOCK_SIZE : COMPONENT_PREMIUM;
}

function quotePremium(items: Item[], years: number, priorQuotes: number): number {
  const mainBase = items.reduce((sum, item) => {
    return item.type in MAIN_PRICES ? sum + itemBasePremium(item) : sum;
  }, 0);
  const base = mainBase + componentBase(items);
  let amount = base;
  for (const item of items) {
    const itemBase = modifierBase(item, items);
    if (item.cursed === true) amount += itemBase * CURSE_RATE;
    if ((item.enchantment ?? 0) >= HIGH_ENCHANTMENT_LEVEL) amount += itemBase * HIGH_ENCHANTMENT_RATE;
  }
  if (years >= LOYALTY_YEARS) amount -= base * LOYALTY_RATE;
  amount += base * ASSESSMENT_RATE;
  if (priorQuotes > 0) amount -= base * FOLLOW_UP_RATE;
  return Math.ceil(amount + PROCESSING_FEE);
}

function insuranceValue(item: Item): number {
  return MAIN_PRICES[item.type]?.value ?? COMPONENT_VALUE;
}

function makePolicy(items: Item[]): Policy {
  const insuranceSum = items.reduce((sum, item) => sum + insuranceValue(item), 0);
  return {
    items: items.map((item) => ({ ...item })),
    remainingCap: insuranceSum * POLICY_CAP_MULTIPLIER,
  };
}

function reimbursement(item: Item, amount: number): number {
  const isHighlyEnchanted = (item.enchantment ?? 0) >= CLAIM_ENCHANTMENT_LEVEL;
  const reimbursable = isHighlyEnchanted ? amount * CLAIM_ENCHANTMENT_RATE : amount;
  return Math.max(0, reimbursable - DEDUCTIBLE);
}

function desiredPayout(policy: Policy, damages: Damage[]): number {
  const available = new Map<string, Item[]>();
  for (const item of policy.items) {
    const matching = available.get(item.type) ?? [];
    matching.push(item);
    available.set(item.type, matching);
  }
  let total = 0;
  for (const damage of damages) {
    const item = available.get(damage.itemType)?.shift();
    if (!item) fail(`Damaged item is not covered: ${damage.itemType}`);
    total += reimbursement(item, damage.amount);
  }
  return total;
}

function processClaim(policy: Policy, damages: Damage[]): { payout: number; remainingCap: number } {
  const payout = Math.floor(Math.min(desiredPayout(policy, damages), policy.remainingCap));
  policy.remainingCap -= payout;
  return { payout, remainingCap: policy.remainingCap };
}

export function processScenario(input: unknown): { results: object[] } {
  if (!isObject(input) || !isObject(input.customer) || !Array.isArray(input.steps)) {
    fail('Scenario must contain customer and steps');
  }
  const years = input.customer.yearsWithMHPCO;
  if (!Number.isInteger(years) || (years as number) < 0) fail('yearsWithMHPCO must be a non-negative integer');
  const steps = input.steps.map(parseStep);
  const policies = new Map<number, Policy>();
  const results: object[] = [];
  let quoteCount = 0;
  steps.forEach((step, index) => {
    if (step.op === 'quote') {
      results.push({ premium: quotePremium(step.items, years as number, quoteCount) });
      policies.set(index, makePolicy(step.items));
      quoteCount += 1;
      return;
    }
    const policy = policies.get(step.policy);
    if (!policy) fail('Claim policy must reference an earlier quote step');
    results.push(processClaim(policy, step.incident.damages));
  });
  return { results };
}
