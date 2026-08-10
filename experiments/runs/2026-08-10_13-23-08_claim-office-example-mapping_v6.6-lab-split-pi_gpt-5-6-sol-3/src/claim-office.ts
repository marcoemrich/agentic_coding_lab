export interface Item {
  type: string;
  material?: string;
  enchantment?: number;
  cursed?: boolean;
}

interface Customer { yearsWithMHPCO: number }
interface QuoteStep { op: "quote"; items: Item[] }
interface ClaimStep {
  op: "claim";
  policy: number;
  incident: { cause: string; damages: Array<{ itemType: string; amount: number }> };
}
export interface Scenario { customer: Customer; steps: Array<QuoteStep | ClaimStep> }
export interface OperationResult { premium?: number; payout?: number; remainingCap?: number }
export type ScenarioResult = { results: OperationResult[] };

type Policy = { items: Item[]; remainingCap: number };

const PROCESSING_FEE = 5;
const EXACT_COMPONENT_BUNDLE_SIZE = 3;
const COMPONENT_BUNDLE_DISCOUNT = 15;
const CURSE_SURCHARGE_RATE = 0.5;
const ENCHANTMENT_SURCHARGE_THRESHOLD = 5;
const ENCHANTMENT_SURCHARGE_RATE = 0.3;
const LOYALTY_YEARS_THRESHOLD = 2;
const LOYALTY_DISCOUNT_RATE = 0.2;
const FOLLOW_UP_DISCOUNT_RATE = 0.15;
const INITIAL_ASSESSMENT_RATE = 0.1;
const POLICY_CAP_MULTIPLIER = 2;
const CLAIM_ENCHANTMENT_THRESHOLD = 8;
const CLAIM_ENCHANTMENT_DAMAGE_RATE = 0.5;
const DAMAGE_DEDUCTIBLE = 100;
const BASE_PREMIUM_BY_ITEM_TYPE: Readonly<Record<string, number>> = {
  sword: 100, amulet: 60, staff: 80, potion: 40, rune: 25, moonstone: 25,
};
const INSURANCE_VALUE_BY_ITEM_TYPE: Readonly<Record<string, number>> = {
  sword: 1000, amulet: 600, staff: 800, potion: 400, rune: 250, moonstone: 250,
};

export function calculateBasePremium(items: Array<{ type: string }>): number {
  const priceListTotal = items.reduce(
    (total, item) => total + BASE_PREMIUM_BY_ITEM_TYPE[item.type], 0,
  );
  const exactTripleComponentDiscount = ["rune", "moonstone"].reduce(
    (discount, type) => discount + (
      items.filter((item) => item.type === type).length === EXACT_COMPONENT_BUNDLE_SIZE
        ? COMPONENT_BUNDLE_DISCOUNT
        : 0
    ), 0,
  );
  return priceListTotal - exactTripleComponentDiscount;
}

function calculateQuotePremium(items: Item[], yearsWithMHPCO: number, isFollowUpContract: boolean): number {
  const basePremium = calculateBasePremium(items);
  const itemSurcharges = items.reduce((total, item) => {
    const itemBase = BASE_PREMIUM_BY_ITEM_TYPE[item.type];
    return total + (item.cursed ? itemBase * CURSE_SURCHARGE_RATE : 0)
      + ((item.enchantment ?? 0) >= ENCHANTMENT_SURCHARGE_THRESHOLD
        ? itemBase * ENCHANTMENT_SURCHARGE_RATE
        : 0);
  }, 0);
  const loyaltyDiscount = yearsWithMHPCO >= LOYALTY_YEARS_THRESHOLD
    ? basePremium * LOYALTY_DISCOUNT_RATE
    : 0;
  const followUpDiscount = isFollowUpContract ? basePremium * FOLLOW_UP_DISCOUNT_RATE : 0;
  return Math.ceil(basePremium + itemSurcharges + basePremium * INITIAL_ASSESSMENT_RATE
    - loyaltyDiscount - followUpDiscount + PROCESSING_FEE);
}

function issuePolicy(
  step: QuoteStep,
  stepIndex: number,
  yearsWithMHPCO: number,
  issuedPoliciesByQuoteStep: Map<number, Policy>,
): OperationResult {
  for (const item of step.items) {
    if (!(item.type in BASE_PREMIUM_BY_ITEM_TYPE)) {
      throw new Error(`Unknown item type: ${item.type}`);
    }
  }
  const premium = calculateQuotePremium(
    step.items, yearsWithMHPCO, issuedPoliciesByQuoteStep.size > 0,
  );
  const insuranceSum = step.items.reduce(
    (sum, item) => sum + INSURANCE_VALUE_BY_ITEM_TYPE[item.type], 0,
  );
  issuedPoliciesByQuoteStep.set(stepIndex, {
    items: step.items,
    remainingCap: insuranceSum * POLICY_CAP_MULTIPLIER,
  });
  return { premium };
}

function calculateUncappedPayout(step: ClaimStep, policyItems: Item[]): number {
  const unmatchedPolicyItems = [...policyItems];
  return step.incident.damages.reduce((sum, damage) => {
    if (damage.amount < 0) throw new Error("Damage amount cannot be negative");
    const itemIndex = unmatchedPolicyItems.findIndex((item) => item.type === damage.itemType);
    if (itemIndex < 0) {
      throw new Error(`Damage item is not covered by policy: ${damage.itemType}`);
    }
    const [item] = unmatchedPolicyItems.splice(itemIndex, 1);
    const adjustedDamageAmount = (item.enchantment ?? 0) >= CLAIM_ENCHANTMENT_THRESHOLD
      ? damage.amount * CLAIM_ENCHANTMENT_DAMAGE_RATE
      : damage.amount;
    return sum + Math.max(0, adjustedDamageAmount - DAMAGE_DEDUCTIBLE);
  }, 0);
}

function settleClaim(step: ClaimStep, policy: Policy): OperationResult {
  const uncappedPayout = calculateUncappedPayout(step, policy.items);
  const payout = Math.floor(Math.min(uncappedPayout, policy.remainingCap));
  policy.remainingCap -= payout;
  return { payout, remainingCap: policy.remainingCap };
}

export function runScenario(input: unknown): ScenarioResult {
  const scenario = input as Scenario;
  const issuedPoliciesByQuoteStep = new Map<number, Policy>();
  const results = scenario.steps.map((step, stepIndex) => step.op === "quote"
    ? issuePolicy(step, stepIndex, scenario.customer.yearsWithMHPCO, issuedPoliciesByQuoteStep)
    : settleClaim(step, issuedPoliciesByQuoteStep.get(step.policy)!));
  return { results };
}
