export interface Item {
  type: string;
  material?: string;
  enchantment?: number;
  cursed?: boolean;
}

interface QuoteStep { op: 'quote'; items: Item[] }
interface Damage { itemType: string; amount: number }
interface ClaimStep {
  op: 'claim';
  policy: number;
  incident: { cause: string; damages: Damage[] };
}
export interface Scenario {
  customer: { yearsWithMHPCO: number };
  steps: Array<QuoteStep | ClaimStep>;
}
interface QuoteResult { premium: number }
interface ClaimResult { payout: number; remainingCap: number }
type Result = QuoteResult | ClaimResult;
interface Policy { items: Item[]; remainingCap: number }

const BASE_PREMIUM: Record<string, number> = { sword: 100, amulet: 60, staff: 80, potion: 40 };
const INSURANCE_VALUE: Record<string, number> = { sword: 1000, amulet: 600, staff: 800, potion: 400 };
const COMPONENT_TYPES = new Set(['rune', 'moonstone']);
const COMPONENT_PREMIUM = 25;
const COMPONENT_VALUE = 250;
const BLOCK_ITEM_PREMIUM = 20;
const BLOCK_SIZE = 3;
const FIRST_INSURANCE_RATE = 0.1;
const LOYALTY_RATE = 0.2;
const FOLLOW_UP_RATE = 0.15;
const CURSE_RATE = 0.5;
const ENCHANTMENT_RATE = 0.3;
const LOYALTY_YEARS = 2;
const HIGH_ENCHANTMENT = 5;
const PROCESSING_FEE = 5;
const DEDUCTIBLE = 100;
const CAP_MULTIPLIER = 2;
const CLAIM_ENCHANTMENT = 8;
const HIGH_ENCHANTMENT_REIMBURSEMENT = 0.5;

function componentCounts(items: Item[]): Map<string, number> {
  const counts = new Map<string, number>();
  for (const item of items) {
    if (!(item.type in BASE_PREMIUM)) counts.set(item.type, (counts.get(item.type) ?? 0) + 1);
  }
  return counts;
}

function itemBase(item: Item, counts: Map<string, number>): number {
  if (item.type in BASE_PREMIUM) return BASE_PREMIUM[item.type];
  return counts.get(item.type) === BLOCK_SIZE ? BLOCK_ITEM_PREMIUM : COMPONENT_PREMIUM;
}

function validateItem(item: Item): void {
  if (!(item.type in BASE_PREMIUM) && !COMPONENT_TYPES.has(item.type)) {
    throw new Error(`Unknown item type: ${item.type}`);
  }
}

function riskSurcharge(item: Item, premium: number): number {
  const curse = item.cursed ? premium * CURSE_RATE : 0;
  const enchantment = (item.enchantment ?? 0) >= HIGH_ENCHANTMENT ? premium * ENCHANTMENT_RATE : 0;
  return curse + enchantment;
}

function quote(items: Item[], years: number, previousQuotes: number): number {
  items.forEach(validateItem);
  const counts = componentCounts(items);
  let base = 0;
  let itemSurcharges = 0;
  for (const item of items) {
    const itemPremium = itemBase(item, counts);
    base += itemPremium;
    itemSurcharges += riskSurcharge(item, itemPremium);
  }
  const loyalty = years >= LOYALTY_YEARS ? base * LOYALTY_RATE : 0;
  const followUp = previousQuotes > 0 ? base * FOLLOW_UP_RATE : 0;
  return Math.ceil(base + itemSurcharges + base * FIRST_INSURANCE_RATE - loyalty - followUp + PROCESSING_FEE);
}

function policyFor(items: Item[]): Policy {
  const sum = items.reduce((total, item) => total + (INSURANCE_VALUE[item.type] ?? COMPONENT_VALUE), 0);
  return { items, remainingCap: sum * CAP_MULTIPLIER };
}

function claim(policy: Policy, step: ClaimStep): ClaimResult {
  const available = [...policy.items];
  let desired = 0;
  for (const damage of step.incident.damages) {
    if (damage.amount < 0) throw new Error('Negative damage amount');
    const itemIndex = available.findIndex((item) => item.type === damage.itemType);
    const item = available[itemIndex];
    if (!item) throw new Error(`Damage references uninsured item: ${damage.itemType}`);
    available.splice(itemIndex, 1);
    const rate = (item.enchantment ?? 0) >= CLAIM_ENCHANTMENT ? HIGH_ENCHANTMENT_REIMBURSEMENT : 1;
    desired += Math.max(0, damage.amount * rate - DEDUCTIBLE);
  }
  const payout = Math.floor(Math.min(desired, policy.remainingCap));
  policy.remainingCap -= payout;
  return { payout, remainingCap: policy.remainingCap };
}

export function processScenario(scenario: Scenario): { results: Result[] } {
  let previousQuotes = 0;
  const policies = new Map<number, Policy>();
  const results: Result[] = [];
  scenario.steps.forEach((step, index) => {
    if (step.op === 'quote') {
      results.push({ premium: quote(step.items, scenario.customer.yearsWithMHPCO, previousQuotes) });
      policies.set(index, policyFor(step.items));
      previousQuotes += 1;
    } else {
      const policy = policies.get(step.policy);
      if (!policy) throw new Error('Claim references an unknown policy');
      results.push(claim(policy, step));
    }
  });
  return { results };
}
