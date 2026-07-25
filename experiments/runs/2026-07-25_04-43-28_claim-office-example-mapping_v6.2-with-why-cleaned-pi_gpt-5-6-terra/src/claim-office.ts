export type Item = { type: string; material?: string; enchantment?: number; cursed?: boolean };
type Damage = { itemType: string; amount: number };
type QuoteStep = { op: "quote"; items: Item[] };
type ClaimStep = { op: "claim"; policy: number; incident: { cause: string; damages: Damage[] } };
type Scenario = { customer: { yearsWithMHPCO: number }; steps: (QuoteStep | ClaimStep)[] };
type Policy = { items: Item[]; remainingCap: number };

const itemPrices: Record<string, { value: number; premium: number }> = {
  sword: { value: 1000, premium: 100 }, amulet: { value: 600, premium: 60 },
  staff: { value: 800, premium: 80 }, potion: { value: 400, premium: 40 },
  rune: { value: 250, premium: 25 }, moonstone: { value: 250, premium: 25 },
};
const componentTypes = new Set(["rune", "moonstone"]);
const fail = (message: string): never => { throw new Error(message); };
const priceOf = (type: string) => itemPrices[type] ?? fail(`Unknown item type: ${type}`);

const quotePremium = (items: Item[], years: number, contracts: number): number => {
  for (const item of items) priceOf(item.type);
  const componentCounts = new Map<string, number>();
  let base = 0;
  let itemModifiers = 0;
  for (const item of items) {
    const { premium } = priceOf(item.type);
    if (componentTypes.has(item.type)) componentCounts.set(item.type, (componentCounts.get(item.type) ?? 0) + 1);
    else base += premium;
    if (item.cursed) itemModifiers += premium * 0.5;
    if ((item.enchantment ?? 0) >= 5) itemModifiers += premium * 0.3;
  }
  for (const [type, count] of componentCounts) base += count === 3 ? 60 : priceOf(type).premium * count;
  const policyModifiers = base * (years >= 2 ? -0.2 : 0) + base * 0.1 + base * (contracts > 0 ? -0.15 : 0);
  return Math.ceil(base + itemModifiers + policyModifiers + 5);
};

const claimPayout = (policy: Policy, damages: Damage[]): number => {
  const available = new Map<string, Item[]>();
  for (const item of policy.items) available.set(item.type, [...(available.get(item.type) ?? []), item]);
  let payout = 0;
  for (const damage of damages) {
    if (damage.amount < 0) fail("Damage amount must not be negative");
    const items = available.get(damage.itemType);
    const item = items?.shift();
    if (item === undefined) fail(`Damaged item is not insured: ${damage.itemType}`);
    const reimbursed = (item.enchantment ?? 0) >= 8 ? damage.amount * 0.5 : damage.amount;
    payout += Math.max(0, reimbursed - 100);
  }
  const paid = Math.min(Math.floor(payout), policy.remainingCap);
  policy.remainingCap -= paid;
  return paid;
};

export const runScenario = (scenario: Scenario): { results: ({ premium: number } | { payout: number; remainingCap: number })[] } => {
  const policies = new Map<number, Policy>();
  let quotedPolicyCount = 0;
  const results = scenario.steps.map((step, index) => {
    if (step.op === "quote") {
      const premium = quotePremium(step.items, scenario.customer.yearsWithMHPCO, quotedPolicyCount++);
      const policyValue = step.items.reduce((total, item) => total + priceOf(item.type).value, 0);
      policies.set(index, { items: step.items, remainingCap: policyValue * 2 });
      return { premium };
    }
    const policy = policies.get(step.policy) ?? fail(`Unknown policy: ${step.policy}`);
    const payout = claimPayout(policy, step.incident.damages);
    return { payout, remainingCap: policy.remainingCap };
  });
  return { results };
};
