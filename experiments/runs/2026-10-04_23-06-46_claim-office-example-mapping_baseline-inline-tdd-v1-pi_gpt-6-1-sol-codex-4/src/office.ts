import { validateScenario } from './validation';

export type ItemType = 'sword' | 'amulet' | 'staff' | 'potion' | 'rune' | 'moonstone';
export interface Item {
  type: ItemType;
  material?: string;
  enchantment?: number;
  cursed?: boolean;
}
export interface QuoteStep { op: 'quote'; items: Item[] }
export interface ClaimStep {
  op: 'claim';
  policy: number;
  incident: { cause: string; damages: { itemType: ItemType; amount: number }[] };
}
export interface Scenario {
  customer: { yearsWithMHPCO: number };
  steps: (QuoteStep | ClaimStep)[];
}
export type Result = { premium: number } | { payout: number; remainingCap: number };
interface Policy { items: Item[]; remainingCap: number }

const prices: Record<ItemType, { premium: number; value: number }> = {
  sword: { premium: 100, value: 1000 },
  amulet: { premium: 60, value: 600 },
  staff: { premium: 80, value: 800 },
  potion: { premium: 40, value: 400 },
  rune: { premium: 25, value: 250 },
  moonstone: { premium: 25, value: 250 },
};
const rules = {
  percent: 100, cursed: 50, enchanted: 30, premiumEnchantment: 5,
  loyaltyYears: 2, loyalty: 20, assessment: 10, followUp: 15, fee: 5,
  blockCount: 3, blockItemPremium: 20, capMultiplier: 2,
  claimEnchantment: 8, reimbursementDivisor: 2, deductible: 100,
};

function basePremium(item: Item, items: Item[]): number {
  if (!Object.hasOwn(prices, item.type)) throw new Error(`Unknown item type: ${item.type}`);
  const block = (item.type === 'rune' || item.type === 'moonstone')
    && items.filter(other => other.type === item.type).length === rules.blockCount;
  return block ? rules.blockItemPremium : prices[item.type].premium;
}

function premium(items: Item[], years: number, followUp: boolean): number {
  const bases = items.map(item => basePremium(item, items));
  const base = bases.reduce((sum, value) => sum + value, 0);
  const risks = items.reduce((sum, item, index) => sum + bases[index]
    * ((item.cursed ? rules.cursed : 0)
      + ((item.enchantment ?? 0) >= rules.premiumEnchantment ? rules.enchanted : 0)), 0);
  const policyRate = rules.percent + rules.assessment
    - (years >= rules.loyaltyYears ? rules.loyalty : 0) - (followUp ? rules.followUp : 0);
  // Integer hundredths preserve fractions without floating-point percentage drift.
  return Math.ceil((base * policyRate + risks + rules.fee * rules.percent) / rules.percent);
}

function settleClaim(policy: Policy, step: ClaimStep): Result {
  // Match same-type damages to successive covered items in policy order.
  const available = [...policy.items];
  const desired = step.incident.damages.reduce((sum, damage) => {
    if (damage.amount < 0) throw new Error('Damage amount must not be negative');
    const itemIndex = available.findIndex(item => item.type === damage.itemType);
    if (itemIndex < 0) throw new Error(`Item is not insured or exceeds covered count: ${damage.itemType}`);
    const [item] = available.splice(itemIndex, 1);
    // Standard and dragon material reimburse fully; high enchantment takes precedence.
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
  const results = scenario.steps.map((step, index): Result => {
    if (step.op === 'claim') {
      const policy = policies.get(step.policy);
      if (!policy) throw new Error(`Invalid policy reference: ${step.policy}`);
      return settleClaim(policy, step);
    }
    const result = { premium: premium(step.items, scenario.customer.yearsWithMHPCO, contracts > 0) };
    contracts++;
    const insuranceSum = step.items.reduce((sum, item) => sum + prices[item.type].value, 0);
    policies.set(index, { items: step.items, remainingCap: insuranceSum * rules.capMultiplier });
    return result;
  });
  return { results };
}
