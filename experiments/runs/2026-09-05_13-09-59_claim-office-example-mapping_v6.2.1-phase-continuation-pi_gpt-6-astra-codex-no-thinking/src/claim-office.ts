export interface Item {
  type: string;
  material?: string;
  enchantment?: number;
  cursed?: boolean;
}

export function basePremium(items: Item[]): number {
  const threeRuneDiscount = discountForExactlyThreeItemsOfType(items, "rune");
  const threeMoonstoneDiscount = discountForExactlyThreeItemsOfType(items, "moonstone");
  return insuranceSum(items) / 10 - threeRuneDiscount - threeMoonstoneDiscount;
}

function discountForExactlyThreeItemsOfType(items: Item[], itemType: string): number {
  return items.filter(item => item.type === itemType).length === 3 ? 15 : 0;
}

export function insuranceSum(items: Item[]): number {
  const insuredValueByItemType = new Map<string, number>([
    ["sword", 1000],
    ["rune", 250],
    ["moonstone", 250],
    ["potion", 400],
    ["staff", 800],
    ["amulet", 600],
  ]);
  return items.reduce(
    (totalInsuredValue, item) => {
      const insuredValue = insuredValueByItemType.get(item.type);
      if (insuredValue === undefined) throw new Error(`Unknown item type: ${item.type}`);
      return totalInsuredValue + insuredValue;
    },
    0,
  );
}

export interface Damage { itemType: string; amount: number }
export type Step = { op: "quote"; items: Item[] } | { op: "claim"; policy: number; incident: { cause: string; damages: Damage[] } };
export interface Scenario { customer: { yearsWithMHPCO: number }; steps: Step[] }
export type Result = { premium: number } | { payout: number; remainingCap: number };

const PER_DAMAGE_DEDUCTIBLE = 100;

export function processScenario(scenario: Scenario): { results: Result[] } {
  const policiesByQuoteStepIndex = new Map<number, { items: Item[]; remainingCap: number }>();
  const results = scenario.steps.map((step, stepIndex): Result => {
    if (step.op === "quote") {
      policiesByQuoteStepIndex.set(stepIndex, {items: step.items, remainingCap: insuranceSum(step.items) * 2});
      return {premium: quote(step.items, scenario.customer.yearsWithMHPCO, policiesByQuoteStepIndex.size - 1)};
    }
    const policy = policiesByQuoteStepIndex.get(step.policy)!;
    const unmatchedItems = [...policy.items];
    const uncappedReimbursement = step.incident.damages.reduce((totalReimbursement, damage) => {
      if (damage.amount < 0) throw new Error("Negative damage amount");
      const matchingItemIndex = unmatchedItems.findIndex(item => item.type === damage.itemType);
      if (matchingItemIndex === -1) throw new Error(`Item not insured: ${damage.itemType}`);
      const [insuredItem] = unmatchedItems.splice(matchingItemIndex, 1);
      const enchantmentDamageMultiplier = (insuredItem.enchantment ?? 0) >= 8 ? 0.5 : 1;
      return totalReimbursement + Math.max(0, damage.amount * enchantmentDamageMultiplier - PER_DAMAGE_DEDUCTIBLE);
    }, 0);
    const payout = Math.floor(Math.min(uncappedReimbursement, policy.remainingCap));
    policy.remainingCap -= payout;
    return {payout, remainingCap: policy.remainingCap};
  });
  return {results};
}

const PROCESSING_FEE = 5;

export function quote(items: Item[], yearsWithMHPCO: number, priorQuoteCount: number): number {
  const basePremiumAmount = basePremium(items);
  const curseSurcharge = items.reduce(
    (totalCurseSurcharge, item) => totalCurseSurcharge + (item.cursed ? basePremium([item]) * 0.5 : 0),
    0,
  );
  const enchantmentSurcharge = items.reduce(
    (totalEnchantmentSurcharge, item) => totalEnchantmentSurcharge + ((item.enchantment ?? 0) >= 5 ? basePremium([item]) * 0.3 : 0),
    0,
  );
  const loyaltyDiscount = yearsWithMHPCO >= 2 ? basePremiumAmount * 0.2 : 0;
  const repeatQuoteDiscount = priorQuoteCount > 0 ? basePremiumAmount * 0.15 : 0;
  return Math.ceil(basePremiumAmount + basePremiumAmount * 0.1 + curseSurcharge + enchantmentSurcharge - loyaltyDiscount - repeatQuoteDiscount + PROCESSING_FEE);
}
