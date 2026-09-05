export interface Item { type: string; material?: string; enchantment?: number; cursed?: boolean }
export interface Damage { itemType: string; amount: number }
export type Step = { op: 'quote'; items: Item[] } | { op: 'claim'; policy: number; incident: { cause: string; damages: Damage[] } };
export interface Scenario { customer: { yearsWithMHPCO: number }; steps: Step[] }
export type Result = { premium: number } | { payout: number; remainingCap: number };

const prices: Record<string, number> = { sword: 100, amulet: 60, staff: 80, potion: 40, rune: 25, moonstone: 25 };
const insuranceValues: Record<string, number> = { sword: 1000, amulet: 600, staff: 800, potion: 400, rune: 250, moonstone: 250 };

export function runScenario(scenario: Scenario): { results: Result[] } {
  let contracts = 0;
  const policies = new Map<number, { items: Item[]; remainingCap: number }>();
  return { results: scenario.steps.map((step, stepIndex) => {
    if (step.op === 'claim') {
      const policy = policies.get(step.policy);
      if (!policy) throw new Error(`Invalid policy: ${step.policy}`);
      const available = [...policy.items];
      const raw = step.incident.damages.reduce((sum, damage) => {
        if (!Number.isInteger(damage.amount) || damage.amount < 0) throw new Error('Damage amount must be a non-negative integer');
        const index = available.findIndex(item => item.type === damage.itemType);
        if (index < 0) throw new Error(`Item not insured or too many damages: ${damage.itemType}`);
        // Repeated types consume insured items in their original order.
        const [item] = available.splice(index, 1);
        // High enchantment wins; dragon and standard material both reimburse fully otherwise.
        return sum + Math.max(0, damage.amount * ((item.enchantment ?? 0) >= 8 ? 0.5 : 1) - 100);
      }, 0);
      const payout = Math.min(policy.remainingCap, Math.floor(raw));
      policy.remainingCap -= payout;
      return { payout, remainingCap: policy.remainingCap };
    }
    for (const item of step.items) {
      if (!Object.hasOwn(prices, item.type)) throw new Error(`Unknown item type: ${item.type}`);
    }
    policies.set(stepIndex, { items: step.items, remainingCap: step.items.reduce((sum, item) => sum + insuranceValues[item.type] * 2, 0) });
    const bases = step.items.map(item => {
      const component = item.type === 'rune' || item.type === 'moonstone';
      const count = step.items.filter(other => other.type === item.type).length;
      return component && count === 3 ? 20 : prices[item.type];
    });
    const base = bases.reduce((sum, value) => sum + value, 0);
    // Accumulate percentage numerators to avoid rounding intermediate amounts.
    const risk = step.items.reduce((sum, item, index) => sum + bases[index] * ((item.cursed ? 50 : 0) + ((item.enchantment ?? 0) >= 5 ? 30 : 0)), 0);
    const policyPercent = 110 - (scenario.customer.yearsWithMHPCO >= 2 ? 20 : 0) - (contracts > 0 ? 15 : 0);
    contracts++;
    return { premium: Math.ceil((base * policyPercent + risk) / 100 + 5) };
  }) };
}
