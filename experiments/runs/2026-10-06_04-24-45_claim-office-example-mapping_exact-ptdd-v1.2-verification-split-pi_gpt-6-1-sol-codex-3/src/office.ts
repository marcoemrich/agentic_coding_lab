export interface Item {
  type: string;
  material?: string;
  enchantment?: number;
  cursed?: boolean;
}
export interface Damage { itemType: string; amount: number }
export interface Quote { op: 'quote'; items: Item[] }
export interface Claim {
  op: 'claim';
  policy: number;
  incident: { cause: string; damages: Damage[] };
}
export interface Scenario {
  customer: { yearsWithMHPCO: number };
  steps: (Quote | Claim)[];
}
export type Result = { premium: number } | { payout: number; remainingCap: number };
const PROCESSING_FEE = 5;

const COMPONENT_PREMIUM = 25;
const BASE_PREMIUMS: Record<string, number> = {
  sword: 100, amulet: 60, staff: 80, potion: 40,
  rune: COMPONENT_PREMIUM, moonstone: COMPONENT_PREMIUM,
};
const INITIAL_ASSESSMENT = 0.1;

const BLOCK_SIZE = 3;
const BLOCK_PREMIUM = 60;

function isComponentBlock(item: Item, items: Item[]): boolean {
  const isComponent = item.type === 'rune' || item.type === 'moonstone';
  return isComponent && items.filter(candidate => candidate.type === item.type).length === BLOCK_SIZE;
}

function itemBasePremium(item: Item, items: Item[]): number {
  if (isComponentBlock(item, items)) return BLOCK_PREMIUM / BLOCK_SIZE;
  if (!Object.hasOwn(BASE_PREMIUMS, item.type)) throw new Error(`Unknown item type: ${item.type}`);
  return BASE_PREMIUMS[item.type];
}

const CURSE_SURCHARGE = 0.5;
const HIGH_ENCHANTMENT = 5;
const ENCHANTMENT_SURCHARGE = 0.3;

function curseSurcharge(item: Item, base: number): number {
  return item.cursed ? base * CURSE_SURCHARGE : 0;
}

function enchantmentSurcharge(item: Item, base: number): number {
  return (item.enchantment ?? 0) >= HIGH_ENCHANTMENT ? base * ENCHANTMENT_SURCHARGE : 0;
}

const LOYALTY_YEARS = 2;
const LOYALTY_DISCOUNT = 0.2;

function loyaltyDiscount(base: number, yearsWithMHPCO: number): number {
  return yearsWithMHPCO >= LOYALTY_YEARS ? base * LOYALTY_DISCOUNT : 0;
}

const FOLLOW_UP_DISCOUNT = 0.15;

function followUpDiscount(base: number, previousContracts: number): number {
  return previousContracts > 0 ? base * FOLLOW_UP_DISCOUNT : 0;
}

function quotePremium(items: Item[], yearsWithMHPCO: number, previousContracts: number): number {
  const base = items.reduce((sum, item) => sum + itemBasePremium(item, items), 0);
  const risk = items.reduce((sum, item) => {
    const itemBase = itemBasePremium(item, items);
    return sum + curseSurcharge(item, itemBase) + enchantmentSurcharge(item, itemBase);
  }, 0);
  const loyalty = loyaltyDiscount(base, yearsWithMHPCO);
  const followUp = followUpDiscount(base, previousContracts);
  return Math.ceil(base + risk + base * INITIAL_ASSESSMENT - loyalty - followUp + PROCESSING_FEE);
}

const COMPONENT_INSURANCE_VALUE = 250;
const INSURANCE_VALUES: Record<string, number> = {
  sword: 1000, amulet: 600, staff: 800, potion: 400,
  rune: COMPONENT_INSURANCE_VALUE, moonstone: COMPONENT_INSURANCE_VALUE,
};
const CAP_MULTIPLIER = 2;
const DEDUCTIBLE = 100;
const CLAIM_ENCHANTMENT_THRESHOLD = 8;
const ENCHANTED_REIMBURSEMENT = 0.5;
interface Policy { items: Item[]; remainingCap: number }

function createPolicy(items: Item[]): Policy {
  const insuranceSum = items.reduce((sum, item) => sum + (INSURANCE_VALUES[item.type] ?? 0), 0);
  return { items, remainingCap: insuranceSum * CAP_MULTIPLIER };
}

function reimbursementRate(item: Item): number {
  return (item.enchantment ?? 0) >= CLAIM_ENCHANTMENT_THRESHOLD ? ENCHANTED_REIMBURSEMENT : 1;
}

function takeInsuredItem(items: Item[], itemType: string): Item {
  const index = items.findIndex(candidate => candidate.type === itemType);
  if (index < 0) throw new Error(`Item not insured: ${itemType}`);
  return items.splice(index, 1)[0];
}

function damageCompensation(item: Item, amount: number): number {
  if (amount < 0) throw new Error('Damage amount must not be negative');
  return Math.max(0, amount * reimbursementRate(item) - DEDUCTIBLE);
}

function settleClaim(policy: Policy, damages: Damage[]): Result {
  const availableItems = [...policy.items];
  const desired = damages.reduce((sum, damage) => {
    const item = takeInsuredItem(availableItems, damage.itemType);
    return sum + damageCompensation(item, damage.amount);
  }, 0);
  return payFromCap(policy, desired);
}

function payFromCap(policy: Policy, desired: number): Result {
  const payout = Math.floor(Math.min(desired, policy.remainingCap));
  policy.remainingCap -= payout;
  return { payout, remainingCap: policy.remainingCap };
}

export function runScenario(scenario: Scenario): { results: Result[] } {
  let previousContracts = 0;
  const policies = new Map<number, Policy>();
  const results = scenario.steps.map((step, index) => {
    if (step.op === 'claim') return settleClaim(policies.get(step.policy)!, step.incident.damages);
    const premium = quotePremium(step.items, scenario.customer.yearsWithMHPCO, previousContracts);
    policies.set(index, createPolicy(step.items));
    previousContracts++;
    return { premium };
  });
  return { results };
}
