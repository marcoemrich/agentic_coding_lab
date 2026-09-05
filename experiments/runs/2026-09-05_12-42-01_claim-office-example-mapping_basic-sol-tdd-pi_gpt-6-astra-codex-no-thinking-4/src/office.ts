export interface Item { type: string; material?: string; enchantment?: number; cursed?: boolean }
export interface Quote { op: 'quote'; items: Item[] }
export interface Damage { itemType: string; amount: number }
export interface Claim { op: 'claim'; policy: number; incident: { cause: string; damages: Damage[] } }
export interface Scenario { customer: { yearsWithMHPCO: number }; steps: (Quote | Claim)[] }
const PROCESSING_FEE = 5;
const COMPONENT_BASE = 25;
const BASES: Record<string, number> = { sword: 100, amulet: 60, staff: 80, potion: 40, rune: COMPONENT_BASE, moonstone: COMPONENT_BASE };
const INITIAL_RATE = 0.1;
const CURSE_RATE = 0.5;
const LOYALTY_YEARS = 2;
const LOYALTY_RATE = 0.2;
const BLOCK_SIZE = 3;
const BLOCK_BASE = 60;
function itemBase(item: Item, items: Item[]): number {
  if (!Object.hasOwn(BASES, item.type)) throw new Error(`Unknown item type: ${item.type}`);
  const count = items.filter(candidate => candidate.type === item.type).length;
  return ['rune', 'moonstone'].includes(item.type) && count === BLOCK_SIZE ? BLOCK_BASE / BLOCK_SIZE : BASES[item.type];
}
const HIGH_ENCHANTMENT = 5;
const ENCHANTMENT_RATE = 0.3;
function riskRate(item: Item): number {
  return (item.cursed ? CURSE_RATE : 0) + ((item.enchantment ?? 0) >= HIGH_ENCHANTMENT ? ENCHANTMENT_RATE : 0);
}
const FOLLOW_UP_RATE = 0.15;
function premium(items: Item[], years: number, previousContracts: number): number {
  const base = items.reduce((sum, item) => sum + itemBase(item, items), 0);
  const risk = items.reduce((sum, item) => sum + itemBase(item, items) * riskRate(item), 0);
  const loyalty = years >= LOYALTY_YEARS ? base * LOYALTY_RATE : 0;
  const followUp = previousContracts > 0 ? base * FOLLOW_UP_RATE : 0;
  return Math.ceil(base + base * INITIAL_RATE + risk - loyalty - followUp + PROCESSING_FEE);
}
const DEDUCTIBLE = 100;
const COMPONENT_VALUE = 250;
const VALUES: Record<string, number> = { sword: 1000, rune: COMPONENT_VALUE, amulet: 600, staff: 800, potion: 400, moonstone: COMPONENT_VALUE };
const CAP_MULTIPLIER = 2;
const CLAIM_ENCHANTMENT = 8;
const ENCHANTED_REIMBURSEMENT = 0.5;
function reimbursement(damage: Damage, item: Item): number {
  if (damage.amount < 0) throw new Error('Damage amount must not be negative');
  const rate = (item.enchantment ?? 0) >= CLAIM_ENCHANTMENT ? ENCHANTED_REIMBURSEMENT : 1;
  return Math.max(0, damage.amount * rate - DEDUCTIBLE);
}
function damageTotal(damages: Damage[], items: Item[]): number {
  const available = [...items];
  return damages.reduce((sum, damage) => {
    const index = available.findIndex(item => item.type === damage.itemType);
    if (index < 0) throw new Error(`Damage exceeds coverage: ${damage.itemType}`);
    const [item] = available.splice(index, 1);
    return sum + reimbursement(damage, item);
  }, 0);
}
interface Policy { items: Item[]; remainingCap: number }
function settleClaim(step: Claim, policy: Policy) {
  const payout = Math.floor(Math.min(damageTotal(step.incident.damages, policy.items), policy.remainingCap));
  policy.remainingCap -= payout;
  return { payout, remainingCap: policy.remainingCap };
}
export function processScenario(scenario: Scenario) {
  const policies = new Map<number, Policy>();
  const results = scenario.steps.map((step, index) => {
    if (step.op === 'claim') return settleClaim(step, policies.get(step.policy)!);
    const price = premium(step.items, scenario.customer.yearsWithMHPCO, policies.size);
    const remainingCap = step.items.reduce((sum, item) => sum + VALUES[item.type], 0) * CAP_MULTIPLIER;
    policies.set(index, { items: step.items, remainingCap });
    return { premium: price };
  });
  return { results };
}
