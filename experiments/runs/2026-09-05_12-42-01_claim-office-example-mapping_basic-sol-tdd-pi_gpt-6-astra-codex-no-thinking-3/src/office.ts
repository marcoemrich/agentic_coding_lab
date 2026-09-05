export interface Item { type: string; material?: string; enchantment?: number; cursed?: boolean }
export interface Damage { itemType: string; amount: number }
export interface Quote { op: 'quote'; items: Item[] }
export interface Claim { op: 'claim'; policy: number; incident: { cause: string; damages: Damage[] } }
export interface Scenario { customer: { yearsWithMHPCO: number }; steps: (Quote | Claim)[] }
const PROCESSING_FEE = 5;
const BASE_PREMIUMS: Record<string, number> = { sword: 100, amulet: 60, staff: 80, potion: 40, rune: 25, moonstone: 25 };
const INITIAL_RATE = 0.1;
const CURSE_RATE = 0.5;
const HIGH_ENCHANTMENT = 5;
const ENCHANTMENT_RATE = 0.3;
function riskRate(item: Item) {
  return (item.cursed ? CURSE_RATE : 0) + ((item.enchantment ?? 0) >= HIGH_ENCHANTMENT ? ENCHANTMENT_RATE : 0);
}
const BLOCK_SIZE = 3;
const BLOCK_ITEM_PREMIUM = 20;
function itemBase(item: Item, items: Item[]) {
  if (!Object.hasOwn(BASE_PREMIUMS, item.type)) throw new Error(`Unknown item type: ${item.type}`);
  if (['rune', 'moonstone'].includes(item.type) && items.filter(other => other.type === item.type).length === BLOCK_SIZE) return BLOCK_ITEM_PREMIUM;
  return BASE_PREMIUMS[item.type];
}
const LOYALTY_YEARS = 2;
const LOYALTY_RATE = 0.2;
const FOLLOW_UP_RATE = 0.15;
function policyRate(years: number, previousContracts: number) {
  return INITIAL_RATE - (years >= LOYALTY_YEARS ? LOYALTY_RATE : 0) - (previousContracts > 0 ? FOLLOW_UP_RATE : 0);
}
function premium(items: Item[], years: number, previousContracts: number) {
  const base = items.reduce((sum, item) => sum + itemBase(item, items), 0);
  const risk = items.reduce((sum, item) => sum + itemBase(item, items) * riskRate(item), 0);
  return Math.ceil(base + risk + base * policyRate(years, previousContracts) + PROCESSING_FEE);
}
const INSURANCE_VALUES: Record<string, number> = { sword: 1000, rune: 250, amulet: 600, staff: 800, potion: 400, moonstone: 250 };
const CAP_MULTIPLIER = 2;
const DEDUCTIBLE = 100;
interface Policy { items: Item[]; remainingCap: number }
const REDUCED_REIMBURSEMENT_LEVEL = 8;
const REDUCED_REIMBURSEMENT_RATE = 0.5;
function reimbursement(item: Item, amount: number) {
  if (amount < 0) throw new Error('Damage amount must not be negative');
  const rate = (item.enchantment ?? 0) >= REDUCED_REIMBURSEMENT_LEVEL ? REDUCED_REIMBURSEMENT_RATE : 1;
  return Math.max(0, amount * rate - DEDUCTIBLE);
}
function settle(policy: Policy, damages: Damage[]) {
  const available = [...policy.items];
  const desired = damages.reduce((sum, damage) => {
    const index = available.findIndex(item => item.type === damage.itemType);
    if (index < 0) throw new Error(`No insured item available: ${damage.itemType}`);
    const [item] = available.splice(index, 1);
    return sum + reimbursement(item, damage.amount);
  }, 0);
  const payout = Math.floor(Math.min(desired, policy.remainingCap));
  policy.remainingCap -= payout;
  return { payout, remainingCap: policy.remainingCap };
}
export function processScenario(scenario: Scenario) {
  let contracts = 0;
  const policies = new Map<number, Policy>();
  return { results: scenario.steps.map((step, index) => {
    if (step.op === 'claim') return settle(policies.get(step.policy)!, step.incident.damages);
    const remainingCap = step.items.reduce((sum, item) => sum + INSURANCE_VALUES[item.type], 0) * CAP_MULTIPLIER;
    policies.set(index, { items: step.items, remainingCap });
    return { premium: premium(step.items, scenario.customer.yearsWithMHPCO, contracts++) };
  }) };
}
