export interface Item {
  type: string;
  cursed?: boolean;
  enchantment?: number;
  material?: string;
}

export interface Damage { itemType: string; amount: number }
export interface Step {
  op: string;
  items?: Item[];
  policy?: number;
  incident?: { cause: string; damages: Damage[] };
}
export interface Scenario { customer: { yearsWithMHPCO: number }; steps: Step[] }
export interface OperationResult { premium?: number; payout?: number; remainingCap?: number }
export interface ScenarioResult { results: OperationResult[] }

const BASE_PREMIUM: Readonly<Record<string, number>> = { sword: 100, amulet: 60, staff: 80, potion: 40, rune: 25, moonstone: 25 };
const INSURANCE_VALUE: Readonly<Record<string, number>> = { sword: 1000, amulet: 600, staff: 800, potion: 400, rune: 250, moonstone: 250 };
const BLOCK_ITEM_COUNT = 3;
const BLOCK_PREMIUM = 60;
const CURSE_SURCHARGE_RATE = 0.5;
const ENCHANTMENT_SURCHARGE_THRESHOLD = 5;
const ENCHANTMENT_SURCHARGE_RATE = 0.3;
const LOYALTY_YEARS_THRESHOLD = 2;
const LOYALTY_DISCOUNT_RATE = 0.2;
const FOLLOW_UP_DISCOUNT_RATE = 0.15;
const ASSESSMENT_FEE = 5;
const ASSESSMENT_RATE = 0.1;
const POLICY_CAP_MULTIPLIER = 2;
const HALF_REIMBURSEMENT_ENCHANTMENT = 8;
const HALF_REIMBURSEMENT_RATE = 0.5;
const DAMAGE_DEDUCTIBLE = 100;

function calculatePremium(scenario: Scenario, step: Step, stepIndex: number): number {
  const counts = step.items?.reduce<Record<string, number>>((result, item) => {
    result[item.type] = (result[item.type] ?? 0) + 1;
    return result;
  }, {}) ?? {};
  const basePremium = Object.entries(counts).reduce((sum, [type, count]) =>
    sum + (count === BLOCK_ITEM_COUNT && (type === "rune" || type === "moonstone") ? BLOCK_PREMIUM : BASE_PREMIUM[type] * count), 0);
  const itemSurcharges = step.items?.reduce((sum, item) => sum
    + (item.cursed ? BASE_PREMIUM[item.type] * CURSE_SURCHARGE_RATE : 0)
    + ((item.enchantment ?? 0) >= ENCHANTMENT_SURCHARGE_THRESHOLD ? BASE_PREMIUM[item.type] * ENCHANTMENT_SURCHARGE_RATE : 0), 0) ?? 0;
  const loyaltyDiscount = scenario.customer.yearsWithMHPCO >= LOYALTY_YEARS_THRESHOLD ? basePremium * LOYALTY_DISCOUNT_RATE : 0;
  const followUpDiscount = scenario.steps.slice(0, stepIndex).some((previous) => previous.op === "quote") ? basePremium * FOLLOW_UP_DISCOUNT_RATE : 0;
  return Math.ceil(ASSESSMENT_FEE + basePremium + basePremium * ASSESSMENT_RATE + itemSurcharges - loyaltyDiscount - followUpDiscount);
}

function processClaim(step: Step, policyItems: Item[], availablePolicyCap: number): OperationResult {
  if (step.incident?.damages.some((damage) => damage.amount < 0)) throw new Error("Damage amount cannot be negative");
  const damageCounts = step.incident?.damages.reduce<Record<string, number>>((counts, damage) => {
    counts[damage.itemType] = (counts[damage.itemType] ?? 0) + 1;
    return counts;
  }, {}) ?? {};
  for (const [type, count] of Object.entries(damageCounts)) {
    if (count > policyItems.filter((item) => item.type === type).length) throw new Error(`Item ${type} is not insured`);
  }
  const reimbursementAfterDeductibles = step.incident?.damages.reduce((sum, damage) => {
    const insuredItem = policyItems.find((item) => item.type === damage.itemType);
    const reimbursable = (insuredItem?.enchantment ?? 0) >= HALF_REIMBURSEMENT_ENCHANTMENT
      ? damage.amount * HALF_REIMBURSEMENT_RATE
      : damage.amount;
    return sum + Math.max(0, reimbursable - DAMAGE_DEDUCTIBLE);
  }, 0) ?? 0;
  const payout = Math.min(Math.floor(reimbursementAfterDeductibles), availablePolicyCap);
  return { payout, remainingCap: availablePolicyCap - payout };
}

export function processScenario(scenario: Scenario): ScenarioResult {
  for (const item of scenario.steps.flatMap((step) => step.items ?? [])) {
    if (!(item.type in BASE_PREMIUM)) throw new Error(`Unknown item type: ${item.type}`);
  }
  const remainingCaps = new Map<number, number>();
  return {
    results: scenario.steps.map((step, stepIndex) => {
      if (step.op === "quote") {
        const cap = POLICY_CAP_MULTIPLIER * (step.items?.reduce((sum, item) => sum + INSURANCE_VALUE[item.type], 0) ?? 0);
        remainingCaps.set(stepIndex, cap);
        return { premium: calculatePremium(scenario, step, stepIndex) };
      }
      const policyIndex = step.policy ?? -1;
      const policyItems = scenario.steps[policyIndex]?.items ?? [];
      const result = processClaim(step, policyItems, remainingCaps.get(policyIndex) ?? 0);
      remainingCaps.set(policyIndex, result.remainingCap ?? 0);
      return result;
    }),
  };
}
