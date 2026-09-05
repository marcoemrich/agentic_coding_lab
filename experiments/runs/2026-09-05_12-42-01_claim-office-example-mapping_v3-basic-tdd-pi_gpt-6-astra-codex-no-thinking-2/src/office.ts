export interface Item {
  type: string;
  material?: string;
  enchantment?: number;
  cursed?: boolean;
}
export type Step = { op: 'quote'; items: Item[] } | {
  op: 'claim'; policy: number;
  incident: { cause: string; damages: { itemType: string; amount: number }[] };
};
export interface Scenario { customer: { yearsWithMHPCO: number }; steps: Step[] }
export type Result = { premium: number } | { payout: number; remainingCap: number };

const prices: Record<string, number> = { sword: 100, amulet: 60, staff: 80, potion: 40, rune: 25, moonstone: 25 };

interface Policy { items: Item[]; remainingCap: number }

function settleClaim(policy: Policy, step: Extract<Step, { op: 'claim' }>): Result {
  const available = [...policy.items];
  let reimbursement = 0;
  for (const damage of step.incident.damages) {
    if (!Number.isInteger(damage.amount) || damage.amount < 0) throw new Error('Damage amount must be a non-negative integer');
    // Repeated types match successive insured items in their original order.
    const itemIndex = available.findIndex(item => item.type === damage.itemType);
    if (itemIndex < 0) throw new Error(`Damage item not insured: ${damage.itemType}`);
    const [item] = available.splice(itemIndex, 1);
    // Standard and dragon reimbursement are both full; high enchantment wins.
    reimbursement += Math.max(0, damage.amount * ((item.enchantment ?? 0) >= 8 ? 0.5 : 1) - 100);
  }
  const payout = Math.min(policy.remainingCap, Math.floor(reimbursement));
  policy.remainingCap -= payout;
  return { payout, remainingCap: policy.remainingCap };
}

function basePremium(item: Item, items: Item[]): number {
  const component = item.type === 'rune' || item.type === 'moonstone';
  return component && items.filter(other => other.type === item.type).length === 3 ? 20 : prices[item.type];
}

export function runScenario(scenario: Scenario): { results: Result[] } {
  let contracts = 0;
  const policies = new Map<number, Policy>();
  return { results: scenario.steps.map((step, index) => {
    if (step.op === 'claim') {
      const policy = policies.get(step.policy);
      if (!policy) throw new Error(`Invalid policy reference: ${step.policy}`);
      return settleClaim(policy, step);
    }
    for (const item of step.items) {
      if (!Object.hasOwn(prices, item.type)) throw new Error(`Unknown item type: ${item.type}`);
    }
    policies.set(index, { items: step.items, remainingCap: step.items.reduce((sum, item) => sum + prices[item.type] * 20, 0) });
    const base = step.items.reduce((sum, item) => sum + basePremium(item, step.items), 0);
    const risk = step.items.reduce((sum, item) => sum + basePremium(item, step.items) * ((item.cursed ? 50 : 0) + ((item.enchantment ?? 0) >= 5 ? 30 : 0)), 0);
    // Integer percentage points preserve fractions until the final rounding.
    const policyPercent = 110 - (scenario.customer.yearsWithMHPCO >= 2 ? 20 : 0) - (contracts > 0 ? 15 : 0);
    contracts++;
    return { premium: Math.ceil((base * policyPercent + risk) / 100 + 5) };
  }) };
}
