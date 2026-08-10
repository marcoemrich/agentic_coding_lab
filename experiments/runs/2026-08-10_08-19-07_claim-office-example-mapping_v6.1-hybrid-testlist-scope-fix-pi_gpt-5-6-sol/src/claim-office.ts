const PROCESSING_FEE = 5;
const BASE_PREMIUM_BY_ITEM_TYPE: Record<string, number> = { sword: 100, amulet: 60, staff: 80, potion: 40, rune: 25, moonstone: 25 };
const INSURANCE_VALUE_BY_ITEM_TYPE: Record<string, number> = { sword: 1000, amulet: 600, staff: 800, potion: 400, rune: 250, moonstone: 250 };

type Item = { type: string; cursed?: boolean; enchantment?: number; material?: string };
type QuoteStep = { op: "quote"; items: Item[] };
type Damage = { itemType: string; amount: number };
type ClaimStep = { op: "claim"; policy: number; incident: { cause: string; damages: Damage[] } };
type Scenario = { customer?: { yearsWithMHPCO: number }; steps: Array<QuoteStep | ClaimStep> };

function calculateQuotePremium(items: Item[], customerTenureYears: number, previousQuoteCount: number): number {
  const itemCountsByType = items.reduce<Record<string, number>>((counts, item) => {
    counts[item.type] = (counts[item.type] ?? 0) + 1;
    return counts;
  }, {});
  const basePremium = Object.entries(itemCountsByType).reduce(
    (sum, [type, count]) => sum + (count === 3 && (type === "rune" || type === "moonstone") ? 60 : count * BASE_PREMIUM_BY_ITEM_TYPE[type]), 0,
  );
  const curseSurcharge = items.reduce((sum, item) => sum + (item.cursed ? BASE_PREMIUM_BY_ITEM_TYPE[item.type] / 2 : 0), 0);
  const enchantmentSurcharge = items.reduce((sum, item) => sum + ((item.enchantment ?? 0) >= 5 ? BASE_PREMIUM_BY_ITEM_TYPE[item.type] * 0.3 : 0), 0);
  return Math.ceil(basePremium + curseSurcharge + enchantmentSurcharge - (customerTenureYears >= 2 ? basePremium * 0.2 : 0) + basePremium * 0.1 - (previousQuoteCount > 0 ? basePremium * 0.15 : 0) + PROCESSING_FEE);
}

export function processScenario(scenario: Scenario): unknown {
  const results: unknown[] = [];
  const remainingCaps = new Map<number, number>();
  const policies = new Map<number, Item[]>();
  let quoteCount = 0;
  scenario.steps.forEach((step, stepIndex) => {
    if (step.op === "quote") {
      step.items.forEach((item) => {
        if (!(item.type in BASE_PREMIUM_BY_ITEM_TYPE)) throw new Error(`Unknown item type: ${item.type}`);
      });
      const insuranceSum = step.items.reduce((sum, item) => sum + INSURANCE_VALUE_BY_ITEM_TYPE[item.type], 0);
      remainingCaps.set(stepIndex, insuranceSum * 2);
      policies.set(stepIndex, step.items);
      results.push({ premium: calculateQuotePremium(step.items, scenario.customer?.yearsWithMHPCO ?? 0, quoteCount++) });
      return;
    }
    const insuredItems = [...(policies.get(step.policy) ?? [])];
    const desiredPayoutBeforeCap = step.incident.damages.reduce((sum, damage) => {
      if (damage.amount < 0) throw new Error("Negative damage amount");
      const itemIndex = insuredItems.findIndex((item) => item.type === damage.itemType);
      if (itemIndex < 0) throw new Error(`Uninsured or unknown damage item: ${damage.itemType}`);
      const [item] = insuredItems.splice(itemIndex, 1);
      const reimbursed = (item.enchantment ?? 0) >= 8 ? damage.amount / 2 : damage.amount;
      return sum + Math.max(0, reimbursed - 100);
    }, 0);
    const cap = remainingCaps.get(step.policy) ?? 0;
    const payout = Math.floor(Math.min(desiredPayoutBeforeCap, cap));
    remainingCaps.set(step.policy, cap - payout);
    results.push({ payout, remainingCap: cap - payout });
  });
  return { results };
}
