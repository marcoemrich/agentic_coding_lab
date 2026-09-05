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
const prices: Record<string, { base: number; value: number }> = {
  sword: { base: 100, value: 1000 }, amulet: { base: 60, value: 600 },
  staff: { base: 80, value: 800 }, potion: { base: 40, value: 400 },
  rune: { base: 25, value: 250 }, moonstone: { base: 25, value: 250 },
};
export function runScenario(scenario: Scenario): { results: Result[] } {
  let quoteCount = 0;
  const policies = new Map<number, { items: Item[]; remainingCap: number }>();
  return { results: scenario.steps.map((step, index) => {
    if (step.op === 'claim') {
      const policy = policies.get(step.policy);
      if (!policy) throw new Error(`Invalid policy reference: ${step.policy}`);
      const available = [...policy.items];
      const desired = step.incident.damages.reduce((sum, damage) => {
        if (!Number.isInteger(damage.amount) || damage.amount < 0) throw new Error('Damage amount must be a non-negative integer');
        const itemIndex = available.findIndex(item => item.type === damage.itemType);
        if (itemIndex < 0) throw new Error(`Damage exceeds insured items of type: ${damage.itemType}`);
        const [item] = available.splice(itemIndex, 1);
        // High enchantment takes precedence over full reimbursement, including dragon material.
        return sum + Math.max(0, damage.amount / ((item.enchantment ?? 0) >= 8 ? 2 : 1) - 100);
      }, 0);
      const payout = Math.min(policy.remainingCap, Math.floor(desired));
      policy.remainingCap -= payout;
      return { payout, remainingCap: policy.remainingCap };
    }
    const bases = step.items.map(item => {
      if (!Object.hasOwn(prices, item.type)) throw new Error(`Unknown item type: ${item.type}`);
      const isComponent = item.type === 'rune' || item.type === 'moonstone';
      const count = step.items.filter(other => other.type === item.type).length;
      return isComponent && count === 3 ? 20 : prices[item.type].base;
    });
    const base = bases.reduce((sum, amount) => sum + amount, 0);
    const risk = step.items.reduce((sum, item, index) => sum + bases[index] *
      ((item.cursed ? 50 : 0) + ((item.enchantment ?? 0) >= 5 ? 30 : 0)), 0);
    const policyRate = 110 - (scenario.customer.yearsWithMHPCO >= 2 ? 20 : 0) - (quoteCount > 0 ? 15 : 0);
    quoteCount++;
    policies.set(index, { items: step.items, remainingCap: 2 * step.items.reduce((sum, item) => sum + prices[item.type].value, 0) });
    // Integer hundredths preserve fractions until the final rounding.
    return { premium: Math.ceil((base * policyRate + risk) / 100) + 5 };
  }) };
}
