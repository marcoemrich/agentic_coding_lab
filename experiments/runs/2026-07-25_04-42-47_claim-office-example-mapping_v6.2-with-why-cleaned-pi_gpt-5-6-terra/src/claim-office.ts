export type Item = { type: string; material?: string; enchantment?: number; cursed?: boolean };
type Quote = { op: "quote"; items: Item[] };
type Damage = { itemType: string; amount: number };
type Claim = { op: "claim"; policy: number; incident: { cause: string; damages: Damage[] } };
type Scenario = { customer: { yearsWithMHPCO: number }; steps: (Quote | Claim)[] };
const mains: Record<string, [number, number]> = { sword: [1000, 100], amulet: [600, 60], staff: [800, 80], potion: [400, 40] };
const components = new Set(["rune", "moonstone"]);
const value = (type: string) => mains[type]?.[0] ?? (components.has(type) ? 250 : fail(`unknown item type: ${type}`));
const fail = (message: string): never => { throw new Error(message); };
const premium = (items: Item[], years: number, quoteNumber: number) => {
  const componentCounts = new Map<string, number>();
  let base = 0, itemRisk = 0;
  for (const item of items) {
    const v = value(item.type);
    if (components.has(item.type)) componentCounts.set(item.type, (componentCounts.get(item.type) ?? 0) + 1);
    else base += mains[item.type][1];
    const p = components.has(item.type) ? 25 : mains[item.type][1];
    itemRisk += (item.cursed ? p * .5 : 0) + ((item.enchantment ?? 0) >= 5 ? p * .3 : 0);
    void v;
  }
  for (const count of componentCounts.values()) base += count === 3 ? 60 : count * 25;
  // The initial assessment applies to every newly insured item, i.e. each quote's base.
  const policy = base * (1 + .1 - (years >= 2 ? .2 : 0) - (quoteNumber > 0 ? .15 : 0));
  return Math.ceil(policy + itemRisk + 5);
};
export const runScenario = (scenario: Scenario): { results: ({ premium: number } | { payout: number; remainingCap: number })[] } => {
  const policies = new Map<number, { items: Item[]; cap: number }>();
  const results: ({ premium: number } | { payout: number; remainingCap: number })[] = [];
  let quotes = 0;
  scenario.steps.forEach((step, index) => {
    if (step.op === "quote") {
      const sum = step.items.reduce((total, item) => total + value(item.type), 0);
      policies.set(index, { items: step.items, cap: sum * 2 });
      results.push({ premium: premium(step.items, scenario.customer.yearsWithMHPCO, quotes++) });
      return;
    }
    const policy = policies.get(step.policy) ?? fail("unknown policy");
    const available = new Map<string, number>();
    policy.items.forEach(i => available.set(i.type, (available.get(i.type) ?? 0) + 1));
    let desired = 0;
    for (const damage of step.incident.damages) {
      if (damage.amount < 0) fail("negative damage");
      const count = available.get(damage.itemType) ?? 0;
      if (!count) fail(`uninsured item: ${damage.itemType}`);
      available.set(damage.itemType, count - 1);
      const item = policy.items.find(i => i.type === damage.itemType)!;
      const reimbursed = (item.enchantment ?? 0) >= 8 ? damage.amount / 2 : damage.amount;
      desired += Math.max(0, reimbursed - 100);
    }
    const payout = Math.floor(Math.min(desired, policy.cap));
    policy.cap -= payout;
    results.push({ payout, remainingCap: policy.cap });
  });
  return { results };
};
