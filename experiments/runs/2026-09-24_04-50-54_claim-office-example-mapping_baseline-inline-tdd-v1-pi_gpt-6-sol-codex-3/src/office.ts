export interface Item {
  type: string;
  material?: string;
  enchantment?: number;
  cursed?: boolean;
}
export interface Damage { itemType: string; amount: number }
export type Step = { op: 'quote'; items: Item[] } | { op: 'claim'; policy: number; incident: { cause: string; damages: Damage[] } };
export interface Scenario { customer: { yearsWithMHPCO: number }; steps: Step[] }
export type Result = { premium: number } | { payout: number; remainingCap: number };

const prices: Record<string, number> = { sword: 100, amulet: 60, staff: 80, potion: 40, rune: 25, moonstone: 25 };
const values: Record<string, number> = { sword: 1000, amulet: 600, staff: 800, potion: 400, rune: 250, moonstone: 250 };

function price(item: Item): number {
  if (!Object.hasOwn(prices, item.type)) throw new Error(`Unknown item type: ${item.type}`);
  return prices[item.type];
}

export function runScenario(scenario: Scenario): { results: Result[] } {
  const results: Result[] = [];
  let quoteCount = 0;
  const policies = new Map<number, { items: Item[]; remainingCap: number }>();
  for (const [index, step] of scenario.steps.entries()) {
    if (step.op === 'quote') {
      const counts = new Map<string, number>();
      for (const item of step.items) {
        price(item);
        counts.set(item.type, (counts.get(item.type) ?? 0) + 1);
      }
      const base = step.items.reduce((total, item) => total + price(item), 0)
        - [...counts].reduce((discount, [type, count]) => discount +
          (['rune', 'moonstone'].includes(type) && count === 3 ? 15 : 0), 0);
      const surcharges = step.items.reduce((total, item) => total +
        price(item) * ((item.cursed ? 50 : 0) + ((item.enchantment ?? 0) >= 5 ? 30 : 0)), 0);
      const policyRate = 10 - (scenario.customer.yearsWithMHPCO >= 2 ? 20 : 0) - (quoteCount > 0 ? 15 : 0);
      results.push({ premium: Math.ceil((base * (100 + policyRate) + surcharges + 500) / 100) });
      policies.set(index, { items: step.items, remainingCap: step.items.reduce((sum, item) => sum + 2 * values[item.type], 0) });
      quoteCount++;
    } else {
      const policy = policies.get(step.policy);
      if (!policy) throw new Error(`Unknown policy: ${step.policy}`);
      const used = new Set<number>();
      let desired = 0;
      for (const damage of step.incident.damages) {
        if (!Number.isInteger(damage.amount) || damage.amount < 0) throw new Error('Invalid damage amount');
        const position = policy.items.findIndex((item, i) => item.type === damage.itemType && !used.has(i));
        if (position < 0) throw new Error(`Uninsured or excess damage: ${damage.itemType}`);
        used.add(position);
        const item = policy.items[position];
        const reimbursed = (item.enchantment ?? 0) >= 8 ? damage.amount / 2 : damage.amount;
        desired += Math.max(0, reimbursed - 100);
      }
      const payout = Math.min(policy.remainingCap, Math.floor(desired));
      policy.remainingCap -= payout;
      results.push({ payout, remainingCap: policy.remainingCap });
    }
  }
  return { results };
}
