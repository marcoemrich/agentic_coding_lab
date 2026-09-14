export interface Scenario {
  customer: { yearsWithMHPCO: number };
  steps: Array<QuoteStep | ClaimStep>;
}

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
interface Policy { items: Item[]; remainingCap: number }
type Result = { premium?: number; payout?: number; remainingCap?: number };

const INSURANCE_VALUE: Record<string, number> = {
  sword: 1000, amulet: 600, staff: 800, potion: 400, rune: 250, moonstone: 250,
};
const BASE_PREMIUM: Record<string, number> = { sword: 100, amulet: 60, staff: 80, potion: 40 };
const COMPONENT_TYPES = new Set(['rune', 'moonstone']);
const COMPONENT_PREMIUM = 25;
const BLOCK_SIZE = 3;
const BLOCK_PREMIUM = 60;
const CURSE_RATE = 0.5;
const HIGH_ENCHANTMENT_PREMIUM_LEVEL = 5;
const ENCHANTMENT_RATE = 0.3;
const LOYALTY_YEARS = 2;
const LOYALTY_RATE = 0.2;
const INITIAL_RATE = 0.1;
const FOLLOW_UP_RATE = 0.15;
const PROCESSING_FEE = 5;
const POLICY_CAP_MULTIPLIER = 2;
const HIGH_ENCHANTMENT_CLAIM_LEVEL = 8;
const HIGH_ENCHANTMENT_REIMBURSEMENT = 0.5;
const DEDUCTIBLE = 100;

function componentBasePremium(items: Item[]): number {
  const counts = new Map<string, number>();
  for (const item of items) {
    if (COMPONENT_TYPES.has(item.type)) counts.set(item.type, (counts.get(item.type) ?? 0) + 1);
  }
  return [...counts.values()].reduce(
    (sum, count) => sum + (count === BLOCK_SIZE ? BLOCK_PREMIUM : count * COMPONENT_PREMIUM), 0,
  );
}

function quoteBasePremium(items: Item[]): number {
  const mainItems = items.reduce((sum, item) => sum + (BASE_PREMIUM[item.type] ?? 0), 0);
  return mainItems + componentBasePremium(items);
}

function itemSurcharges(items: Item[]): number {
  return items.reduce((sum, item) => {
    const base = BASE_PREMIUM[item.type] ?? COMPONENT_PREMIUM;
    const curse = item.cursed ? base * CURSE_RATE : 0;
    const enchantment = (item.enchantment ?? 0) >= HIGH_ENCHANTMENT_PREMIUM_LEVEL ? base * ENCHANTMENT_RATE : 0;
    return sum + curse + enchantment;
  }, 0);
}

function quote(items: Item[], years: number, followUp: boolean): { premium: number; policy: Policy } {
  for (const item of items) {
    if (!(item.type in INSURANCE_VALUE)) throw new Error(`Unknown item type: ${item.type}`);
  }
  const base = quoteBasePremium(items);
  const loyalty = years >= LOYALTY_YEARS ? base * LOYALTY_RATE : 0;
  const contractDiscount = followUp ? base * FOLLOW_UP_RATE : 0;
  const premium = Math.ceil(base + itemSurcharges(items) - loyalty + base * INITIAL_RATE - contractDiscount + PROCESSING_FEE);
  const insuranceSum = items.reduce((sum, item) => sum + INSURANCE_VALUE[item.type], 0);
  return { premium, policy: { items, remainingCap: insuranceSum * POLICY_CAP_MULTIPLIER } };
}

function desiredClaimPayout(policy: Policy, damages: Damage[]): number {
  if (damages.some((damage) => damage.amount < 0)) throw new Error('Negative damage amount');
  const usedItems = new Set<number>();
  return damages.reduce((sum, damage) => {
    const index = policy.items.findIndex((item, candidate) => item.type === damage.itemType && !usedItems.has(candidate));
    if (index < 0) throw new Error(`Damaged item is not covered: ${damage.itemType}`);
    usedItems.add(index);
    const level = policy.items[index].enchantment ?? 0;
    const reimbursable = level >= HIGH_ENCHANTMENT_CLAIM_LEVEL
      ? damage.amount * HIGH_ENCHANTMENT_REIMBURSEMENT : damage.amount;
    return sum + Math.max(0, reimbursable - DEDUCTIBLE);
  }, 0);
}

function claim(policy: Policy, damages: Damage[]): Result {
  const payout = Math.floor(Math.min(desiredClaimPayout(policy, damages), policy.remainingCap));
  policy.remainingCap -= payout;
  return { payout, remainingCap: policy.remainingCap };
}

export function processScenario(scenario: Scenario): { results: Result[] } {
  let quoteCount = 0;
  const policies = new Map<number, Policy>();
  const results = scenario.steps.map((step, index) => {
    if (step.op === 'claim') {
      const policy = policies.get(step.policy);
      if (!policy) throw new Error(`Policy does not reference an earlier quote: ${step.policy}`);
      return claim(policy, step.incident.damages);
    }
    const result = quote(step.items, scenario.customer.yearsWithMHPCO, quoteCount > 0);
    quoteCount += 1;
    policies.set(index, result.policy);
    return { premium: result.premium };
  });
  return { results };
}
