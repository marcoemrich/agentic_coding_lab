import { readFileSync } from 'node:fs';

const PROCESSING_FEE = 5;
const INITIAL_RATE = 0.1;
const BASE_PREMIUMS: Record<string, number> = { sword: 100, amulet: 60, staff: 80, potion: 40, rune: 25, moonstone: 25 };
const CURSE_RATE = 0.5;
const HIGH_ENCHANTMENT_MINIMUM = 5;
const ENCHANTMENT_RATE = 0.3;
interface Item { type: string; cursed?: boolean; enchantment?: number }
interface Quote { op: 'quote'; items: Item[] }
interface Damage { itemType: string; amount: number }
interface Claim { op: 'claim'; policy: number; incident: { cause: string; damages: Damage[] } }
interface Scenario { customer: { yearsWithMHPCO: number }; steps: (Quote | Claim)[] }
const BLOCK_SIZE = 3;
const BLOCK_ITEM_PREMIUM = 20;
function itemBase(item: Item, items: Item[]) {
  if (!Object.hasOwn(BASE_PREMIUMS, item.type)) throw new Error(`Unknown item type: ${item.type}`);
  const count = items.filter(candidate => candidate.type === item.type).length;
  if (['rune', 'moonstone'].includes(item.type) && count === BLOCK_SIZE) return BLOCK_ITEM_PREMIUM;
  return BASE_PREMIUMS[item.type];
}
const LOYALTY_YEARS = 2;
const LOYALTY_RATE = 0.2;
const FOLLOW_UP_RATE = 0.15;
function premium(items: Item[], yearsWithMHPCO: number, previousContracts: number) {
  const base = items.reduce((sum, item) => sum + itemBase(item, items), 0);
  const risk = items.reduce((sum, item) => {
    const rate = (item.cursed ? CURSE_RATE : 0) + ((item.enchantment ?? 0) >= HIGH_ENCHANTMENT_MINIMUM ? ENCHANTMENT_RATE : 0);
    return sum + itemBase(item, items) * rate;
  }, 0);
  const loyalty = yearsWithMHPCO >= LOYALTY_YEARS ? base * LOYALTY_RATE : 0;
  const followUp = previousContracts > 0 ? base * FOLLOW_UP_RATE : 0;
  return Math.ceil(base + risk + base * INITIAL_RATE - loyalty - followUp + PROCESSING_FEE);
}
const INSURANCE_VALUES: Record<string, number> = { sword: 1000, amulet: 600, rune: 250, staff: 800, potion: 400, moonstone: 250 };
const CAP_MULTIPLIER = 2;
const DEDUCTIBLE = 100;
const REDUCED_REIMBURSEMENT_MINIMUM = 8;
const REDUCED_REIMBURSEMENT_RATE = 0.5;
interface Policy { items: Item[]; remainingCap: number }
function settle(step: Claim, policy: Policy) {
  const availableItems = [...policy.items];
  const desiredPayout = step.incident.damages.reduce((sum, damage) => {
    if (damage.amount < 0) throw new Error('Damage amount must not be negative');
    const itemIndex = availableItems.findIndex(candidate => candidate.type === damage.itemType);
    if (itemIndex < 0) throw new Error(`Item not covered: ${damage.itemType}`);
    const [item] = availableItems.splice(itemIndex, 1);
    const rate = (item.enchantment ?? 0) >= REDUCED_REIMBURSEMENT_MINIMUM ? REDUCED_REIMBURSEMENT_RATE : 1;
    return sum + Math.max(0, damage.amount * rate - DEDUCTIBLE);
  }, 0);
  const payout = Math.floor(Math.min(desiredPayout, policy.remainingCap));
  policy.remainingCap -= payout;
  return { payout, remainingCap: policy.remainingCap };
}
const scenario = JSON.parse(readFileSync(0, 'utf8')) as Scenario;
let previousContracts = 0;
const policies = new Map<number, Policy>();
const results = scenario.steps.map((step, stepIndex) => {
  if (step.op === 'claim') return settle(step, policies.get(step.policy)!);
  const insuranceSum = step.items.reduce((sum, item) => sum + INSURANCE_VALUES[item.type], 0);
  policies.set(stepIndex, { items: step.items, remainingCap: insuranceSum * CAP_MULTIPLIER });
  return { premium: premium(step.items, scenario.customer.yearsWithMHPCO, previousContracts++) };
});
process.stdout.write(JSON.stringify({ results }));
