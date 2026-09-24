export type Item = { type: string; material?: string; enchantment?: number; cursed?: boolean };
export type Step = { op: 'quote'; items: Item[] } | { op: 'claim'; policy: number; incident: { cause: string; damages: { itemType: string; amount: number }[] } };
export type Scenario = { customer: { yearsWithMHPCO: number }; steps: Step[] };
type Result = { premium: number } | { payout: number; remainingCap: number };

const prices: Record<string, { value: number; premium: number }> = {
  sword: { value: 1000, premium: 100 },
  amulet: { value: 600, premium: 60 },
  staff: { value: 800, premium: 80 },
  potion: { value: 400, premium: 40 },
  rune: { value: 250, premium: 25 },
  moonstone: { value: 250, premium: 25 },
};
const components = new Set(['rune', 'moonstone']);

function basePremiums(items: Item[]): number[] {
  const counts = new Map<string, number>();
  for (const item of items) {
    if (!Object.hasOwn(prices, item.type)) throw new Error(`Unknown item type: ${item.type}`);
    counts.set(item.type, (counts.get(item.type) ?? 0) + 1);
  }
  return items.map(item => components.has(item.type) && counts.get(item.type) === 3 ? 20 : prices[item.type].premium);
}

export function runScenario(scenario: Scenario): { results: Result[] } {
  const results: Result[] = [];
  const policies = new Map<number, { items: Item[]; remainingCap: number }>();
  let quotes = 0;
  for (const [index, step] of scenario.steps.entries()) {
    if (step.op === 'quote') {
      const bases = basePremiums(step.items);
      const base = bases.reduce((sum, value) => sum + value, 0);
      const surcharges = step.items.reduce((sum, item, i) => sum + bases[i] * ((item.cursed ? .5 : 0) + ((item.enchantment ?? 0) >= 5 ? .3 : 0)), 0);
      const premium = Math.ceil(base + surcharges + base * (.1 - (scenario.customer.yearsWithMHPCO >= 2 ? .2 : 0) - (quotes ? .15 : 0)) + 5);
      policies.set(index, { items: step.items, remainingCap: step.items.reduce((sum, item) => sum + prices[item.type].value * 2, 0) });
      quotes++;
      results.push({ premium });
    } else if (step.op === 'claim') {
      const policy = policies.get(step.policy);
      if (!policy) throw new Error(`Unknown policy: ${step.policy}`);
      const used = new Set<number>();
      let desired = 0;
      for (const damage of step.incident.damages) {
        if (!Number.isFinite(damage.amount) || damage.amount < 0) throw new Error(`Invalid damage amount: ${damage.amount}`);
        const itemIndex = policy.items.findIndex((item, i) => !used.has(i) && item.type === damage.itemType);
        if (itemIndex < 0) throw new Error(`Uninsured damage item: ${damage.itemType}`);
        used.add(itemIndex);
        const item = policy.items[itemIndex];
        desired += Math.max(0, damage.amount * ((item.enchantment ?? 0) >= 8 ? .5 : 1) - 100);
      }
      const payout = Math.min(policy.remainingCap, Math.floor(desired));
      policy.remainingCap -= payout;
      results.push({ payout, remainingCap: policy.remainingCap });
    } else {
      throw new Error('Unknown operation');
    }
  }
  return { results };
}
