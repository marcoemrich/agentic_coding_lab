export interface Customer { yearsWithMHPCO: number }
export interface Item {
  type: string;
  material?: string;
  enchantment?: number;
  cursed?: boolean;
}
export interface QuoteStep { op: "quote"; items: Item[] }
export interface Damage { itemType: string; amount: number }
export interface ClaimStep {
  op: "claim";
  policy: number;
  incident: { cause: string; damages: Damage[] };
}
export type Step = QuoteStep | ClaimStep;
export interface Scenario { customer: Customer; steps: Step[] }
export type Result = { premium: number } | { payout: number; remainingCap: number };

const prices: Record<string, { value: number; premium: number }> = {
  sword: { value: 1000, premium: 100 },
  amulet: { value: 600, premium: 60 },
  staff: { value: 800, premium: 80 },
  potion: { value: 400, premium: 40 },
  rune: { value: 250, premium: 25 },
  moonstone: { value: 250, premium: 25 },
};

interface Policy { items: Item[]; remainingCap: number }

function assertKnown(type: string): void {
  if (!Object.hasOwn(prices, type)) throw new Error(`Unknown item type: ${type}`);
}

function itemBases(items: Item[]): number[] {
  items.forEach(item => assertKnown(item.type));
  const counts = new Map<string, number>();
  for (const item of items) counts.set(item.type, (counts.get(item.type) ?? 0) + 1);
  return items.map(item => {
    const price = prices[item.type].premium;
    return price === 25 && counts.get(item.type) === 3 ? 20 : price;
  });
}

function premium(items: Item[], customer: Customer, priorQuotes: number): number {
  const bases = itemBases(items);
  const base = bases.reduce((sum, value) => sum + value, 0);
  let amount = base;
  items.forEach((item, index) => {
    if (item.cursed) amount += bases[index] * 0.5;
    if ((item.enchantment ?? 0) >= 5) amount += bases[index] * 0.3;
  });
  if (customer.yearsWithMHPCO >= 2) amount -= base * 0.2;
  amount += base * 0.1;
  if (priorQuotes > 0) amount -= base * 0.15;
  return Math.ceil(amount + 5);
}

function createPolicy(items: Item[]): Policy {
  itemBases(items);
  const insuranceSum = items.reduce((sum, item) => sum + prices[item.type].value, 0);
  return { items: items.map(item => ({ ...item })), remainingCap: insuranceSum * 2 };
}

function processClaim(policy: Policy, damages: Damage[]): { payout: number; remainingCap: number } {
  const available = new Map<string, Item[]>();
  for (const item of policy.items) {
    const entries = available.get(item.type) ?? [];
    entries.push(item);
    available.set(item.type, entries);
  }
  let desired = 0;
  for (const damage of damages) {
    if (!Number.isInteger(damage.amount) || damage.amount < 0) throw new Error("Damage amount must be a non-negative integer");
    assertKnown(damage.itemType);
    const item = available.get(damage.itemType)?.shift();
    if (!item) throw new Error(`Damaged item is not covered: ${damage.itemType}`);
    const reimbursable = (item.enchantment ?? 0) >= 8 ? damage.amount * 0.5 : damage.amount;
    desired += Math.max(0, reimbursable - 100);
  }
  const payout = Math.min(Math.floor(desired), policy.remainingCap);
  policy.remainingCap -= payout;
  return { payout, remainingCap: policy.remainingCap };
}

export function processScenario(scenario: Scenario): { results: Result[] } {
  if (!scenario || !scenario.customer || !Array.isArray(scenario.steps)) throw new Error("Invalid scenario");
  const results: Result[] = [];
  const policies = new Map<number, Policy>();
  let quoteCount = 0;
  scenario.steps.forEach((step, index) => {
    if (step.op === "quote") {
      if (!Array.isArray(step.items)) throw new Error("Quote items must be an array");
      results.push({ premium: premium(step.items, scenario.customer, quoteCount) });
      policies.set(index, createPolicy(step.items));
      quoteCount++;
    } else if (step.op === "claim") {
      const policy = policies.get(step.policy);
      if (!policy) throw new Error(`Invalid policy reference: ${step.policy}`);
      if (!step.incident || !Array.isArray(step.incident.damages)) throw new Error("Invalid incident");
      results.push(processClaim(policy, step.incident.damages));
    } else {
      throw new Error("Unknown operation");
    }
  });
  return { results };
}
