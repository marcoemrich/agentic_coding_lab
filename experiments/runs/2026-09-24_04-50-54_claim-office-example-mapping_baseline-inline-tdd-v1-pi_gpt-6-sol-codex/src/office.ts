export interface Item {
  type: string;
  material?: string;
  enchantment?: number;
  cursed?: boolean;
}

export interface Damage {
  itemType: string;
  amount: number;
}

export type Step =
  | {op: 'quote'; items: Item[]}
  | {op: 'claim'; policy: number; incident: {cause: string; damages: Damage[]}};

export interface Scenario {
  customer: {yearsWithMHPCO: number};
  steps: Step[];
}

export type Result = {premium: number} | {payout: number; remainingCap: number};

const priceList: Record<string, {value: number; premium: number}> = {
  sword: {value: 1000, premium: 100},
  amulet: {value: 600, premium: 60},
  staff: {value: 800, premium: 80},
  potion: {value: 400, premium: 40},
  rune: {value: 250, premium: 25},
  moonstone: {value: 250, premium: 25},
};

function price(item: Item) {
  const entry = priceList[item.type];
  if (!entry) throw new Error(`Unknown item type: ${item.type}`);
  return entry;
}

export function runScenario(scenario: Scenario): {results: Result[]} {
  const results: Result[] = [];
  const policies = new Map<number, {items: Item[]; remainingCap: number}>();
  let quoteCount = 0;
  for (const step of scenario.steps) {
    if (step.op === 'quote') {
      const counts = new Map<string, number>();
      for (const item of step.items) {
        price(item);
        counts.set(item.type, (counts.get(item.type) ?? 0) + 1);
      }
      const base = step.items.reduce((total, item) => total + price(item).premium, 0)
        - ['rune', 'moonstone'].reduce((discount, type) => discount + (counts.get(type) === 3 ? 15 : 0), 0);
      const itemSurcharges = step.items.reduce((total, item) => total +
        (counts.get(item.type) === 3 && ['rune', 'moonstone'].includes(item.type) ? 20 : price(item).premium) *
        ((item.cursed ? 50 : 0) + ((item.enchantment ?? 0) >= 5 ? 30 : 0)), 0);
      const policyRate = 10 - (scenario.customer.yearsWithMHPCO >= 2 ? 20 : 0) - (quoteCount ? 15 : 0);
      results.push({premium: Math.ceil((base * (100 + policyRate) + itemSurcharges + 500) / 100)});
      policies.set(results.length - 1, {items: step.items, remainingCap: 2 * step.items.reduce((sum, item) => sum + price(item).value, 0)});
      quoteCount++;
    } else if (step.op === 'claim') {
      const policy = policies.get(step.policy);
      if (!policy) throw new Error(`Invalid policy reference: ${step.policy}`);
      const used = new Set<number>();
      let desiredTwice = 0;
      for (const damage of step.incident.damages) {
        if (!Number.isInteger(damage.amount) || damage.amount < 0) throw new Error(`Invalid damage amount: ${damage.amount}`);
        const index = policy.items.findIndex((item, i) => item.type === damage.itemType && !used.has(i));
        if (index < 0) throw new Error(`Uninsured or duplicate damage to: ${damage.itemType}`);
        used.add(index);
        const item = policy.items[index];
        const reimbursementTwice = (item.enchantment ?? 0) >= 8 ? damage.amount : 2 * damage.amount;
        desiredTwice += Math.max(0, reimbursementTwice - 200);
      }
      const payout = Math.min(policy.remainingCap, Math.floor(desiredTwice / 2));
      policy.remainingCap -= payout;
      results.push({payout, remainingCap: policy.remainingCap});
    }
  }
  return {results};
}
