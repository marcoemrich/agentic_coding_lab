export interface Item {
  type: string;
  material?: string;
  enchantment?: number;
  cursed?: boolean;
}
export interface Damage { itemType: string; amount: number }
export interface Quote { op: 'quote'; items: Item[] }
export interface Claim {
  op: 'claim'; policy: number;
  incident: { cause: string; damages: Damage[] };
}
export interface Scenario {
  customer: { yearsWithMHPCO: number };
  steps: (Quote | Claim)[];
}
export interface Result { premium?: number; payout?: number; remainingCap?: number }
const PROCESSING_FEE = 5;
const COMPONENT_BASE = 25;
const BLOCK_SIZE = 3;
const BLOCK_BASE = 60;
const COMPONENT_TYPES = ['rune', 'moonstone'];
const BASE_PREMIUMS: Record<string, number> = {
  sword: 100, amulet: 60, staff: 80, potion: 40
};
function itemBasePremium(type: string): number {
  if (COMPONENT_TYPES.includes(type)) return COMPONENT_BASE;
  if (!Object.hasOwn(BASE_PREMIUMS, type)) throw new Error(`Unknown item type: ${type}`);
  return BASE_PREMIUMS[type];
}
const INITIAL_ASSESSMENT = 0.1;
const CURSE_RISK = 0.5;
const HIGH_ENCHANTMENT = 5;
const ENCHANTMENT_RISK = 0.3;
const LOYALTY_YEARS = 2;
const LOYALTY_DISCOUNT = 0.2;
const FOLLOW_UP_DISCOUNT = 0.15;
function initialAssessment(base: number): number {
  return base * INITIAL_ASSESSMENT;
}
function componentBlockAdjustment(count: number): number {
  return count === BLOCK_SIZE ? BLOCK_BASE - BLOCK_SIZE * COMPONENT_BASE : 0;
}
function policyBasePremium(items: Item[]): number {
  const sum = items.reduce((total, item) => total + itemBasePremium(item.type), 0);
  return COMPONENT_TYPES.reduce((total, type) =>
    total + componentBlockAdjustment(items.filter(item => item.type === type).length), sum);
}
function curseSurcharge(item: Item): number {
  return item.cursed ? itemBasePremium(item.type) * CURSE_RISK : 0;
}
function enchantmentSurcharge(item: Item): number {
  return (item.enchantment ?? 0) >= HIGH_ENCHANTMENT ? itemBasePremium(item.type) * ENCHANTMENT_RISK : 0;
}
function loyaltyDiscount(base: number, years: number): number {
  return years >= LOYALTY_YEARS ? base * LOYALTY_DISCOUNT : 0;
}
function followUpDiscount(base: number, previousContracts: number): number {
  return previousContracts > 0 ? base * FOLLOW_UP_DISCOUNT : 0;
}
function quotePremium(items: Item[], years: number, previousContracts: number): number {
  const base = policyBasePremium(items);
  const risk = items.reduce((sum, item) => sum + curseSurcharge(item)
    + enchantmentSurcharge(item), 0);
  const loyalty = loyaltyDiscount(base, years);
  const followUp = followUpDiscount(base, previousContracts);
  return Math.ceil(base + risk + initialAssessment(base) - loyalty - followUp + PROCESSING_FEE);
}
interface Policy { items: Item[]; remainingCap: number }
const INSURANCE_VALUES: Record<string, number> = { sword: 1000, amulet: 600, staff: 800, potion: 400 };
const COMPONENT_VALUE = 250;
const CAP_MULTIPLIER = 2;
const DEDUCTIBLE = 100;
const CLAIM_ENCHANTMENT = 8;
const ENCHANTED_REIMBURSEMENT = 0.5;
function insuranceSum(items: Item[]): number {
  return items.reduce((sum, item) => sum +
    (COMPONENT_TYPES.includes(item.type) ? COMPONENT_VALUE : INSURANCE_VALUES[item.type]), 0);
}
function createPolicy(items: Item[]): Policy {
  return { items, remainingCap: insuranceSum(items) * CAP_MULTIPLIER };
}
function reimbursementRate(item: Item): number {
  return (item.enchantment ?? 0) >= CLAIM_ENCHANTMENT ? ENCHANTED_REIMBURSEMENT : 1;
}
function reportedDamageAmount(damage: Damage): number {
  if (damage.amount < 0) throw new Error('Damage amount must be nonnegative');
  return damage.amount;
}
function damageReimbursement(item: Item, damage: Damage): number {
  return Math.max(0, reportedDamageAmount(damage) * reimbursementRate(item) - DEDUCTIBLE);
}
function takeInsuredItem(available: Item[], type: string): Item {
  const index = available.findIndex(item => item.type === type);
  if (index < 0) throw new Error(`No insured item available: ${type}`);
  return available.splice(index, 1)[0];
}
function reimbursedDamages(items: Item[], damages: Damage[]): number {
  const available = [...items];
  return damages.reduce((sum, damage) => {
    const item = takeInsuredItem(available, damage.itemType);
    return sum + damageReimbursement(item, damage);
  }, 0);
}
function processClaim(policy: Policy, damages: Damage[]): Result {
  const payout = Math.floor(Math.min(reimbursedDamages(policy.items, damages), policy.remainingCap));
  policy.remainingCap -= payout;
  return { payout, remainingCap: policy.remainingCap };
}
export function runScenario(scenario: Scenario): { results: Result[] } {
  const policies = new Map<number, Policy>();
  let previousContracts = 0;
  return { results: scenario.steps.map((step, index) => {
    if (step.op === 'claim') return processClaim(policies.get(step.policy)!, step.incident.damages);
    const premium = quotePremium(step.items, scenario.customer.yearsWithMHPCO, previousContracts);
    previousContracts++;
    policies.set(index, createPolicy(step.items));
    return { premium };
  }) };
}
