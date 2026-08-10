export interface Customer {
  yearsWithMHPCO: number;
}

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

export interface QuoteStep {
  op: "quote";
  items: Item[];
}

export interface ClaimStep {
  op: "claim";
  policy: number;
  incident: { cause: string; damages: Damage[] };
}

export type Step = QuoteStep | ClaimStep;
export interface Scenario { customer: Customer; steps: Step[] }
export type OperationResult = { premium: number } | { payout: number; remainingCap: number };
export interface ScenarioResult { results: OperationResult[] }

const BASE_PREMIUM: Record<string, number> = {
  sword: 100,
  amulet: 60,
  staff: 80,
  potion: 40,
  rune: 25,
  moonstone: 25,
};

const INSURANCE_VALUE: Record<string, number> = {
  sword: 1000,
  amulet: 600,
  staff: 800,
  potion: 400,
  rune: 250,
  moonstone: 250,
};

function quote(items: Item[], customer: Customer, previousContracts: number): number {
  for (const item of items) {
    if (!(item.type in BASE_PREMIUM)) throw new Error(`Unknown item type: ${item.type}`);
  }
  const componentCounts = items.reduce<Record<string, number>>((counts, item) => {
    if (item.type === "rune" || item.type === "moonstone") {
      counts[item.type] = (counts[item.type] ?? 0) + 1;
    }
    return counts;
  }, {});
  const base = items.reduce((total, item) => total + BASE_PREMIUM[item.type], 0)
    - Object.values(componentCounts).filter((count) => count === 3).length * 15;
  const curseSurcharge = items.reduce(
    (total, item) => total + (item.cursed ? BASE_PREMIUM[item.type] / 2 : 0),
    0,
  );
  const enchantmentSurcharge = items.reduce(
    (total, item) => total + ((item.enchantment ?? 0) >= 5 ? BASE_PREMIUM[item.type] * 3 / 10 : 0),
    0,
  );
  const loyaltyDiscount = customer.yearsWithMHPCO >= 2 ? base / 5 : 0;
  const contractDiscount = previousContracts > 0 ? base * 15 / 100 : 0;
  return Math.ceil(base + curseSurcharge + enchantmentSurcharge + base / 10 - loyaltyDiscount - contractDiscount + 5);
}

export function runScenario(scenario: Scenario): ScenarioResult {
  let previousContracts = 0;
  const policies = new Map<number, { items: Item[]; remainingCap: number }>();
  return {
    results: scenario.steps.map((step, stepIndex) => {
      if (step.op === "quote") {
        const premium = quote(step.items, scenario.customer, previousContracts);
        previousContracts += 1;
        const insuranceSum = step.items.reduce((sum, item) => sum + INSURANCE_VALUE[item.type], 0);
        policies.set(stepIndex, { items: step.items, remainingCap: insuranceSum * 2 });
        return { premium };
      }
      const policy = policies.get(step.policy)!;
      if (step.incident.damages.some((damage) => damage.amount < 0)) {
        throw new Error("Negative damage amount is invalid");
      }
      const availableItems = [...policy.items];
      const matchedItems = step.incident.damages.map((damage) => {
        const itemIndex = availableItems.findIndex((item) => item.type === damage.itemType);
        if (itemIndex < 0) throw new Error(`Item ${damage.itemType} is not covered by policy`);
        return availableItems.splice(itemIndex, 1)[0];
      });
      const desiredPayout = step.incident.damages.reduce((sum, damage, damageIndex) => {
        const item = matchedItems[damageIndex];
        const reimbursable = (item.enchantment ?? 0) >= 8 ? damage.amount / 2 : damage.amount;
        return sum + Math.max(0, reimbursable - 100);
      }, 0);
      const payout = Math.floor(Math.min(desiredPayout, policy.remainingCap));
      policy.remainingCap -= payout;
      return { payout, remainingCap: policy.remainingCap };
    }),
  };
}
