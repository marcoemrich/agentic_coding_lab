export interface Item { type: string; material?: string; enchantment?: number; cursed?: boolean }
export interface Damage { itemType: string; amount: number }
export type Step = { op: 'quote'; items: Item[] } | { op: 'claim'; policy: number; incident: { cause: string; damages: Damage[] } };
export interface Scenario { customer: { yearsWithMHPCO: number }; steps: Step[] }
export type Result = { premium: number } | { payout: number; remainingCap: number };
const prices: Record<string, number> = { sword: 100, amulet: 60, staff: 80, potion: 40, rune: 25, moonstone: 25 };
const component = (item: Item) => item.type === 'rune' || item.type === 'moonstone';

export function runScenario(scenario: Scenario): { results: Result[] } {
  const results: Result[] = [];
  let contracts = 0;
  const policies = new Map<number, { items: Item[]; remainingCap: number }>();
  for (const [index, step] of scenario.steps.entries()) {
    if (step.op === 'quote') {
      for (const item of step.items) {
        if (!Object.hasOwn(prices, item.type)) throw new Error(`Unknown item type: ${item.type}`);
      }
      const bases = step.items.map(item => component(item) && step.items.filter(other => other.type === item.type).length === 3 ? 20 : prices[item.type]);
      const base = bases.reduce((sum, value) => sum + value, 0);
      const risk = step.items.reduce((sum, item, index) => sum + bases[index] * ((item.cursed ? 50 : 0) + ((item.enchantment ?? 0) >= 5 ? 30 : 0)), 0);
      const policyRate = 110 - (scenario.customer.yearsWithMHPCO >= 2 ? 20 : 0) - (contracts > 0 ? 15 : 0);
      results.push({ premium: Math.ceil((base * policyRate + risk) / 100 + 5) });
      contracts++;
      policies.set(index, { items: step.items, remainingCap: step.items.reduce((sum, item) => sum + prices[item.type] * 20, 0) });
    } else if (step.op === 'claim') {
      const policy = policies.get(step.policy);
      if (!policy) throw new Error(`Invalid policy reference: ${step.policy}`);
      const available = [...policy.items];
      let rawPayout = 0;
      for (const damage of step.incident.damages) {
        if (!Number.isInteger(damage.amount) || damage.amount < 0) throw new Error('Damage amount must be a non-negative integer');
        const itemIndex = available.findIndex(item => item.type === damage.itemType);
        if (itemIndex < 0) throw new Error(`No insured item available for damage: ${damage.itemType}`);
        const [item] = available.splice(itemIndex, 1);
        const reimbursement = (item.enchantment ?? 0) >= 8 ? damage.amount / 2 : damage.amount;
        rawPayout += Math.max(0, reimbursement - 100);
      }
      const payout = Math.min(policy.remainingCap, Math.floor(rawPayout));
      policy.remainingCap -= payout;
      results.push({ payout, remainingCap: policy.remainingCap });
    } else {
      throw new Error('Unknown operation');
    }
  }
  return { results };
}
