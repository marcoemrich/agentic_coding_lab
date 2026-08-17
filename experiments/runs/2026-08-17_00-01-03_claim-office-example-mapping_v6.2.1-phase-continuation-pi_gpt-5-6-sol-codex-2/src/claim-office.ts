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

export type Step =
  | { op: "quote"; items: Item[] }
  | { op: "claim"; policy: number; incident: { cause: string; damages: Damage[] } };

export interface Scenario {
  customer: Customer;
  steps: Step[];
}

export type Result = { premium: number } | { payout: number; remainingCap: number };

interface Policy {
  items: Item[];
  remainingCap: number;
}

const PROCESSING_FEE = 5;
const HIGH_ENCHANTMENT_SURCHARGE_RATE = 0.3;
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

export function executeScenario(scenario: Scenario): { results: Result[] } {
  const policies = new Map<number, Policy>();
  const results: Result[] = [];
  let previouslyIssuedPolicyCount = 0;

  scenario.steps.forEach((step, stepIndex) => {
    if (step.op === "quote") {
      for (const item of step.items) {
        if (!(item.type in BASE_PREMIUM)) throw new Error(`Unknown item type: ${item.type}`);
      }
      let discountedBasePremium = step.items.reduce((total, item) => total + BASE_PREMIUM[item.type], 0);
      for (const componentType of ["rune", "moonstone"]) {
        if (step.items.filter((item) => item.type === componentType).length === 3) {
          discountedBasePremium -= 15;
        }
      }
      const itemSurcharges = step.items.reduce(
        (total, item) =>
          total +
          (item.cursed ? BASE_PREMIUM[item.type] / 2 : 0) +
          ((item.enchantment ?? 0) >= 5 ? BASE_PREMIUM[item.type] * HIGH_ENCHANTMENT_SURCHARGE_RATE : 0),
        0,
      );
      const customerRatePercentage =
        (scenario.customer.yearsWithMHPCO >= 2 ? 90 : 110) - (previouslyIssuedPolicyCount > 0 ? 15 : 0);
      results.push({
        premium: Math.ceil(
          (discountedBasePremium * customerRatePercentage) / 100 + itemSurcharges + PROCESSING_FEE,
        ),
      });
      const totalInsuredValue = step.items.reduce((total, item) => total + INSURANCE_VALUE[item.type], 0);
      policies.set(stepIndex, { items: step.items, remainingCap: totalInsuredValue * 2 });
      previouslyIssuedPolicyCount += 1;
      return;
    }

    const policy = policies.get(step.policy)!;
    const damageCountByItemType: Record<string, number> = {};
    const desiredPayout = step.incident.damages.reduce((total, damage) => {
      if (damage.amount < 0) throw new Error(`Negative damage amount: ${damage.amount}`);
      const matchingItems = policy.items.filter((item) => item.type === damage.itemType);
      const item = matchingItems[damageCountByItemType[damage.itemType] ?? 0];
      if (!item) throw new Error(`Item type is not covered by policy: ${damage.itemType}`);
      damageCountByItemType[damage.itemType] = (damageCountByItemType[damage.itemType] ?? 0) + 1;
      const reimbursementRate = (item.enchantment ?? 0) >= 8 ? 0.5 : 1;
      return total + Math.max(0, damage.amount * reimbursementRate - 100);
    }, 0);
    const payout = Math.floor(Math.min(desiredPayout, policy.remainingCap));
    policy.remainingCap -= payout;
    results.push({ payout, remainingCap: policy.remainingCap });
  });

  return { results };
}
