type Item = { type: string; cursed?: boolean; enchantment?: number; material?: string };
type QuoteStep = { op: "quote"; items: Item[] };
type ClaimStep = {
  op: "claim";
  policy: number;
  incident: { cause: string; damages: { itemType: string; amount: number }[] };
};
type Scenario = { customer: { yearsWithMHPCO: number }; steps: (QuoteStep | ClaimStep)[] };
type Result = { premium?: number; payout?: number; remainingCap?: number };

const itemInsuranceTermsByType: Record<string, { basePremium: number; insuranceValue: number }> = {
  sword: { basePremium: 100, insuranceValue: 1000 },
  amulet: { basePremium: 60, insuranceValue: 600 },
  staff: { basePremium: 80, insuranceValue: 800 },
  potion: { basePremium: 40, insuranceValue: 400 },
  rune: { basePremium: 25, insuranceValue: 250 },
  moonstone: { basePremium: 25, insuranceValue: 250 },
};

const assertKnownItemType = (itemType: string): void => {
  if (!(itemType in itemInsuranceTermsByType)) {
    throw new Error(`Unknown item type: ${itemType}`);
  }
};

export const processScenario = (scenario: Scenario): { results: Result[] } => {
  const policyCaps: Record<number, number> = {};
  const policyItems: Record<number, Item[]> = {};
  let hasPriorQuote = false;
  const results = scenario.steps.map((step, stepIndex): Result => {
    if (step.op === "claim") {
      const nextInsuredItemIndexByType: Record<string, number> = {};
      const uncappedPayout = step.incident.damages.reduce((sum, damage) => {
        if (damage.amount < 0) {
          throw new Error(`Negative damage amount: ${damage.amount}`);
        }
        assertKnownItemType(damage.itemType);
        const sameTypeItems = policyItems[step.policy].filter((item) => item.type === damage.itemType);
        if (sameTypeItems.length === 0) {
          throw new Error(`Item type is not insured by this policy: ${damage.itemType}`);
        }
        const insuredItemIndex = nextInsuredItemIndexByType[damage.itemType] ?? 0;
        const insuredItem = sameTypeItems[insuredItemIndex];
        if (insuredItem === undefined) {
          throw new Error(`More damage entries for ${damage.itemType} than the policy covers`);
        }
        nextInsuredItemIndexByType[damage.itemType] = insuredItemIndex + 1;
        const reimbursableDamage = (insuredItem.enchantment ?? 0) >= 8 ? damage.amount / 2 : damage.amount;
        return sum + Math.max(0, reimbursableDamage - 100);
      }, 0);
      const payout = Math.floor(Math.min(uncappedPayout, policyCaps[step.policy]));
      policyCaps[step.policy] -= payout;
      return { payout, remainingCap: policyCaps[step.policy] };
    }

    for (const item of step.items) {
      assertKnownItemType(item.type);
    }
    const totalItemBasePremium = step.items.reduce(
      (sum, item) => sum + itemInsuranceTermsByType[item.type].basePremium,
      0,
    );
    const componentBlockDiscount = ["rune", "moonstone"].reduce(
      (discount, type) => discount + (step.items.filter((item) => item.type === type).length === 3 ? 15 : 0),
      0,
    );
    const basePremium = totalItemBasePremium - componentBlockDiscount;
    const cursedSurcharge = step.items.reduce(
      (surcharge, item) => surcharge + (item.cursed ? itemInsuranceTermsByType[item.type].basePremium / 2 : 0),
      0,
    );
    const enchantmentSurcharge = step.items.reduce(
      (surcharge, item) =>
        surcharge + ((item.enchantment ?? 0) >= 5 ? (itemInsuranceTermsByType[item.type].basePremium * 3) / 10 : 0),
      0,
    );
    policyCaps[stepIndex] = step.items.reduce(
      (sum, item) => sum + itemInsuranceTermsByType[item.type].insuranceValue * 2,
      0,
    );
    policyItems[stepIndex] = step.items;
    const loyaltyDiscount = scenario.customer.yearsWithMHPCO >= 2 ? basePremium / 5 : 0;
    const followUpDiscount = hasPriorQuote ? (basePremium * 15) / 100 : 0;
    hasPriorQuote = true;
    return {
      premium: Math.ceil(
        (basePremium * 11) / 10 + cursedSurcharge + enchantmentSurcharge - loyaltyDiscount - followUpDiscount + 5,
      ),
    };
  });
  return { results };
};
