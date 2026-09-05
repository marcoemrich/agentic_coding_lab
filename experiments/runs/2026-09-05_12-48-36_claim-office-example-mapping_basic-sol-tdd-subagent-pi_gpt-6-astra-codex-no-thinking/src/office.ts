export interface Item { type: string; material?: string; enchantment?: number; cursed?: boolean }
export interface Damage { itemType: string; amount: number }
export type Step = { op: 'quote'; items: Item[] } | { op: 'claim'; policy: number; incident: { cause: string; damages: Damage[] } };
export interface Scenario { customer: { yearsWithMHPCO: number }; steps: Step[] }
const PROCESSING_FEE = 5;
const COMPONENT_BASE_PREMIUM = 25;
const BASE_PREMIUMS: Record<string, number> = { sword: 100, amulet: 60, staff: 80, potion: 40, rune: COMPONENT_BASE_PREMIUM, moonstone: COMPONENT_BASE_PREMIUM };
const INITIAL_ASSESSMENT = 0.1;
const BLOCK_SIZE = 3;
const BLOCK_ITEM_PREMIUM = 20;
function itemBasePremium(item: Item, items: Item[]) {
  if (!Object.hasOwn(BASE_PREMIUMS, item.type)) throw new Error(`Unknown item type: ${item.type}`);
  if ((item.type === 'rune' || item.type === 'moonstone') && items.filter(other => other.type === item.type).length === BLOCK_SIZE) return BLOCK_ITEM_PREMIUM;
  return BASE_PREMIUMS[item.type];
}
const CURSE_SURCHARGE = 0.5;
const HIGH_ENCHANTMENT = 5;
const ENCHANTMENT_SURCHARGE = 0.3;
function riskRate(item: Item) {
  return (item.cursed ? CURSE_SURCHARGE : 0) + ((item.enchantment ?? 0) >= HIGH_ENCHANTMENT ? ENCHANTMENT_SURCHARGE : 0);
}
const LOYALTY_YEARS = 2;
const LOYALTY_DISCOUNT = 0.2;
const FOLLOW_UP_DISCOUNT = 0.15;
function premium(items: Item[], years: number, followUp: boolean) {
  const base = items.reduce((sum, item) => sum + itemBasePremium(item, items), 0);
  const risk = items.reduce((sum, item) => sum + itemBasePremium(item, items) * riskRate(item), 0);
  const loyaltyDiscount = years >= LOYALTY_YEARS ? base * LOYALTY_DISCOUNT : 0;
  const followUpDiscount = followUp ? base * FOLLOW_UP_DISCOUNT : 0;
  return Math.ceil(base + risk + base * INITIAL_ASSESSMENT - loyaltyDiscount - followUpDiscount + PROCESSING_FEE);
}
const COMPONENT_INSURANCE_VALUE = 250;
const INSURANCE_VALUES: Record<string, number> = { sword: 1000, amulet: 600, staff: 800, potion: 400, rune: COMPONENT_INSURANCE_VALUE, moonstone: COMPONENT_INSURANCE_VALUE };
const CAP_MULTIPLIER = 2;
const DEDUCTIBLE = 100;
const REDUCED_REIMBURSEMENT_ENCHANTMENT = 8;
const REDUCED_REIMBURSEMENT_RATE = 0.5;
interface Policy { items: Item[]; remainingCap: number }
function damagePayout(item: Item, damage: Damage) {
  if (damage.amount < 0) throw new Error('Damage amount must not be negative');
  const rate = (item.enchantment ?? 0) >= REDUCED_REIMBURSEMENT_ENCHANTMENT ? REDUCED_REIMBURSEMENT_RATE : 1;
  return Math.max(0, damage.amount * rate - DEDUCTIBLE);
}
function processClaim(policy: Policy, damages: Damage[]) {
  const availableItems = [...policy.items];
  const desiredPayout = damages.reduce((sum, damage) => {
    const index = availableItems.findIndex(item => item.type === damage.itemType);
    if (index === -1) throw new Error(`Uninsured item type: ${damage.itemType}`);
    const [insuredItem] = availableItems.splice(index, 1);
    return sum + damagePayout(insuredItem, damage);
  }, 0);
  const payout = Math.floor(Math.min(desiredPayout, policy.remainingCap));
  policy.remainingCap -= payout;
  return { payout, remainingCap: policy.remainingCap };
}
export function runScenario(scenario: Scenario) {
  const policies = new Map<number, Policy>();
  return { results: scenario.steps.map((step, stepIndex) => {
    if (step.op === 'claim') return processClaim(policies.get(step.policy)!, step.incident.damages);
    const result = { premium: premium(step.items, scenario.customer.yearsWithMHPCO, policies.size > 0) };
    policies.set(stepIndex, { items: step.items, remainingCap: CAP_MULTIPLIER * step.items.reduce((sum, item) => sum + INSURANCE_VALUES[item.type], 0) });
    return result;
  }) };
}
