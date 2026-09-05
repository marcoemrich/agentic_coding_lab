export interface Item { type: string; material?: string; enchantment?: number; cursed?: boolean }
export interface Damage { itemType: string; amount: number }
type Step = { op: "quote"; items: Item[] } | { op: "claim"; policy: number; incident: { cause: string; damages: Damage[] } };
export interface Scenario { customer: { yearsWithMHPCO: number }; steps: Step[] }
function basePremiumForItem(item: Item): number {
  if (item.type === "amulet") return 60;
  if (item.type === "staff") return 80;
  if (item.type === "potion") return 40;
  if (item.type === "rune" || item.type === "moonstone") return 25;
  if (item.type === "sword") return 100;
  throw new Error(`Unknown item type: ${item.type}`);
}

function discountForExactlyThreeOfType(items: Item[], itemType: string): number {
  return items.filter(item => item.type === itemType).length === 3 ? 15 : 0;
}

export function processScenario(scenario: Scenario) {
  const remainingCapByPolicy = new Map<number, number>();
  return { results: scenario.steps.map((step, stepIndex) => {
    if (step.op === "quote") {
      const undiscountedBasePremium = step.items.reduce((totalBasePremium, item) => totalBasePremium + basePremiumForItem(item), 0);
      const bundleAdjustedBasePremium = undiscountedBasePremium - discountForExactlyThreeOfType(step.items, "rune") - discountForExactlyThreeOfType(step.items, "moonstone");
      const followUpBasePremiumDiscount = remainingCapByPolicy.size > 0 ? bundleAdjustedBasePremium * 15 / 100 : 0;
      remainingCapByPolicy.set(stepIndex, undiscountedBasePremium * 20);
      const curseSurcharge = step.items.reduce((totalCurseSurcharge, item) => totalCurseSurcharge + (item.cursed ? basePremiumForItem(item) / 2 : 0), 0);
      const loyaltyBasePremiumDiscount = scenario.customer.yearsWithMHPCO >= 2 ? bundleAdjustedBasePremium / 5 : 0;
      const enchantmentSurcharge = step.items.reduce((totalEnchantmentSurcharge, item) => totalEnchantmentSurcharge + ((item.enchantment ?? 0) >= 5 ? basePremiumForItem(item) * 3 / 10 : 0), 0);
      return { premium: Math.ceil(bundleAdjustedBasePremium + bundleAdjustedBasePremium / 10 + curseSurcharge + enchantmentSurcharge - loyaltyBasePremiumDiscount - followUpBasePremiumDiscount + 5) };
    }
    const policyQuote = scenario.steps[step.policy] as Extract<Step, { op: "quote" }>;
    const unmatchedInsuredItems = [...policyQuote.items];
    const uncappedPayout = step.incident.damages.reduce((totalUncappedPayout, damage) => {
      if (damage.amount < 0) throw new Error("Negative damage amount");
      const matchingInsuredItemIndex = unmatchedInsuredItems.findIndex(item => item.type === damage.itemType);
      if (matchingInsuredItemIndex < 0) throw new Error(`Item not insured: ${damage.itemType}`);
      const [insuredItem] = unmatchedInsuredItems.splice(matchingInsuredItemIndex, 1);
      return totalUncappedPayout + Math.max(0, damage.amount * ((insuredItem.enchantment ?? 0) >= 8 ? 0.5 : 1) - 100);
    }, 0);
    const availableCap = remainingCapByPolicy.get(step.policy)!;
    const payout = Math.floor(Math.min(uncappedPayout, availableCap));
    const remainingCap = availableCap - payout;
    remainingCapByPolicy.set(step.policy, remainingCap);
    return { payout, remainingCap };
  }) };
}
