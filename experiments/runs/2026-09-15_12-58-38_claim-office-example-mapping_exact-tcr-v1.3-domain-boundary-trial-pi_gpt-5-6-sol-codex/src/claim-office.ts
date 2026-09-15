export interface Item {
  type: string;
  material?: string;
  enchantment?: number;
  cursed?: boolean;
}

const INSURANCE_VALUE: Record<string, number> = {
  sword: 1000, amulet: 600, staff: 800, potion: 400, rune: 250, moonstone: 250,
};
const BASE_PREMIUM: Record<string, number> = {
  sword: 100, amulet: 60, staff: 80, potion: 40, rune: 25, moonstone: 25,
};
const COMPONENT_TYPES = ["rune", "moonstone"];
const BLOCK_SIZE = 3;
const BLOCK_DISCOUNT = 15;
const CURSE_SURCHARGE_RATE = 0.5;
const PREMIUM_ENCHANTMENT_THRESHOLD = 5;
const ENCHANTMENT_SURCHARGE_RATE = 0.3;
const CLAIM_ENCHANTMENT_THRESHOLD = 8;
const REDUCED_REIMBURSEMENT_RATE = 0.5;
const DEDUCTIBLE = 100;
const CAP_MULTIPLIER = 2;
const LOYALTY_YEARS = 2;
const LOYALTY_DISCOUNT_RATE = 0.2;
const FOLLOW_UP_DISCOUNT_RATE = 0.15;
const INITIAL_ASSESSMENT_RATE = 0.1;
const PROCESSING_FEE = 5;

export function calculateInsuranceSum(items: Item[]): number {
  return items.reduce((total, item) => total + INSURANCE_VALUE[item.type], 0);
}

function exactAlikeComponentBlockDiscount(items: Item[]): number {
  const blocks = COMPONENT_TYPES.filter(
    (type) => items.filter((item) => item.type === type).length === BLOCK_SIZE,
  ).length;
  return blocks * BLOCK_DISCOUNT;
}

export function calculateBasePremium(items: Item[]): number {
  const unitTotal = items.reduce((total, item) => total + BASE_PREMIUM[item.type], 0);
  return unitTotal - exactAlikeComponentBlockDiscount(items);
}

function surcharge(items: Item[], applies: (item: Item) => boolean, rate: number): number {
  return items
    .filter(applies)
    .reduce((total, item) => total + BASE_PREMIUM[item.type] * rate, 0);
}

export function calculateItemAdjustedPremium(items: Item[]): number {
  const curse = surcharge(items, (item) => item.cursed === true, CURSE_SURCHARGE_RATE);
  const enchantment = surcharge(
    items,
    (item) => (item.enchantment ?? 0) >= PREMIUM_ENCHANTMENT_THRESHOLD,
    ENCHANTMENT_SURCHARGE_RATE,
  );
  return calculateBasePremium(items) + curse + enchantment;
}

export interface Damage {
  itemType: string;
  amount: number;
}

export interface ClaimResult {
  payout: number;
  remainingCap: number;
}

function damageEventPayout(item: Item, damage: Damage): number {
  if (damage.amount < 0) throw new Error("Damage amount must not be negative");
  const rate = (item.enchantment ?? 0) >= CLAIM_ENCHANTMENT_THRESHOLD
    ? REDUCED_REIMBURSEMENT_RATE
    : 1;
  return Math.max(0, damage.amount * rate - DEDUCTIBLE);
}

export function processClaim(items: Item[], damages: Damage[], remainingCap: number): ClaimResult {
  const unmatchedItems = [...items];
  const desired = damages.reduce((total, damage) => {
    const itemIndex = unmatchedItems.findIndex((item) => item.type === damage.itemType);
    if (itemIndex < 0) throw new Error(`Damage item is not insured: ${damage.itemType}`);
    const [item] = unmatchedItems.splice(itemIndex, 1);
    return total + damageEventPayout(item, damage);
  }, 0);
  const payout = Math.floor(Math.min(desired, remainingCap));
  return { payout, remainingCap: remainingCap - payout };
}

export interface QuoteStep {
  op: "quote";
  items: Item[];
}

export interface ClaimStep {
  op: "claim";
  policy: number;
  incident: { cause: string; damages: Damage[] };
}

export interface Scenario {
  customer: { yearsWithMHPCO: number };
  steps: Array<QuoteStep | ClaimStep>;
}

type Policy = { items: Item[]; remainingCap: number };
type StepResult = { premium: number } | ClaimResult;
type ScenarioContext = { yearsWithMHPCO: number; policies: Map<number, Policy> };

function processQuote(
  step: QuoteStep,
  stepIndex: number,
  context: ScenarioContext,
): { premium: number } {
  step.items.forEach((item) => {
    if (!(item.type in BASE_PREMIUM)) throw new Error(`Unknown item type: ${item.type}`);
  });
  const premium = calculatePremium(step.items, context.yearsWithMHPCO, context.policies.size);
  const remainingCap = calculateInsuranceSum(step.items) * CAP_MULTIPLIER;
  context.policies.set(stepIndex, { items: step.items, remainingCap });
  return { premium };
}

function processPolicyClaim(step: ClaimStep, policies: Map<number, Policy>): ClaimResult {
  const policy = policies.get(step.policy);
  if (!policy) throw new Error(`Unknown policy: ${step.policy}`);
  const result = processClaim(policy.items, step.incident.damages, policy.remainingCap);
  policy.remainingCap = result.remainingCap;
  return result;
}

export function runScenario(scenario: Scenario): { results: StepResult[] } {
  const policies = new Map<number, Policy>();
  const context = { yearsWithMHPCO: scenario.customer.yearsWithMHPCO, policies };
  const results = scenario.steps.map((step, stepIndex) => step.op === "quote"
    ? processQuote(step, stepIndex, context)
    : processPolicyClaim(step, policies));
  return { results };
}

export function calculatePremium(
  items: Item[],
  yearsWithMHPCO: number,
  previousContracts: number,
): number {
  const base = calculateBasePremium(items);
  const loyalty = yearsWithMHPCO >= LOYALTY_YEARS ? base * LOYALTY_DISCOUNT_RATE : 0;
  const followUp = previousContracts > 0 ? base * FOLLOW_UP_DISCOUNT_RATE : 0;
  const initialAssessment = base * INITIAL_ASSESSMENT_RATE;
  return Math.ceil(calculateItemAdjustedPremium(items) + initialAssessment - loyalty - followUp + PROCESSING_FEE);
}
