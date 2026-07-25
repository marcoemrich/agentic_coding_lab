export interface Item {
  type: string;
  material?: string;
  enchantment?: number;
  cursed?: boolean;
}

export interface QuoteStep {
  op: "quote";
  items: Item[];
}

export interface Damage {
  itemType: string;
  amount: number;
}

export interface ClaimStep {
  op: "claim";
  policy: number;
  incident: { cause: string; damages: Damage[] };
}

export interface Scenario {
  customer: { yearsWithMHPCO: number };
  steps: Array<QuoteStep | ClaimStep>;
}

const PROCESSING_FEE = 5;
const INSURANCE_VALUE: Record<string, number> = {
  sword: 1000, amulet: 600, staff: 800, potion: 400, rune: 250, moonstone: 250,
};
const BASE_PREMIUM_BY_ITEM_TYPE: Record<string, number> = {
  sword: 100,
  amulet: 60,
  staff: 80,
  potion: 40,
  rune: 25,
  moonstone: 25,
};

export const processScenario = (scenario: Scenario): unknown => {
  const policies = new Map<number, { items: Item[]; remainingCap: number }>();
  return { results: scenario.steps.map((step, stepIndex) => {
    if (step.op === "quote") {
      for (const item of step.items) {
        if (BASE_PREMIUM_BY_ITEM_TYPE[item.type] === undefined) throw new Error(`Unknown item type: ${item.type}`);
      }
      let basePremium = step.items.reduce((sum, item) => sum + BASE_PREMIUM_BY_ITEM_TYPE[item.type], 0);
      for (const component of ["rune", "moonstone"]) {
        if (step.items.filter((item) => item.type === component).length === 3) basePremium -= 15;
      }
      const riskSurcharge = step.items.reduce((sum, item) => {
        const itemBase = BASE_PREMIUM_BY_ITEM_TYPE[item.type];
        return sum + (item.cursed ? itemBase / 2 : 0) + ((item.enchantment ?? 0) >= 5 ? itemBase * 3 / 10 : 0);
      }, 0);
      const loyaltyDiscount = scenario.customer.yearsWithMHPCO >= 2 ? basePremium / 5 : 0;
      const followUpDiscount = policies.size > 0 ? basePremium * 15 / 100 : 0;
      policies.set(stepIndex, {
        items: step.items,
        remainingCap: step.items.reduce((sum, item) => sum + INSURANCE_VALUE[item.type] * 2, 0),
      });
      return { premium: Math.ceil(basePremium + riskSurcharge + basePremium / 10 - loyaltyDiscount - followUpDiscount + PROCESSING_FEE) };
    }
    const policy = policies.get(step.policy)!;
    if (step.incident.damages.some((damage) => damage.amount < 0)) {
      throw new Error("Damage amount cannot be negative");
    }
    const matchedDamageCountByType = new Map<string, number>();
    const uncappedPayout = step.incident.damages.reduce((sum, damage) => {
      const coveredItemIndex = matchedDamageCountByType.get(damage.itemType) ?? 0;
      matchedDamageCountByType.set(damage.itemType, coveredItemIndex + 1);
      const item = policy.items.filter((candidate) => candidate.type === damage.itemType)[coveredItemIndex];
      if (!item) throw new Error(`Item type ${damage.itemType} is not covered by this policy`);
      const reimbursed = (item.enchantment ?? 0) >= 8 ? damage.amount / 2 : damage.amount;
      return sum + Math.max(0, reimbursed - 100);
    }, 0);
    const payout = Math.floor(Math.min(uncappedPayout, policy.remainingCap));
    policy.remainingCap -= payout;
    return { payout, remainingCap: policy.remainingCap };
  }) };
};
