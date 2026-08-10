export interface ScenarioResult { results: unknown[] }

interface Item { type: string; cursed?: boolean; enchantment?: number; material?: string }
interface QuoteStep { op: "quote"; items: Item[] }
interface Damage { itemType: string; amount: number }
interface ClaimStep { op: "claim"; policy: number; incident: { cause: string; damages: Damage[] } }
type Step = QuoteStep | ClaimStep;
interface Scenario { customer: { yearsWithMHPCO: number }; steps: Step[] }

const BASE_PREMIUMS: Record<string, number> = { sword: 100, amulet: 60, staff: 80, potion: 40, rune: 25, moonstone: 25 };
const INSURANCE_VALUES: Record<string, number> = { sword: 1000, amulet: 600, staff: 800, potion: 400, rune: 250, moonstone: 250 };
const POLICY_CAP_MULTIPLIER = 2;
const CLAIM_ENCHANTMENT_THRESHOLD = 8;
const CLAIM_ENCHANTMENT_RATE = 0.5;
const DEDUCTIBLE = 100;
const COMPONENT_TYPES = new Set(["rune", "moonstone"]);
const EXACT_COMPONENT_COUNT_PREMIUMS: Record<number, number> = { 3: 60 };
const CURSE_SURCHARGE_RATE = 0.5;
const QUOTE_ENCHANTMENT_THRESHOLD = 5;
const ENCHANTMENT_SURCHARGE_RATE = 0.3;
const LOYALTY_YEARS_THRESHOLD = 2;
const LOYALTY_DISCOUNT_RATE = 0.2;
const FOLLOW_UP_DISCOUNT_RATE = 0.15;
const FIRST_QUOTE_PERCENT = 110;
const RATE_SCALE = 100;
const PROCESSING_FEE_SCALED = 500;

function processClaim(
  step: ClaimStep,
  stepIndex: number,
  scenario: Scenario,
  remainingCapsByPolicyStep: Map<number, number>,
) {
  const referencedStep = scenario.steps[step.policy];
  if (step.policy >= stepIndex || referencedStep?.op !== "quote") {
    throw new Error("Claim policy must reference an earlier quote");
  }
  const policyQuote = referencedStep;
  const initialPolicyCap = policyQuote.items.reduce(
    (total, insuredItem) => total + INSURANCE_VALUES[insuredItem.type] * POLICY_CAP_MULTIPLIER, 0);
  const unclaimedInsuredItems = [...policyQuote.items];
  const payout = step.incident.damages.reduce((total, damage) => {
    if (damage.amount < 0) throw new Error("Negative damage amount");
    const itemIndex = unclaimedInsuredItems.findIndex(({ type }) => type === damage.itemType);
    if (itemIndex < 0) throw new Error(`Item ${damage.itemType} is not covered`);
    const [claimedItem] = unclaimedInsuredItems.splice(itemIndex, 1);
    const clauseAdjustedDamage = (claimedItem.enchantment ?? 0) >= CLAIM_ENCHANTMENT_THRESHOLD
      ? damage.amount * CLAIM_ENCHANTMENT_RATE
      : damage.amount;
    return total + Math.max(0, clauseAdjustedDamage - DEDUCTIBLE);
  }, 0);
  const availableCap = remainingCapsByPolicyStep.get(step.policy) ?? initialPolicyCap;
  const finalPayout = Math.floor(Math.min(payout, availableCap));
  const remainingCap = availableCap - finalPayout;
  remainingCapsByPolicyStep.set(step.policy, remainingCap);
  return { payout: finalPayout, remainingCap };
}

function calculateQuote(step: QuoteStep, stepIndex: number, scenario: Scenario) {
  const itemCounts = step.items.reduce<Record<string, number>>((counts, insuredItem) => {
    counts[insuredItem.type] = (counts[insuredItem.type] ?? 0) + 1;
    return counts;
  }, {});
  const policyBasePremium = Object.entries(itemCounts).reduce((total, [itemType, count]) => {
    if (!(itemType in BASE_PREMIUMS)) throw new Error(`Unknown item type: ${itemType}`);
    return total + (COMPONENT_TYPES.has(itemType)
      ? EXACT_COMPONENT_COUNT_PREMIUMS[count] ?? BASE_PREMIUMS[itemType] * count
      : BASE_PREMIUMS[itemType] * count);
  }, 0);
  const itemSurcharges = step.items.reduce((total, insuredItem) => {
    const basePremium = BASE_PREMIUMS[insuredItem.type];
    return total + (insuredItem.cursed ? basePremium * CURSE_SURCHARGE_RATE : 0)
      + ((insuredItem.enchantment ?? 0) >= QUOTE_ENCHANTMENT_THRESHOLD ? basePremium * ENCHANTMENT_SURCHARGE_RATE : 0);
  }, 0);
  const loyaltyDiscount = scenario.customer.yearsWithMHPCO >= LOYALTY_YEARS_THRESHOLD
    ? policyBasePremium * LOYALTY_DISCOUNT_RATE
    : 0;
  const hasPreviousQuote = scenario.steps.slice(0, stepIndex).some(({ op }) => op === "quote");
  const followUpDiscount = hasPreviousQuote ? policyBasePremium * FOLLOW_UP_DISCOUNT_RATE : 0;
  return { premium: Math.ceil((policyBasePremium * FIRST_QUOTE_PERCENT
    + itemSurcharges * RATE_SCALE
    - loyaltyDiscount * RATE_SCALE
    - followUpDiscount * RATE_SCALE
    + PROCESSING_FEE_SCALED) / RATE_SCALE) };
}

export function runScenario(input: unknown): ScenarioResult {
  const scenario = input as Scenario;
  const remainingCapsByPolicyStep = new Map<number, number>();
  return { results: scenario.steps.map((step, stepIndex) => step.op === "claim"
    ? processClaim(step, stepIndex, scenario, remainingCapsByPolicyStep)
    : calculateQuote(step, stepIndex, scenario)) };
}
