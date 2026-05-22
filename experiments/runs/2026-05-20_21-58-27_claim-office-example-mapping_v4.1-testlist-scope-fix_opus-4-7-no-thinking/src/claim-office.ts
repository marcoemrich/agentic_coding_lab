export interface Customer {
  yearsWithMHPCO: number;
}

export interface Item {
  type: string;
  material?: string;
  enchantment?: number;
  cursed?: boolean;
}

const PROCESSING_FEE = 5;
const FIRST_INSURANCE_SURCHARGE_RATE = 0.1;

const BASE_PRICES: Record<string, number> = {
  sword: 100,
  amulet: 60,
  staff: 80,
  potion: 40,
  rune: 25,
  moonstone: 25,
};

const COMPONENT_TYPES = new Set(["rune", "moonstone"]);
const BLOCK_PRICE: Record<string, number> = {
  rune: 60,
  moonstone: 60,
};

export interface QuoteContext {
  previousQuoteCount?: number;
}

export function quote(customer: Customer, items: Item[], context?: QuoteContext): number {
  let total = 0;
  let policyBase = 0;
  const componentCounts: Record<string, number> = {};
  for (const item of items) {
    if (!(item.type in BASE_PRICES)) {
      throw new Error(`Unknown item type: ${item.type}`);
    }
    if (COMPONENT_TYPES.has(item.type)) {
      componentCounts[item.type] = (componentCounts[item.type] ?? 0) + 1;
      continue;
    }
    const base = BASE_PRICES[item.type] ?? 0;
    const curse = item.cursed ? base * 0.5 : 0;
    const highEnchant = (item.enchantment ?? 0) >= 5 ? base * 0.3 : 0;
    total += base + curse + highEnchant + base * FIRST_INSURANCE_SURCHARGE_RATE;
    policyBase += base;
  }
  for (const type of Object.keys(componentCounts)) {
    const count = componentCounts[type];
    const unitPrice = BASE_PRICES[type] ?? 0;
    const base = count === 3 ? BLOCK_PRICE[type] : unitPrice * count;
    total += base + base * FIRST_INSURANCE_SURCHARGE_RATE;
    policyBase += base;
  }
  if (customer.yearsWithMHPCO >= 2) {
    total -= policyBase * 0.2;
  }
  if ((context?.previousQuoteCount ?? 0) > 0) {
    total -= policyBase * 0.15;
  }
  total += PROCESSING_FEE;
  return Math.ceil(total);
}

const INSURANCE_VALUES: Record<string, number> = {
  sword: 1000,
  amulet: 600,
  staff: 800,
  potion: 400,
  rune: 250,
  moonstone: 250,
};

export function claim(
  items: Item[],
  damages: Array<{ itemType: string; amount: number }>,
  remainingCap?: number,
): { payout: number; remainingCap: number } {
  for (const d of damages) {
    if (d.amount < 0) {
      throw new Error(`Negative damage amount: ${d.amount}`);
    }
  }
  const insuranceSum = items.reduce((sum, it) => sum + (INSURANCE_VALUES[it.type] ?? 0), 0);
  const cap = remainingCap ?? 2 * insuranceSum;
  const itemCounts: Record<string, number> = {};
  for (const it of items) {
    itemCounts[it.type] = (itemCounts[it.type] ?? 0) + 1;
  }
  const damageCounts: Record<string, number> = {};
  for (const d of damages) {
    damageCounts[d.itemType] = (damageCounts[d.itemType] ?? 0) + 1;
  }
  for (const type of Object.keys(damageCounts)) {
    if (damageCounts[type] > (itemCounts[type] ?? 0)) {
      throw new Error(`More damage entries for ${type} than insured items`);
    }
  }
  let total = 0;
  for (const damage of damages) {
    const item = items.find((i) => i.type === damage.itemType);
    const reimbursable = (item?.enchantment ?? 0) >= 8 ? damage.amount * 0.5 : damage.amount;
    total += Math.max(0, reimbursable - 100);
  }
  const payout = Math.min(Math.floor(total), cap);
  return { payout, remainingCap: cap - payout };
}

export function processScenario(scenario: any): any {
  const results: any[] = [];
  const policies = new Map<number, { items: Item[]; remainingCap: number }>();
  let quoteCount = 0;
  for (let i = 0; i < scenario.steps.length; i++) {
    const step = scenario.steps[i];
    if (step.op === "quote") {
      const premium = quote(scenario.customer, step.items, { previousQuoteCount: quoteCount });
      quoteCount++;
      const insuranceSum = step.items.reduce(
        (sum: number, it: Item) => sum + (INSURANCE_VALUES[it.type] ?? 0),
        0,
      );
      policies.set(i, { items: step.items, remainingCap: 2 * insuranceSum });
      results.push({ premium });
    } else if (step.op === "claim") {
      const policy = policies.get(step.policy)!;
      const result = claim(policy.items, step.incident.damages, policy.remainingCap);
      policy.remainingCap = result.remainingCap;
      results.push({ payout: result.payout, remainingCap: result.remainingCap });
    }
  }
  return { results };
}
