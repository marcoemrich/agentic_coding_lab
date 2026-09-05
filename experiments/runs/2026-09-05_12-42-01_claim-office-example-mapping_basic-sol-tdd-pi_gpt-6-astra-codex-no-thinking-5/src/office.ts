export interface Item { type: string; material?: string; enchantment?: number; cursed?: boolean }
export interface Damage { itemType: string; amount: number }
export type Step = {op: 'quote'; items: Item[]} | {op: 'claim'; policy: number; incident: {cause: string; damages: Damage[]}};
export interface Scenario { customer: {yearsWithMHPCO: number}; steps: Step[] }
export type Result = {premium: number} | {payout: number; remainingCap: number};
const PROCESSING_FEE = 5;
const BASE_PREMIUMS: Record<string, number> = {sword: 100, amulet: 60, staff: 80, potion: 40, rune: 25, moonstone: 25};
const FIRST_INSURANCE = 0.1;
const CURSE_RISK = 0.5;
const HIGH_ENCHANTMENT = 5;
const ENCHANTMENT_RISK = 0.3;
function riskRate(item: Item): number {
  return (item.cursed ? CURSE_RISK : 0) + ((item.enchantment ?? 0) >= HIGH_ENCHANTMENT ? ENCHANTMENT_RISK : 0);
}
const BLOCK_SIZE = 3;
const BLOCK_PREMIUM = 60;
function itemBase(item: Item, items: Item[]): number {
  if (!Object.hasOwn(BASE_PREMIUMS, item.type)) throw new Error(`Unknown item type: ${item.type}`);
  const count = items.filter(other => other.type === item.type).length;
  return ['rune', 'moonstone'].includes(item.type) && count === BLOCK_SIZE ? BLOCK_PREMIUM / BLOCK_SIZE : BASE_PREMIUMS[item.type];
}
const LOYALTY_YEARS = 2;
const LOYALTY_DISCOUNT = 0.2;
const FOLLOW_UP_DISCOUNT = 0.15;
function premium(items: Item[], years: number, followUp: boolean): number {
  const base = items.reduce((sum, item) => sum + itemBase(item, items), 0);
  const risk = items.reduce((sum, item) => sum + itemBase(item, items) * riskRate(item), 0);
  const loyalty = years >= LOYALTY_YEARS ? base * LOYALTY_DISCOUNT : 0;
  const followUpDiscount = followUp ? base * FOLLOW_UP_DISCOUNT : 0;
  return Math.ceil(base + risk + base * FIRST_INSURANCE - loyalty - followUpDiscount + PROCESSING_FEE);
}
const INSURANCE_VALUES: Record<string, number> = {sword: 1000, amulet: 600, staff: 800, potion: 400, rune: 250, moonstone: 250};
const CAP_MULTIPLIER = 2;
const DEDUCTIBLE = 100;
interface Policy { items: Item[]; remainingCap: number }
const REDUCED_REIMBURSEMENT_LEVEL = 8;
const REDUCED_REIMBURSEMENT = 0.5;
function reimbursement(item: Item, amount: number): number {
  if (amount < 0) throw new Error('Damage amount must not be negative');
  const rate = (item.enchantment ?? 0) >= REDUCED_REIMBURSEMENT_LEVEL ? REDUCED_REIMBURSEMENT : 1;
  return Math.max(0, amount * rate - DEDUCTIBLE);
}
function takeDamagedItem(items: Item[], damage: Damage): Item {
  const index = items.findIndex(item => item.type === damage.itemType);
  if (index < 0) throw new Error(`Item not insured or coverage count exceeded: ${damage.itemType}`);
  return items.splice(index, 1)[0];
}
function processClaim(policy: Policy, damages: Damage[]): Result {
  const availableItems = [...policy.items];
  const desired = damages.reduce((sum, damage) => sum + reimbursement(takeDamagedItem(availableItems, damage), damage.amount), 0);
  const payout = Math.floor(Math.min(desired, policy.remainingCap));
  policy.remainingCap -= payout;
  return {payout, remainingCap: policy.remainingCap};
}
export function run(scenario: Scenario): {results: Result[]} {
  const policies = new Map<number, Policy>();
  let contracts = 0;
  return {results: scenario.steps.map((step, index) => {
    if (step.op === 'claim') return processClaim(policies.get(step.policy)!, step.incident.damages);
    const insuranceSum = step.items.reduce((sum, item) => sum + INSURANCE_VALUES[item.type], 0);
    policies.set(index, {items: step.items, remainingCap: insuranceSum * CAP_MULTIPLIER});
    const result = {premium: premium(step.items, scenario.customer.yearsWithMHPCO, contracts > 0)};
    contracts++;
    return result;
  })};
}
