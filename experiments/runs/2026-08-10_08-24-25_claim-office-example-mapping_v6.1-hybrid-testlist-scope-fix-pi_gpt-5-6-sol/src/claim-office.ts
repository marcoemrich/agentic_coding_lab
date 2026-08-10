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

export type Result = { premium: number } | { payout: number; remainingCap: number };

const PROCESSING_FEE = 5;
const INSURANCE_VALUE_BY_ITEM_TYPE: Record<string, number> = {
  sword: 1000,
  amulet: 600,
  staff: 800,
  potion: 400,
  rune: 250,
  moonstone: 250,
};
const getKnownItemBasePremium = (itemType: string): number => {
  const insuranceValue = INSURANCE_VALUE_BY_ITEM_TYPE[itemType];
  if (insuranceValue === undefined) throw new Error(`Unknown item type: ${itemType}`);
  return insuranceValue / 10;
};

const calculateQuotePremium = (items: Item[], yearsWithMHPCO: number, previousQuoteContracts: number): number => {
  const itemCountsByType = items.reduce<Record<string, number>>((countsByType, item) => {
    countsByType[item.type] = (countsByType[item.type] ?? 0) + 1;
    return countsByType;
  }, {});
  const basePremium = Object.entries(itemCountsByType).reduce((sum, [type, count]) => {
    const qualifiesForComponentBlockPremium = ["rune", "moonstone"].includes(type) && count === 3;
    return sum + (qualifiesForComponentBlockPremium ? 60 : getKnownItemBasePremium(type) * count);
  }, 0);
  const cursedSurcharge = items.reduce(
    (sum, item) => sum + (item.cursed ? getKnownItemBasePremium(item.type) / 2 : 0),
    0,
  );
  const enchantmentSurcharge = items.reduce(
    (sum, item) => sum + ((item.enchantment ?? 0) >= 5 ? getKnownItemBasePremium(item.type) * 3 / 10 : 0),
    0,
  );
  const loyaltyDiscount = yearsWithMHPCO >= 2 ? basePremium / 5 : 0;
  const followUpDiscount = previousQuoteContracts > 0 ? basePremium * 15 / 100 : 0;
  return Math.ceil(basePremium + cursedSurcharge + enchantmentSurcharge + basePremium / 10 - loyaltyDiscount - followUpDiscount + PROCESSING_FEE);
};

export const processScenario = (scenario: Scenario): { results: Result[] } => {
  let previousQuoteContracts = 0;
  const policies = new Map<number, { items: Item[]; remainingCap: number }>();
  return {
    results: scenario.steps.map((step, stepIndex) => {
      if (step.op === "claim") {
        const policy = policies.get(step.policy);
        if (!policy) throw new Error(`Unknown policy: ${step.policy}`);
        const unmatchedInsuredItems = [...policy.items];
        const desiredPayout = step.incident.damages.reduce((sum, damage) => {
          if (damage.amount < 0) throw new Error(`Negative damage amount: ${damage.amount}`);
          const itemIndex = unmatchedInsuredItems.findIndex((item) => item.type === damage.itemType);
          const item = unmatchedInsuredItems[itemIndex];
          if (!item) throw new Error(`Item not insured: ${damage.itemType}`);
          unmatchedInsuredItems.splice(itemIndex, 1);
          const reimbursableDamage = (item.enchantment ?? 0) >= 8 ? damage.amount / 2 : damage.amount;
          return sum + Math.max(0, reimbursableDamage - 100);
        }, 0);
        const payout = Math.min(Math.floor(desiredPayout), policy.remainingCap);
        policy.remainingCap -= payout;
        return { payout, remainingCap: policy.remainingCap };
      }
      const premium = calculateQuotePremium(step.items, scenario.customer.yearsWithMHPCO, previousQuoteContracts);
      const insuranceSum = step.items.reduce((sum, item) => sum + (INSURANCE_VALUE_BY_ITEM_TYPE[item.type] ?? 0), 0);
      policies.set(stepIndex, { items: step.items, remainingCap: insuranceSum * 2 });
      previousQuoteContracts += 1;
      return { premium };
    }),
  };
};
