import { validateScenario } from './validation';

export interface Item {
  type: string;
  material?: string;
  enchantment?: number;
  cursed?: boolean;
}
export interface QuoteStep { op: 'quote'; items: Item[] }
export interface ClaimStep {
  op: 'claim';
  policy: number;
  incident: { cause: string; damages: { itemType: string; amount: number }[] };
}
export interface Scenario {
  customer: { yearsWithMHPCO: number };
  steps: (QuoteStep | ClaimStep)[];
}
export type Result = { premium: number } | { payout: number; remainingCap: number };
interface Policy { items: Item[]; remainingCap: number }

const prices: Record<string, { value: number; base: number }> = {
  sword: { value: 1000, base: 100 },
  amulet: { value: 600, base: 60 },
  staff: { value: 800, base: 80 },
  potion: { value: 400, base: 40 },
  rune: { value: 250, base: 25 },
  moonstone: { value: 250, base: 25 },
};
const rules = {
  blockSize: 3, blockItemBase: 20, cursePercent: 50,
  highEnchantment: 5, enchantmentPercent: 30, loyaltyYears: 2,
  loyaltyPercent: 20, firstPercent: 10, followUpPercent: 15,
  fee: 5, percentScale: 100, deductible: 100, claimEnchantment: 8,
  reimbursementDivisor: 2, capMultiplier: 2,
};

function itemBase(item: Item, items: Item[]): number {
  const isComponent = item.type === 'rune' || item.type === 'moonstone';
  if (isComponent && items.filter(other => other.type === item.type).length === rules.blockSize) return rules.blockItemBase;
  return prices[item.type].base;
}

function premium(items: Item[], years: number, followUp: boolean): number {
  const base = items.reduce((sum, item) => sum + itemBase(item, items), 0);
  const risk = items.reduce((sum, item) => {
    const percent = (item.cursed ? rules.cursePercent : 0)
      + ((item.enchantment ?? 0) >= rules.highEnchantment ? rules.enchantmentPercent : 0);
    return sum + itemBase(item, items) * percent;
  }, 0);
  const policyPercent = rules.percentScale + rules.firstPercent
    - (years >= rules.loyaltyYears ? rules.loyaltyPercent : 0)
    - (followUp ? rules.followUpPercent : 0);
  // Integer hundredths preserve fractions until the final rounding.
  return Math.ceil((base * policyPercent + risk) / rules.percentScale + rules.fee);
}

function createPolicy(items: Item[]): Policy {
  for (const item of items) {
    if (!Object.hasOwn(prices, item.type)) throw new Error(`Unknown item type: ${item.type}`);
  }
  const insuranceSum = items.reduce((sum, item) => sum + prices[item.type].value, 0);
  return { items, remainingCap: rules.capMultiplier * insuranceSum };
}

function settleClaim(policy: Policy, step: ClaimStep): Result {
  // Match repeated types in policy order, consuming each insured item once per claim.
  const available = [...policy.items];
  const desired = step.incident.damages.reduce((sum, damage) => {
    const itemIndex = available.findIndex(item => item.type === damage.itemType);
    if (itemIndex < 0) throw new Error(`Damage exceeds insured items: ${damage.itemType}`);
    const [item] = available.splice(itemIndex, 1);
    // High enchantment takes precedence even for dragon material; all other items
    // (including dragon material) are fully reimbursed before the deductible.
    const reimbursement = (item.enchantment ?? 0) >= rules.claimEnchantment
      ? damage.amount / rules.reimbursementDivisor : damage.amount;
    return sum + Math.max(0, reimbursement - rules.deductible);
  }, 0);
  const payout = Math.floor(Math.min(desired, policy.remainingCap));
  policy.remainingCap -= payout;
  return { payout, remainingCap: policy.remainingCap };
}

export function processScenario(scenario: unknown): { results: Result[] } {
  validateScenario(scenario);
  let contracts = 0;
  const policies = new Map<number, Policy>();
  const results = scenario.steps.map((step, index) => {
    if (step.op === 'claim') {
      const policy = policies.get(step.policy);
      if (!policy) throw new Error('Claim must reference an earlier quote');
      return settleClaim(policy, step);
    }
    policies.set(index, createPolicy(step.items));
    const result = { premium: premium(step.items, scenario.customer.yearsWithMHPCO, contracts > 0) };
    contracts++;
    return result;
  });
  return { results };
}
