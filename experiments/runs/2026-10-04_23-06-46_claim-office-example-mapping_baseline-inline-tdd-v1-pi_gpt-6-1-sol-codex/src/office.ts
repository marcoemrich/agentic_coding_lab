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
export interface Scenario {
  customer: { yearsWithMHPCO: number };
  steps: Step[];
}
export type Result = { premium: number } | { payout: number; remainingCap: number };

const prices: Record<string, { value: number; base: number }> = {
  sword: { value: 1000, base: 100 },
  amulet: { value: 600, base: 60 },
  staff: { value: 800, base: 80 },
  potion: { value: 400, base: 40 },
  rune: { value: 250, base: 25 },
  moonstone: { value: 250, base: 25 },
};

function price(type: string) {
  if (!Object.hasOwn(prices, type)) throw new Error(`Unknown item type: ${type}`);
  return prices[type];
}

function itemBase(item: Item, items: Item[]): number {
  const base = price(item.type).base;
  const component = item.type === 'rune' || item.type === 'moonstone';
  return component && items.filter(other => other.type === item.type).length === 3 ? 20 : base;
}

export function processScenario(scenario: Scenario): { results: Result[] } {
  let contracts = 0;
  const policies = new Map<number, { items: Item[]; remainingCap: number }>();
  return { results: scenario.steps.map((step, index) => {
    if (step.op === 'claim') {
      const policy = policies.get(step.policy);
      if (!policy) throw new Error(`Invalid policy reference: ${step.policy}`);
      const available = [...policy.items];
      const desired = Math.floor(step.incident.damages.reduce((sum, damage) => {
        if (damage.amount < 0) throw new Error('Damage amount must not be negative');
        const itemIndex = available.findIndex(item => item.type === damage.itemType);
        if (itemIndex < 0) throw new Error(`No insured item available for damage: ${damage.itemType}`);
        const [item] = available.splice(itemIndex, 1);
        // The high-enchantment clause wins even for dragon material.
        const reimbursement = (item.enchantment ?? 0) >= 8 ? damage.amount / 2 : damage.amount;
        return sum + Math.max(0, reimbursement - 100);
      }, 0));
      const payout = Math.min(desired, policy.remainingCap);
      policy.remainingCap -= payout;
      return { payout, remainingCap: policy.remainingCap };
    }
    if (step.op !== 'quote') throw new Error('Unsupported operation');
    const base = step.items.reduce((sum, item) => sum + itemBase(item, step.items), 0);
    const risks = step.items.reduce((sum, item) => {
      const percent = (item.cursed ? 50 : 0) + ((item.enchantment ?? 0) >= 5 ? 30 : 0);
      return sum + itemBase(item, step.items) * percent;
    }, 0);
    const policyPercent = 110 - (scenario.customer.yearsWithMHPCO >= 2 ? 20 : 0) - (contracts > 0 ? 15 : 0);
    contracts++;
    policies.set(index, { items: step.items, remainingCap: 2 * step.items.reduce((sum, item) => sum + price(item.type).value, 0) });
    return { premium: Math.ceil((base * policyPercent + risks) / 100 + 5) };
  }) };
}
