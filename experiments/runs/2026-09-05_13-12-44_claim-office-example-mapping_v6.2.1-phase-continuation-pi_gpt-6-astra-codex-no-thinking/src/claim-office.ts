export interface Item {
  type: string;
  material?: string;
  enchantment?: number;
  cursed?: boolean;
}

export interface Quote {
  premium: number;
  basePremium: number;
  insuranceSum: number;
}
export function quote(items: Item[], loyaltyYears: number, previousContracts: number): Quote {
  const basePremiumByType: Record<string, number> = { sword: 100, amulet: 60, staff: 80, potion: 40, rune: 25, moonstone: 25 };
  for (const item of items) {
    if (!Object.prototype.hasOwnProperty.call(basePremiumByType, item.type)) throw new Error(`Unknown item type: ${item.type}`);
  }
  const undiscountedBasePremium = items.reduce((totalBasePremium, item) => totalBasePremium + basePremiumByType[item.type], 0);
  const componentSetDiscount = ["rune", "moonstone"].reduce((discount, type) => discount + (items.filter(item => item.type === type).length === 3 ? 15 : 0), 0);
  const basePremium = undiscountedBasePremium - componentSetDiscount;
  const curseSurcharge = items.reduce((totalCurseSurcharge, item) => totalCurseSurcharge + (item.cursed ? basePremiumByType[item.type] * 0.5 : 0), 0);
  const enchantmentSurcharge = items.reduce((totalEnchantmentSurcharge, item) => totalEnchantmentSurcharge + ((item.enchantment ?? 0) >= 5 ? basePremiumByType[item.type] * 0.3 : 0), 0);
  const loyaltyDiscount = loyaltyYears >= 2 ? basePremium * 0.2 : 0;
  const followUpDiscount = previousContracts > 0 ? basePremium * 0.15 : 0;
  const assessmentFee = basePremium * 0.1;
  const processingFee = 5;
  const insuranceSumMultiplier = 10;
  return { premium: Math.ceil(basePremium + curseSurcharge + enchantmentSurcharge - loyaltyDiscount - followUpDiscount + assessmentFee + processingFee), basePremium, insuranceSum: undiscountedBasePremium * insuranceSumMultiplier };
}
export interface Scenario {
  customer: { yearsWithMHPCO: number };
  steps: ({ op: "quote"; items: Item[] } | { op: "claim"; policy: number; incident: { cause: string; damages: { itemType: string; amount: number }[] } })[];
}
export function processScenario(input: Scenario) {
  const policies = new Map<number, { items: Item[]; remainingCap: number }>();
  let previousContracts = 0;
  const results = input.steps.map((step, stepIndex) => {
    if (step.op === "quote") {
      const policyQuote = quote(step.items, input.customer.yearsWithMHPCO, previousContracts++);
      policies.set(stepIndex, { items: step.items, remainingCap: policyQuote.insuranceSum * 2 });
      return { premium: policyQuote.premium };
    }
    const policy = policies.get(step.policy)!;
    const deductiblePerDamageEntry = 100;
    const unmatchedInsuredItems = [...policy.items];
    const payoutBeforeCap = step.incident.damages.reduce((totalPayoutBeforeCap, damage) => {
      if (damage.amount < 0) throw new Error("Negative damage amount");
      const itemIndex = unmatchedInsuredItems.findIndex(item => item.type === damage.itemType);
      if (itemIndex < 0) throw new Error(`Item not insured: ${damage.itemType}`);
      const [insuredItem] = unmatchedInsuredItems.splice(itemIndex, 1);
      const reimbursementBeforeDeductible = damage.amount * ((insuredItem.enchantment ?? 0) >= 8 ? 0.5 : 1);
      return totalPayoutBeforeCap + reimbursementBeforeDeductible - deductiblePerDamageEntry;
    }, 0);
    const payout = Math.floor(Math.min(payoutBeforeCap, policy.remainingCap));
    policy.remainingCap -= payout;
    return { payout, remainingCap: policy.remainingCap };
  });
  return { results };
}
