export interface InsuredItem {
  type: string;
  material?: string;
  cursed?: boolean;
  enchantment?: number;
}

interface Damage { itemType: string; amount: number }
interface QuoteStep { op: "quote"; items: InsuredItem[] }
interface ClaimStep { op: "claim"; policy: number; incident: { cause: string; damages: Damage[] } }
type ScenarioStep = QuoteStep | ClaimStep;

export interface Scenario {
  customer: { yearsWithMHPCO: number };
  steps: Array<ScenarioStep | { op: string; items?: InsuredItem[]; policy?: number; incident?: { cause: string; damages: Damage[] } }>;
}

const BASE_PREMIUM_BY_ITEM_TYPE: Record<string, number> = { sword: 100, amulet: 60, staff: 80, potion: 40, rune: 25, moonstone: 25 };
const VALUE_BY_ITEM_TYPE: Record<string, number> = { sword: 1000, amulet: 600, staff: 800, potion: 400, rune: 250, moonstone: 250 };
const PREMIUM_RULES = {
  componentBundleSize: 3,
  componentBundlePremium: 60,
  curseDivisor: 2,
  highEnchantmentLevel: 5,
  enchantmentRateNumerator: 3,
  enchantmentRateDenominator: 10,
  loyalCustomerYears: 2,
  loyaltyDivisor: 5,
  followUpDiscountPercent: 15,
  percentageDenominator: 100,
  firstInsuranceSurchargeDivisor: 10,
  processingFee: 5,
};
const CLAIM_RULES = { capMultiplier: 2, highEnchantmentLevel: 8, highEnchantmentDivisor: 2, deductible: 100 };

function calculateQuotePremium(items: InsuredItem[], customerYears: number, previousQuoteCount: number): number {
  const unknownItem = items.find(item => !(item.type in BASE_PREMIUM_BY_ITEM_TYPE));
  if (unknownItem) throw new Error(`Unknown item type: ${unknownItem.type}`);
  const itemCountsByType = items.reduce<Record<string, number>>((itemCounts, item) => ({ ...itemCounts, [item.type]: (itemCounts[item.type] ?? 0) + 1 }), {});
  const basePremium = Object.entries(itemCountsByType).reduce((sum, [type, count]) => sum + (["rune", "moonstone"].includes(type) && count === PREMIUM_RULES.componentBundleSize ? PREMIUM_RULES.componentBundlePremium : BASE_PREMIUM_BY_ITEM_TYPE[type] * count), 0);
  const curseSurcharge = items.reduce((sum, item) => sum + (item.cursed ? BASE_PREMIUM_BY_ITEM_TYPE[item.type] / PREMIUM_RULES.curseDivisor : 0), 0);
  const enchantmentSurcharge = items.reduce((sum, item) => sum + ((item.enchantment ?? 0) >= PREMIUM_RULES.highEnchantmentLevel ? BASE_PREMIUM_BY_ITEM_TYPE[item.type] * PREMIUM_RULES.enchantmentRateNumerator / PREMIUM_RULES.enchantmentRateDenominator : 0), 0);
  const loyaltyDiscount = customerYears >= PREMIUM_RULES.loyalCustomerYears ? basePremium / PREMIUM_RULES.loyaltyDivisor : 0;
  const followUpDiscount = previousQuoteCount > 0 ? basePremium * PREMIUM_RULES.followUpDiscountPercent / PREMIUM_RULES.percentageDenominator : 0;
  return Math.ceil(basePremium + curseSurcharge + enchantmentSurcharge + basePremium / PREMIUM_RULES.firstInsuranceSurchargeDivisor - loyaltyDiscount - followUpDiscount + PREMIUM_RULES.processingFee);
}

export function runScenario(scenario: Scenario) {
  const remainingCapsByPolicyStep = new Map<number, number>();
  let quoteCount = 0;
  const results = scenario.steps.map((rawStep, stepIndex) => {
    const step = rawStep as ScenarioStep;
    if (step.op === "quote") {
      const insuranceSum = step.items.reduce((sum, item) => sum + VALUE_BY_ITEM_TYPE[item.type], 0);
      remainingCapsByPolicyStep.set(stepIndex, insuranceSum * CLAIM_RULES.capMultiplier);
      return { premium: calculateQuotePremium(step.items, scenario.customer.yearsWithMHPCO, quoteCount++) };
    }
    const policy = scenario.steps[step.policy] as QuoteStep;
    if (step.incident.damages.some(damage => damage.amount < 0)) throw new Error("Negative damage amount");
    const remainingItems = [...policy.items];
    const rawPayout = step.incident.damages.reduce((sum, damage) => {
      const itemIndex = remainingItems.findIndex(item => item.type === damage.itemType);
      if (itemIndex < 0) throw new Error(`Damaged item is not covered: ${damage.itemType}`);
      const item = remainingItems.splice(itemIndex, 1)[0];
      const reimbursable = (item.enchantment ?? 0) >= CLAIM_RULES.highEnchantmentLevel ? damage.amount / CLAIM_RULES.highEnchantmentDivisor : damage.amount;
      return sum + Math.max(0, reimbursable - CLAIM_RULES.deductible);
    }, 0);
    const remainingCap = remainingCapsByPolicyStep.get(step.policy) ?? 0;
    const payout = Math.floor(Math.min(rawPayout, remainingCap));
    remainingCapsByPolicyStep.set(step.policy, remainingCap - payout);
    return { payout, remainingCap: remainingCap - payout };
  });
  return { results };
}
