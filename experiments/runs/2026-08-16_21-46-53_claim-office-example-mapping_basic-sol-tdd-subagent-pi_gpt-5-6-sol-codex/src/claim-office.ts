export interface Scenario {
  customer: { yearsWithMHPCO: number };
  steps: Array<Record<string, unknown>>;
}

export interface ScenarioResult {
  results: Array<Record<string, number>>;
}

type Item = { type: string; cursed?: boolean; enchantment?: number; material?: string };
type QuoteStep = { op: "quote"; items: Item[] };
type Damage = { itemType: string; amount: number };
type ClaimStep = { op: "claim"; policy: number; incident: { cause: string; damages: Damage[] } };
type Step = QuoteStep | ClaimStep;
type Policy = { items: Item[]; remainingCap: number };

const BASE_PREMIUM: Record<string, number> = { sword: 100, amulet: 60, staff: 80, potion: 40 };
const INSURANCE_VALUE: Record<string, number> = { sword: 1000, amulet: 600, staff: 800, potion: 400, rune: 250, moonstone: 250 };
const CURSE_RATE = 0.5;
const HIGH_ENCHANTMENT_LEVEL = 5;
const ENCHANTMENT_RATE = 0.3;
const LOYAL_CUSTOMER_YEARS = 2;
const LOYALTY_RATE = 0.2;
const INITIAL_ASSESSMENT_RATE = 0.1;
const FOLLOW_UP_DISCOUNT_RATE = 0.15;
const PROCESSING_FEE = 5;
const COMPONENT_PREMIUM = 25;
const EXACT_COMPONENT_BUNDLE_SIZE = 3;
const EXACT_COMPONENT_BUNDLE_PREMIUM = 60;
const CAP_MULTIPLIER = 2;
const REDUCED_REIMBURSEMENT_ENCHANTMENT_LEVEL = 8;
const HIGH_ENCHANTMENT_REIMBURSEMENT_RATE = 0.5;
const DEDUCTIBLE = 100;

function itemBasePremium(item: Item): number {
  return BASE_PREMIUM[item.type] ?? 0;
}

function componentPremium(items: Item[]): number {
  const componentCountsByType = new Map<string, number>();
  for (const item of items.filter(({ type }) => type === "rune" || type === "moonstone")) {
    componentCountsByType.set(item.type, (componentCountsByType.get(item.type) ?? 0) + 1);
  }
  return [...componentCountsByType.values()].reduce(
    (sum, count) => sum + (count === EXACT_COMPONENT_BUNDLE_SIZE ? EXACT_COMPONENT_BUNDLE_PREMIUM : count * COMPONENT_PREMIUM), 0,
  );
}

function quote(step: QuoteStep, yearsWithMHPCO: number, hasExistingPolicy: boolean): Record<string, number> {
  const mainItemPremium = step.items.reduce((sum, item) => sum + itemBasePremium(item), 0);
  const basePremium = mainItemPremium + componentPremium(step.items);
  const curseSurcharge = step.items.reduce((sum, item) => sum + (item.cursed ? itemBasePremium(item) * CURSE_RATE : 0), 0);
  const enchantmentSurcharge = step.items.reduce(
    (sum, item) => sum + ((item.enchantment ?? 0) >= HIGH_ENCHANTMENT_LEVEL ? itemBasePremium(item) * ENCHANTMENT_RATE : 0), 0,
  );
  const loyaltyDiscount = yearsWithMHPCO >= LOYAL_CUSTOMER_YEARS ? basePremium * LOYALTY_RATE : 0;
  const initialAssessment = basePremium * INITIAL_ASSESSMENT_RATE;
  const followUpDiscount = hasExistingPolicy ? basePremium * FOLLOW_UP_DISCOUNT_RATE : 0;
  const premium = basePremium + curseSurcharge + enchantmentSurcharge - loyaltyDiscount + initialAssessment - followUpDiscount + PROCESSING_FEE;
  return { premium: Math.ceil(premium) };
}

function validateKnownItemTypes(items: Item[]): void {
  for (const item of items) {
    if (!(item.type in INSURANCE_VALUE)) throw new Error(`Unknown item type: ${item.type}`);
  }
}

function createPolicy(items: Item[]): Policy {
  const totalInsuranceValue = items.reduce((sum, item) => sum + (INSURANCE_VALUE[item.type] ?? 0), 0);
  return { items, remainingCap: totalInsuranceValue * CAP_MULTIPLIER };
}

function reimbursementFor(item: Item, damage: Damage): number {
  const reimbursementRate = (item.enchantment ?? 0) >= REDUCED_REIMBURSEMENT_ENCHANTMENT_LEVEL
    ? HIGH_ENCHANTMENT_REIMBURSEMENT_RATE
    : 1;
  return Math.max(0, damage.amount * reimbursementRate - DEDUCTIBLE);
}

function claim(step: ClaimStep, policy: Policy): Record<string, number> {
  const unmatchedItems = [...policy.items];
  let accumulatedReimbursement = 0;
  for (const damage of step.incident.damages) {
    if (damage.amount < 0) throw new Error(`Damage amount cannot be negative: ${damage.amount}`);
    const itemIndex = unmatchedItems.findIndex(({ type }) => type === damage.itemType);
    if (itemIndex < 0) throw new Error(`Damage item is not covered by policy: ${damage.itemType}`);
    const [item] = unmatchedItems.splice(itemIndex, 1);
    accumulatedReimbursement += reimbursementFor(item, damage);
  }
  const payout = Math.floor(Math.min(accumulatedReimbursement, policy.remainingCap));
  policy.remainingCap -= payout;
  return { payout, remainingCap: policy.remainingCap };
}

export function executeScenario(scenario: Scenario): ScenarioResult {
  const policies = new Map<number, Policy>();
  const results: Array<Record<string, number>> = [];
  (scenario.steps as Step[]).forEach((step, index) => {
    if (step.op === "quote") {
      validateKnownItemTypes(step.items);
      results.push(quote(step, scenario.customer.yearsWithMHPCO, policies.size > 0));
      policies.set(index, createPolicy(step.items));
    } else {
      results.push(claim(step, policies.get(step.policy)!));
    }
  });
  return { results };
}
