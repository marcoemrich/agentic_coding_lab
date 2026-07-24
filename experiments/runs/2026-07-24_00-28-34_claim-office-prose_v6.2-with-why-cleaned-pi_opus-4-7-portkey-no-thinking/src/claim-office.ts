export interface Customer { yearsWithMHPCO: number }
export interface Item { type: string; material?: string; enchantment?: number; cursed?: boolean }
export interface QuoteStep { op: "quote"; items: Item[] }
export interface ClaimStep { op: "claim"; policy: number; incident: { cause: string; damages: { itemType: string; amount: number }[] } }
export type Step = QuoteStep | ClaimStep;
export interface Scenario { customer: Customer; steps: Step[] }
export interface Output { results: any[] }

const BASE: Record<string, number> = { sword: 100, amulet: 60, staff: 80, potion: 40, rune: 25, moonstone: 25 };
const COMPONENT_TYPES = new Set(["rune", "moonstone"]);

const itemBase = (item: Item): number => {
  const base = BASE[item.type] ?? 0;
  let multiplier = 1;
  if (item.cursed) multiplier += 0.5;
  if ((item.enchantment ?? 0) >= 5) multiplier += 0.3;
  return base * multiplier;
};

const sumItems = (items: Item[]): number => {
  let base = 0;
  const componentsByType: Record<string, number> = {};
  for (const item of items) {
    if (COMPONENT_TYPES.has(item.type)) {
      componentsByType[item.type] = (componentsByType[item.type] ?? 0) + 1;
    } else {
      base += itemBase(item);
    }
  }
  for (const type of Object.keys(componentsByType)) {
    const count = componentsByType[type];
    const blocks = Math.floor(count / 3);
    const leftover = count % 3;
    base += blocks * 60 + leftover * 25;
  }
  return base;
};

const policyMultiplier = (customer: Customer, contractIndex: number): number => {
  let m = 1;
  if (contractIndex === 0) m *= 1.10;
  else m *= 0.85;
  if (customer.yearsWithMHPCO >= 2) m *= 0.80;
  return m;
};

const roundUpG = (value: number): number => {
  // round to whole G in MHPCO's favor (ceil), guarding against FP artifacts.
  const rounded = Math.round(value * 100) / 100;
  return Math.ceil(rounded);
};

const quotePremium = (items: Item[], customer: Customer, contractIndex: number): number => {
  const base = sumItems(items);
  return roundUpG(base * policyMultiplier(customer, contractIndex)) + 5;
};

const INSURED_VALUE: Record<string, number> = { sword: 1000, amulet: 600, staff: 800, potion: 400, rune: 250, moonstone: 250 };

interface Policy { items: Item[]; cap: number; remainingCap: number }

const insuredSum = (items: Item[]): number => {
  let sum = 0;
  for (const item of items) sum += INSURED_VALUE[item.type] ?? 0;
  return sum;
};

export const runScenario = (input: Scenario): Output => {
  const results: any[] = [];
  const policies: Record<number, Policy> = {};
  let contractIndex = 0;
  input.steps.forEach((step, idx) => {
    if (step.op === "quote") {
      results.push({ premium: quotePremium(step.items, input.customer, contractIndex) });
      const cap = 2 * insuredSum(step.items);
      policies[idx] = { items: step.items, cap, remainingCap: cap };
      contractIndex++;
    } else {
      const policy = policies[step.policy];
      const itemsByType = new Map<string, Item>();
      for (const it of policy.items) itemsByType.set(it.type, it);
      let reimbursable = 0;
      for (const d of step.incident.damages) {
        const item = itemsByType.get(d.itemType);
        const isDragon = item?.material === "dragon";
        const factor = isDragon ? 1 : (item && (item.enchantment ?? 0) >= 8 ? 0.5 : 1);
        reimbursable += d.amount * factor;
      }
      const gross = Math.max(0, reimbursable - 100);
      const payout = Math.min(gross, policy.remainingCap);
      policy.remainingCap -= payout;
      results.push({ payout, remainingCap: policy.remainingCap });
    }
  });
  return { results };
};
