export interface Scenario {
  customer: { yearsWithMHPCO: number };
  steps: Array<Record<string, unknown>>;
}

export interface ScenarioResult {
  results: Array<Record<string, number>>;
}

type Item = { type: string; cursed?: boolean; enchantment?: number; material?: string };
type Damage = { itemType: string; amount: number };

const PROCESSING_FEE_IN_GOLD = 5;
const LOYALTY_DISCOUNT_RATE = 0.2;
const MINIMUM_YEARS_FOR_LOYALTY_DISCOUNT = 2;
const FOLLOW_UP_CONTRACT_DISCOUNT_RATE = 0.15;
const BASE_PREMIUM_IN_GOLD_BY_ITEM_TYPE: Record<string, number> = {
  sword: 100, amulet: 60, staff: 80, potion: 40, rune: 25, moonstone: 25,
};
const INSURANCE_VALUE_BY_ITEM_TYPE: Record<string, number> = {
  sword: 1000, amulet: 600, staff: 800, potion: 400, rune: 250, moonstone: 250,
};

function getBasePremiumInGold(itemType: string): number {
  const premium = BASE_PREMIUM_IN_GOLD_BY_ITEM_TYPE[itemType];
  if (premium === undefined) throw new Error(`Unknown item type: ${itemType}`);
  return premium;
}

export function runScenario(scenario: Scenario): ScenarioResult {
  const results: Array<Record<string, number>> = [];
  const paidByPolicy = new Map<number, number>();

  scenario.steps.forEach((step, stepIndex) => {
    if (step.op === "claim") {
      const policyIndex = step.policy as number;
      const policy = scenario.steps[policyIndex];
      const items = policy.items as Item[];
      const damages = (step.incident as { damages: Damage[] }).damages;
      for (const damage of damages) {
        if (damage.amount < 0) throw new Error("Negative damage amounts are not allowed");
        const insuredItemCount = items.filter((item) => item.type === damage.itemType).length;
        const reportedDamageCount = damages.filter((entry) => entry.itemType === damage.itemType).length;
        if (reportedDamageCount > insuredItemCount) throw new Error(`More damage entries than covered for ${damage.itemType}`);
      }
      const uncappedPayout = damages.reduce((sum, damage) => {
        const insuredItem = items.find((item) => item.type === damage.itemType)!;
        const reimbursableDamage = (insuredItem.enchantment ?? 0) >= 8 ? damage.amount / 2 : damage.amount;
        return sum + Math.max(0, reimbursableDamage - 100);
      }, 0);
      const policyPayoutCap = items.reduce(
        (sum, item) => sum + INSURANCE_VALUE_BY_ITEM_TYPE[item.type] * 2,
        0,
      );
      const alreadyPaid = paidByPolicy.get(policyIndex) ?? 0;
      const payout = Math.floor(Math.min(uncappedPayout, policyPayoutCap - alreadyPaid));
      paidByPolicy.set(policyIndex, alreadyPaid + payout);
      results.push({ payout, remainingCap: policyPayoutCap - alreadyPaid - payout });
      return;
    }

    const items = step.items as Item[];
    const itemizedBasePremiumTotal = items.reduce((sum, item) => sum + getBasePremiumInGold(item.type), 0);
    const buildingBlockCount = ["rune", "moonstone"].filter(
      (type) => items.filter((item) => item.type === type).length === 3,
    ).length;
    const basePremiumTotal = itemizedBasePremiumTotal - buildingBlockCount * 15;
    const curseSurcharge = items.reduce(
      (sum, item) => sum + (item.cursed ? getBasePremiumInGold(item.type) / 2 : 0), 0,
    );
    const highEnchantmentSurcharge = items.reduce(
      (sum, item) => sum + ((item.enchantment ?? 0) >= 5 ? getBasePremiumInGold(item.type) * 0.3 : 0), 0,
    );
    const loyaltyDiscount = scenario.customer.yearsWithMHPCO >= MINIMUM_YEARS_FOR_LOYALTY_DISCOUNT
      ? basePremiumTotal * LOYALTY_DISCOUNT_RATE : 0;
    const isFollowUpContract = scenario.steps.slice(0, stepIndex).some((earlier) => earlier.op === "quote");
    const followUpDiscount = isFollowUpContract ? basePremiumTotal * FOLLOW_UP_CONTRACT_DISCOUNT_RATE : 0;
    const premium = Math.ceil(
      basePremiumTotal + curseSurcharge + highEnchantmentSurcharge + basePremiumTotal / 10
      - loyaltyDiscount - followUpDiscount + PROCESSING_FEE_IN_GOLD,
    );
    results.push({ premium });
  });

  return { results };
}
