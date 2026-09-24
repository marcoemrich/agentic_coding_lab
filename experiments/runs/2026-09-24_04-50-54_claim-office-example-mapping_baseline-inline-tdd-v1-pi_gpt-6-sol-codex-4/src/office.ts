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
interface Policy { items: Item[]; remainingCap: number }

export function runScenario(scenario: Scenario): { results: Result[] } {
  const results: Result[] = [];
  const policies = new Map<number, Policy>();
  for (const [stepIndex, step] of scenario.steps.entries()) {
    if (step.op === 'quote') {
      for (const item of step.items) {
        if (!Object.hasOwn(prices, item.type)) throw new Error(`Unknown item type: ${item.type}`);
      }
      const counts = new Map<string, number>();
      for (const item of step.items) counts.set(item.type, (counts.get(item.type) ?? 0) + 1);
      const bases = step.items.map(item =>
        ['rune', 'moonstone'].includes(item.type) && counts.get(item.type) === 3 ? 20 : prices[item.type]);
      const base = bases.reduce((sum, price) => sum + price, 0);
      const risk = step.items.reduce((sum, item, index) => sum + bases[index] *
        ((item.cursed ? 50 : 0) + ((item.enchantment ?? 0) >= 5 ? 30 : 0)), 0);
      const policyModifier = 10 - (scenario.customer.yearsWithMHPCO >= 2 ? 20 : 0)
        - (results.some(result => 'premium' in result) ? 15 : 0);
      results.push({ premium: Math.ceil((base * (100 + policyModifier) + risk) / 100 + 5) });
      policies.set(stepIndex, { items: step.items, remainingCap: step.items.reduce((sum, item) => sum + values[item.type] * 2, 0) });
    } else {
      const policy = policies.get(step.policy);
      if (!policy) throw new Error(`Unknown policy: ${step.policy}`);
      const available = [...policy.items];
      const desired = step.incident.damages.reduce((sum, damage) => {
        if (damage.amount < 0) throw new Error('Damage amount cannot be negative');
        const index = available.findIndex(item => item.type === damage.itemType);
        if (index < 0) throw new Error(`Uninsured damage item: ${damage.itemType}`);
        const [item] = available.splice(index, 1);
        return sum + Math.max(0, damage.amount * ((item.enchantment ?? 0) >= 8 ? 0.5 : 1) - 100);
      }, 0);
      const payout = Math.min(Math.floor(desired), policy.remainingCap);
      policy.remainingCap -= payout;
      results.push({ payout, remainingCap: policy.remainingCap });
    }
  }
  return { results };
}
