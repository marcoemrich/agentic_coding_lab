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

export interface ClaimStep {
  op: "claim";
  policy: number;
  incident: { cause: string; damages: Array<{ itemType: string; amount: number }> };
}

export interface Scenario {
  customer: { yearsWithMHPCO: number };
  steps: Array<QuoteStep | ClaimStep>;
}

export interface ScenarioResult {
  results: Array<{ premium: number } | { payout: number; remainingCap: number }>;
}

const BASE_PREMIUM_BY_ITEM_TYPE: Record<string, number> = {
  sword: 100,
  amulet: 60,
  staff: 80,
  potion: 40,
  rune: 25,
  moonstone: 25,
};

function calculatePolicyBasePremium(items: Item[]): number {
  const itemCountsByType = items.reduce<Record<string, number>>((counts, item) => {
    counts[item.type] = (counts[item.type] ?? 0) + 1;
    return counts;
  }, {});
  return Object.entries(itemCountsByType).reduce(
    (sum, [type, count]) => sum + (count === 3 && (type === "rune" || type === "moonstone") ? 60 : count * BASE_PREMIUM_BY_ITEM_TYPE[type]),
    0,
  );
}

function calculateItemSurcharge(item: Item): number {
  const basePremium = BASE_PREMIUM_BY_ITEM_TYPE[item.type];
  const curseSurcharge = item.cursed ? basePremium / 2 : 0;
  const enchantmentSurcharge = (item.enchantment ?? 0) >= 5 ? basePremium * 3 / 10 : 0;
  return curseSurcharge + enchantmentSurcharge;
}

export function runScenario(scenario: Scenario): ScenarioResult {
  const remainingPayoutCapsByPolicy = new Map<number, number>();
  return {
    results: scenario.steps.map((step, stepIndex) => {
      if (step.op === "claim") {
        const policyQuote = scenario.steps[step.policy] as QuoteStep;
        if (step.incident.damages.some((damage) => damage.amount < 0)) throw new Error("Claim contains negative damage amount");
        const damageEntryCountsByItemType = step.incident.damages.reduce<Record<string, number>>((counts, damage) => {
          counts[damage.itemType] = (counts[damage.itemType] ?? 0) + 1;
          return counts;
        }, {});
        for (const [itemType, count] of Object.entries(damageEntryCountsByItemType)) {
          if (policyQuote.items.filter((item) => item.type === itemType).length < count) {
            throw new Error(`Claim has more damaged items than insured: ${itemType}`);
          }
        }
        const uncappedPayout = step.incident.damages.reduce((total, damage) => {
          const insuredItem = policyQuote.items.find((item) => item.type === damage.itemType)!;
          const coveredDamageBeforeDeductible = (insuredItem.enchantment ?? 0) >= 8 ? damage.amount / 2 : damage.amount;
          return total + Math.max(0, coveredDamageBeforeDeductible - 100);
        }, 0);
        const remainingCapBeforeClaim = remainingPayoutCapsByPolicy.get(step.policy) ?? 0;
        const payout = Math.floor(Math.min(uncappedPayout, remainingCapBeforeClaim));
        const remainingCap = remainingCapBeforeClaim - payout;
        remainingPayoutCapsByPolicy.set(step.policy, remainingCap);
        return { payout, remainingCap };
      }
      for (const item of step.items) {
        if (!(item.type in BASE_PREMIUM_BY_ITEM_TYPE)) throw new Error(`Unknown item type: ${item.type}`);
      }
      const policyBasePremium = calculatePolicyBasePremium(step.items);
      const insuranceValue = step.items.reduce((sum, item) => sum + ({ sword: 1000, amulet: 600, staff: 800, potion: 400, rune: 250, moonstone: 250 }[item.type] ?? 0), 0);
      remainingPayoutCapsByPolicy.set(stepIndex, insuranceValue * 2);
      const totalItemSurcharge = step.items.reduce(
        (sum, item) => sum + calculateItemSurcharge(item),
        0,
      );
      const loyaltyDiscount = scenario.customer.yearsWithMHPCO >= 2 ? policyBasePremium / 5 : 0;
      const followUpDiscount = stepIndex > 0 ? policyBasePremium * 15 / 100 : 0;
      return { premium: Math.ceil(policyBasePremium + totalItemSurcharge + policyBasePremium / 10 - loyaltyDiscount - followUpDiscount + 5) };
    }),
  };
}
