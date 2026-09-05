export interface Item {
  type: string;
  material?: string;
  enchantment?: number;
  cursed?: boolean;
}

const INSURANCE_SUM_MULTIPLIER = 10;
const PROCESSING_FEE = 5;
const PER_ITEM_DEDUCTIBLE = 100;
const FIRST_INSURANCE_SURCHARGE_RATE = 0.1;
const EXACTLY_THREE_SAME_TYPE_DISCOUNT = 15;
const CURSED_SURCHARGE_RATE = 0.5;

const BASE_PREMIUM_BY_TYPE: Record<string, number> = { sword: 100, amulet: 60, staff: 80, potion: 40, rune: 25, moonstone: 25 };

export function quote(items: Item[], yearsWithMHPCO = 0, previousContractCount = 0) {
  for (const item of items) {
    if (!Object.hasOwn(BASE_PREMIUM_BY_TYPE, item.type)) throw new Error(`Unknown item type: ${item.type}`);
  }
  const undiscountedBasePremium = items.reduce((totalBasePremium, item) => totalBasePremium + BASE_PREMIUM_BY_TYPE[item.type], 0);
  const insuranceSum = undiscountedBasePremium * INSURANCE_SUM_MULTIPLIER;
  const basePremium = undiscountedBasePremium - ["rune", "moonstone"].reduce((discount, type) => discount + (items.filter(item => item.type === type).length === 3 ? EXACTLY_THREE_SAME_TYPE_DISCOUNT : 0), 0);
  const riskSurcharge = items.reduce((totalRiskSurcharge, item) => totalRiskSurcharge + BASE_PREMIUM_BY_TYPE[item.type] * ((item.cursed ? CURSED_SURCHARGE_RATE : 0) + ((item.enchantment ?? 0) >= 5 ? 0.3 : 0)), 0);
  const loyaltyDiscount = yearsWithMHPCO >= 2 ? basePremium * 0.2 : 0;
  const followUpDiscount = previousContractCount > 0 ? basePremium * 0.15 : 0;
  return { basePremium, insuranceSum, premium: Math.ceil(basePremium + riskSurcharge + basePremium * FIRST_INSURANCE_SURCHARGE_RATE - loyaltyDiscount - followUpDiscount + PROCESSING_FEE) };
}

export interface Damage { itemType: string; amount: number }
export type Step = { op: "quote"; items: Item[] } | { op: "claim"; policy: number; incident: { cause: string; damages: Damage[] } };
export interface Scenario {
  customer: { yearsWithMHPCO: number };
  steps: Step[];
}

export function runScenario(input: Scenario) {
  const policiesByStepIndex = new Map<number, { items: Item[]; remainingCap: number }>();
  let previousContractCount = 0;
  const results = input.steps.map((step, stepIndex) => {
    if (step.op === "quote") {
      const policyQuote = quote(step.items, input.customer.yearsWithMHPCO, previousContractCount++);
      policiesByStepIndex.set(stepIndex, { items: step.items, remainingCap: policyQuote.insuranceSum * 2 });
      return { premium: policyQuote.premium };
    }
    const policy = policiesByStepIndex.get(step.policy)!;
    const unclaimedInsuredItems = [...policy.items];
    const payoutBeforeCap = step.incident.damages.reduce((totalPayout, damage) => {
      if (damage.amount < 0) throw new Error(`Negative damage amount: ${damage.amount}`);
      const itemIndex = unclaimedInsuredItems.findIndex(item => item.type === damage.itemType);
      if (itemIndex < 0) throw new Error(`Item not insured: ${damage.itemType}`);
      const [insuredItem] = unclaimedInsuredItems.splice(itemIndex, 1);
      return totalPayout + Math.max(0, damage.amount * ((insuredItem.enchantment ?? 0) >= 8 ? 0.5 : 1) - PER_ITEM_DEDUCTIBLE);
    }, 0);
    const payout = Math.floor(Math.min(payoutBeforeCap, policy.remainingCap));
    policy.remainingCap -= payout;
    return { payout, remainingCap: policy.remainingCap };
  });
  return { results };
}
