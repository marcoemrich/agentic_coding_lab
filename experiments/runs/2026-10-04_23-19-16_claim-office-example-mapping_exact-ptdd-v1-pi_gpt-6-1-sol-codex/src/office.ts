export interface Item {
  type: string;
  material?: string;
  enchantment?: number;
  cursed?: boolean;
}
export interface Damage { itemType: string; amount: number }
export type Step = { op: 'quote'; items: Item[] } | {
  op: 'claim'; policy: number; incident: { cause: string; damages: Damage[] };
};
export interface Scenario { customer: { yearsWithMHPCO: number }; steps: Step[] }
const COMPONENT_PREMIUM = 25;
const BASE_PREMIUM: Record<string, number> = {
  sword: 100, amulet: 60, staff: 80, potion: 40, rune: COMPONENT_PREMIUM, moonstone: COMPONENT_PREMIUM,
};
const BLOCK_SIZE = 3;
const BLOCK_PREMIUM = 60;
function isComponentBlock(type: string, count: number): boolean {
  return count === BLOCK_SIZE && (type === 'rune' || type === 'moonstone');
}
function cataloguePremium(type: string): number {
  if (!Object.hasOwn(BASE_PREMIUM, type)) throw new Error(`Unknown item type: ${type}`);
  return BASE_PREMIUM[type];
}
export function basePremium(items: Item[]): number {
  const counts = new Map<string, number>();
  for (const item of items) counts.set(item.type, (counts.get(item.type) ?? 0) + 1);
  let premium = 0;
  for (const [type, count] of counts) {
    premium += isComponentBlock(type, count) ? BLOCK_PREMIUM : cataloguePremium(type) * count;
  }
  return premium;
}
const COMPONENT_VALUE = 250;
const INSURANCE_VALUE: Record<string, number> = {
  sword: 1000, amulet: 600, staff: 800, potion: 400, rune: COMPONENT_VALUE, moonstone: COMPONENT_VALUE,
};
export function insuranceSum(items: Item[]): number {
  return items.reduce((sum, item) => sum + (INSURANCE_VALUE[item.type] ?? 0), 0);
}
const PROCESSING_FEE = 5;
const CURSE_SURCHARGE = 0.5;
const FIRST_INSURANCE_SURCHARGE = 0.1;
const HIGH_ENCHANTMENT = 5;
const ENCHANTMENT_SURCHARGE = 0.3;
function isHighlyEnchanted(item: Item): boolean {
  return (item.enchantment ?? 0) >= HIGH_ENCHANTMENT;
}
function itemRiskSurcharge(item: Item): number {
  const curse = item.cursed ? CURSE_SURCHARGE : 0;
  const enchantment = isHighlyEnchanted(item) ? ENCHANTMENT_SURCHARGE : 0;
  return cataloguePremium(item.type) * (curse + enchantment);
}
const LOYALTY_YEARS = 2;
const LOYALTY_DISCOUNT = 0.2;
function qualifiesForLoyalty(years: number): boolean {
  return years >= LOYALTY_YEARS;
}
const FOLLOW_UP_DISCOUNT = 0.15;
function policyAdjustment(base: number, years: number, priorContracts: number): number {
  const loyalty = qualifiesForLoyalty(years) ? LOYALTY_DISCOUNT : 0;
  const followUp = priorContracts > 0 ? FOLLOW_UP_DISCOUNT : 0;
  return base * (FIRST_INSURANCE_SURCHARGE - loyalty - followUp);
}
function quotePremium(items: Item[], years: number, priorContracts: number): number {
  const base = basePremium(items);
  const risk = items.reduce((sum, item) => sum + itemRiskSurcharge(item), 0);
  return Math.ceil(base + risk + policyAdjustment(base, years, priorContracts) + PROCESSING_FEE);
}
interface Policy { items: Item[]; remainingCap: number }
interface Result { premium?: number; payout?: number; remainingCap?: number }
const CAP_MULTIPLIER = 2;
function createPolicy(items: Item[]): Policy {
  return { items, remainingCap: insuranceSum(items) * CAP_MULTIPLIER };
}
const DEDUCTIBLE = 100;
const CLAIM_ENCHANTMENT_THRESHOLD = 8;
const HIGH_ENCHANTMENT_REIMBURSEMENT = 0.5;
function reimbursementRate(item: Item): number {
  if (item.type === 'rune' || item.type === 'moonstone') return 1;
  return (item.enchantment ?? 0) >= CLAIM_ENCHANTMENT_THRESHOLD ? HIGH_ENCHANTMENT_REIMBURSEMENT : 1;
}
function damagePayout(item: Item, damage: Damage): number {
  if (damage.amount < 0) throw new Error('Damage amount must not be negative');
  return Math.max(0, damage.amount * reimbursementRate(item) - DEDUCTIBLE);
}
function coveredDamageItems(items: Item[], damages: Damage[]) {
  const available = [...items];
  return damages.map(damage => {
    const index = available.findIndex(item => item.type === damage.itemType);
    if (index < 0) throw new Error(`Damage item is not covered: ${damage.itemType}`);
    const item = available.splice(index, 1)[0];
    return { item, damage };
  });
}
function settlePayout(policy: Policy, desired: number): Result {
  const payout = Math.floor(Math.min(desired, policy.remainingCap));
  policy.remainingCap -= payout;
  return { payout, remainingCap: policy.remainingCap };
}
function processClaim(policy: Policy, damages: Damage[]): Result {
  const covered = coveredDamageItems(policy.items, damages);
  const desired = covered.reduce((sum, { item, damage }) => sum + damagePayout(item, damage), 0);
  return settlePayout(policy, desired);
}
export function runScenario(scenario: Scenario): { results: Result[] } {
  const policies = new Map<number, Policy>();
  let contracts = 0;
  const results = scenario.steps.map((step, index): Result => {
    if (step.op === 'claim') {
      return processClaim(policies.get(step.policy)!, step.incident.damages);
    }
    const premium = quotePremium(step.items, scenario.customer.yearsWithMHPCO, contracts);
    policies.set(index, createPolicy(step.items));
    contracts += 1;
    return { premium };
  });
  return { results };
}
