export interface Scenario {
  customer: { yearsWithMHPCO: number };
  steps: Array<Record<string, unknown>>;
}
export interface OperationResult {
  premium?: number;
  payout?: number;
  remainingCap?: number;
}
export interface ScenarioResult { results: OperationResult[]; }
interface Item { type: string; cursed?: boolean; enchantment?: number; material?: string; }
interface Policy { items: Item[]; remainingCap: number; }
interface Damage { itemType: string; amount: number; }

const PROCESSING_FEE = 5;
const BASE_PREMIUM: Record<string, number> = {
  sword: 100, amulet: 60, staff: 80, potion: 40, rune: 25, moonstone: 25,
};
const INSURANCE_VALUE: Record<string, number> = {
  sword: 1000, amulet: 600, staff: 800, potion: 400, rune: 250, moonstone: 250,
};

const calculatePremium = (items: Item[], yearsWithMHPCO: number, priorQuoteCount: number): number => {
  const componentDiscount = ["rune", "moonstone"].reduce((discount, type) =>
    discount + (items.filter(item => item.type === type).length === 3 ? 15 : 0), 0);
  const base = items.reduce((sum, item) => sum + BASE_PREMIUM[item.type], 0) - componentDiscount;
  const curseSurcharge = items.reduce((sum, item) => sum + (item.cursed ? BASE_PREMIUM[item.type] * 0.5 : 0), 0);
  const enchantmentSurcharge = items.reduce((sum, item) =>
    sum + ((item.enchantment ?? 0) >= 5 ? BASE_PREMIUM[item.type] * 0.3 : 0), 0);
  const loyaltyDiscount = yearsWithMHPCO >= 2 ? base * 0.2 : 0;
  const followUpDiscount = priorQuoteCount > 0 ? base * 0.15 : 0;
  return Math.ceil(base + curseSurcharge + enchantmentSurcharge + base * 0.1 - loyaltyDiscount - followUpDiscount + PROCESSING_FEE);
};

export const processScenario = (scenario: Scenario): ScenarioResult => {
  const policies = new Map<number, Policy>();
  let quoteCount = 0;
  const results = scenario.steps.map((step, stepIndex) => {
    if (step.op === "quote") {
      const items = step.items as Item[];
      for (const item of items) {
        if (!(item.type in BASE_PREMIUM)) throw new Error(`Unknown item type: ${item.type}`);
      }
      const insuranceSum = items.reduce((sum, item) => sum + INSURANCE_VALUE[item.type], 0);
      policies.set(stepIndex, { items, remainingCap: insuranceSum * 2 });
      const premium = calculatePremium(items, scenario.customer.yearsWithMHPCO, quoteCount);
      quoteCount += 1;
      return { premium };
    }
    const policy = policies.get(step.policy as number)!;
    const damages = (step.incident as { damages: Damage[] }).damages;
    for (const damage of damages) {
      if (damage.amount < 0) throw new Error("Damage amount must be non-negative");
    }
    const matchedDamageCountByItemType: Record<string, number> = {};
    const uncappedPayout = damages.reduce((sum, damage) => {
      const occurrenceIndex = matchedDamageCountByItemType[damage.itemType] ?? 0;
      const insuredItem = policy.items.filter(item => item.type === damage.itemType)[occurrenceIndex];
      if (!insuredItem) throw new Error(`Damage item ${damage.itemType} is not covered`);
      matchedDamageCountByItemType[damage.itemType] = occurrenceIndex + 1;
      const reimbursable = (insuredItem.enchantment ?? 0) >= 8 ? damage.amount * 0.5 : damage.amount;
      return sum + Math.max(0, reimbursable - 100);
    }, 0);
    const payout = Math.floor(Math.min(uncappedPayout, policy.remainingCap));
    policy.remainingCap -= payout;
    return { payout, remainingCap: policy.remainingCap };
  });
  return { results };
};
