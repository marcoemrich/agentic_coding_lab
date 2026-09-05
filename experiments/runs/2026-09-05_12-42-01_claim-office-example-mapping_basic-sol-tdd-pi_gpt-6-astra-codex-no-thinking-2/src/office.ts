export interface Item {
  type: string;
  material?: string;
  enchantment?: number;
  cursed?: boolean;
}
export interface Quote { op: 'quote'; items: Item[] }
export interface Damage { itemType: string; amount: number }
export interface Claim { op: 'claim'; policy: number; incident: { cause: string; damages: Damage[] } }
export interface Scenario { customer: { yearsWithMHPCO: number }; steps: (Quote | Claim)[] }
const PROCESSING_FEE = 5;
const FIRST_INSURANCE = 0.1;
const CURSE_SURCHARGE = 0.5;
const HIGH_ENCHANTMENT = 5;
const ENCHANTMENT_SURCHARGE = 0.3;
const LOYALTY_YEARS = 2;
const LOYALTY_DISCOUNT = 0.2;
const FOLLOW_UP_DISCOUNT = 0.15;
const BASE_PREMIUM: Record<string, number> = { sword: 100, amulet: 60, staff: 80, potion: 40, rune: 25, moonstone: 25 };

const BLOCK_SIZE = 3;
const BLOCK_PREMIUM = 60;
function itemBase(item: Item, items: Item[]) {
  if (!Object.hasOwn(BASE_PREMIUM, item.type)) throw new Error(`Unknown item type: ${item.type}`);
  const count = items.filter(other => other.type === item.type).length;
  return ['rune', 'moonstone'].includes(item.type) && count === BLOCK_SIZE
    ? BLOCK_PREMIUM / BLOCK_SIZE : BASE_PREMIUM[item.type];
}

function riskRate(item: Item) {
  const curse = item.cursed ? CURSE_SURCHARGE : 0;
  const enchantment = (item.enchantment ?? 0) >= HIGH_ENCHANTMENT ? ENCHANTMENT_SURCHARGE : 0;
  return curse + enchantment;
}

const DEDUCTIBLE = 100;
const CAP_MULTIPLIER = 2;
const INSURANCE_VALUE: Record<string, number> = { sword: 1000, amulet: 600, staff: 800, potion: 400, rune: 250, moonstone: 250 };
interface Policy { items: Item[]; remainingCap: number }
const REDUCED_REIMBURSEMENT_LEVEL = 8;
const REDUCED_REIMBURSEMENT = 0.5;
function damagePayout(damage: Damage, item: Item | undefined) {
  if (!item) throw new Error(`Item not insured: ${damage.itemType}`);
  if (damage.amount < 0) throw new Error('Damage amount must not be negative');
  const rate = (item.enchantment ?? 0) >= REDUCED_REIMBURSEMENT_LEVEL ? REDUCED_REIMBURSEMENT : 1;
  return Math.max(0, damage.amount * rate - DEDUCTIBLE);
}
function processClaim(claim: Claim, policy: Policy) {
  const available = [...policy.items];
  const desired = claim.incident.damages.reduce((sum, damage) => {
    const index = available.findIndex(item => item.type === damage.itemType);
    const item = index < 0 ? undefined : available.splice(index, 1)[0];
    return sum + damagePayout(damage, item);
  }, 0);
  const payout = Math.floor(Math.min(desired, policy.remainingCap));
  policy.remainingCap -= payout;
  return { payout, remainingCap: policy.remainingCap };
}

export function runScenario(scenario: Scenario) {
  let contracts = 0;
  const policies = new Map<number, Policy>();
  return { results: scenario.steps.map((step, index) => {
    if (step.op === 'claim') return processClaim(step, policies.get(step.policy)!);
    policies.set(index, { items: step.items, remainingCap: CAP_MULTIPLIER * step.items.reduce((sum, item) => sum + INSURANCE_VALUE[item.type], 0) });
    const base = step.items.reduce((sum, item) => sum + itemBase(item, step.items), 0);
    const risk = step.items.reduce((sum, item) =>
      sum + itemBase(item, step.items) * riskRate(item), 0);
    const loyalty = scenario.customer.yearsWithMHPCO >= LOYALTY_YEARS ? LOYALTY_DISCOUNT : 0;
    const followUp = contracts++ > 0 ? FOLLOW_UP_DISCOUNT : 0;
    return { premium: Math.ceil(base + risk + base * (FIRST_INSURANCE - loyalty - followUp) + PROCESSING_FEE) };
  }) };
}
