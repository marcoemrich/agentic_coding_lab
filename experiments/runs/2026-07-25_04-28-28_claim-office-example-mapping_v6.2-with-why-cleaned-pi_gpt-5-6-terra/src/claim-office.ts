type Item = { type: string; material?: string; enchantment?: number; cursed?: boolean };
type Quote = { op: "quote"; items: Item[] };
type Damage = { itemType: string; amount: number };
type Claim = { op: "claim"; policy: number; incident: { cause: string; damages: Damage[] } };
type Scenario = { customer: { yearsWithMHPCO: number }; steps: (Quote | Claim)[] };
type Policy = { items: Item[]; remainingCap: number };

const values: Record<string, { value: number; premium: number }> = {
  sword: { value: 1000, premium: 100 }, amulet: { value: 600, premium: 60 },
  staff: { value: 800, premium: 80 }, potion: { value: 400, premium: 40 },
  rune: { value: 250, premium: 25 }, moonstone: { value: 250, premium: 25 },
};
const componentTypes = new Set(["rune", "moonstone"]);

function assertItem(item: Item): void { if (!values[item.type]) throw new Error(`Unknown item type: ${item.type}`); }
function itemPremium(item: Item): number { const base = values[item.type].premium; return base + (item.cursed ? base * .5 : 0) + ((item.enchantment ?? 0) >= 5 ? base * .3 : 0); }
function quotePremium(items: Item[], years: number, priorQuoteCount: number): number {
  items.forEach(assertItem);
  const componentCounts = new Map<string, number>();
  let baseItemPremium = 0;
  let modifiedItemPremium = 0;
  for (const item of items) {
    if (componentTypes.has(item.type)) componentCounts.set(item.type, (componentCounts.get(item.type) ?? 0) + 1);
    else {
      baseItemPremium += values[item.type].premium;
      modifiedItemPremium += itemPremium(item);
    }
  }
  const componentPremium = [...componentCounts].reduce((total, [type, count]) => total + (count === 3 ? 60 : count * values[type].premium), 0);
  const policyBasePremium = baseItemPremium + componentPremium;
  const modifiers = (years >= 2 ? -.2 : 0) + .1 + (priorQuoteCount > 0 ? -.15 : 0);
  return Math.ceil(modifiedItemPremium + componentPremium + policyBasePremium * modifiers + 5);
}

export function runScenario(scenario: Scenario): { results: ({ premium: number } | { payout: number; remainingCap: number })[] } {
  const policies = new Map<number, Policy>();
  const results: ({ premium: number } | { payout: number; remainingCap: number })[] = [];
  let quotes = 0;
  scenario.steps.forEach((step, index) => {
    if (step.op === "quote") {
      const premium = quotePremium(step.items, scenario.customer.yearsWithMHPCO, quotes++);
      const sum = step.items.reduce((total, item) => { assertItem(item); return total + values[item.type].value; }, 0);
      policies.set(index, { items: step.items, remainingCap: sum * 2 }); results.push({ premium }); return;
    }
    const policy = policies.get(step.policy); if (!policy) throw new Error("Unknown policy");
    const available = new Map<string, number>(); policy.items.forEach(i => available.set(i.type, (available.get(i.type) ?? 0) + 1));
    let desired = 0;
    for (const damage of step.incident.damages) {
      if (!Number.isInteger(damage.amount) || damage.amount < 0 || !(available.get(damage.itemType) ?? 0)) throw new Error("Invalid damage");
      available.set(damage.itemType, available.get(damage.itemType)! - 1);
      const item = policy.items.find(i => i.type === damage.itemType)!;
      const reimbursed = (item.enchantment ?? 0) >= 8 ? damage.amount * .5 : damage.amount;
      desired += Math.max(0, reimbursed - 100);
    }
    const payout = Math.floor(Math.min(desired, policy.remainingCap)); policy.remainingCap -= payout; results.push({ payout, remainingCap: policy.remainingCap });
  });
  return { results };
}
