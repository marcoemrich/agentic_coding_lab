export interface Customer {
  yearsWithMHPCO: number;
}

export interface Item {
  type: string;
  material?: string;
  enchantment?: number;
  cursed?: boolean;
}

export interface QuoteStep {
  op: "quote";
  items: Item[];
}

export interface Damage {
  itemType: string;
  amount: number;
}

export interface Incident {
  cause: string;
  damages: Damage[];
}

export interface ClaimStep {
  op: "claim";
  policy: number;
  incident: Incident;
}

export type Step = QuoteStep | ClaimStep;

export interface Scenario {
  customer: Customer;
  steps: Step[];
}

export interface QuoteResult {
  premium: number;
}

export interface ClaimResult {
  payout: number;
  remainingCap: number;
}

export type StepResult = QuoteResult | ClaimResult;

export interface ScenarioOutput {
  results: StepResult[];
}

const PROCESSING_FEE = 5;
const BLOCK_SIZE = 3;
const COMPONENT_BLOCK_PRICE = 60;
const DEDUCTIBLE = 100;
const CAP_MULTIPLIER = 2;
const HIGH_ENCHANTMENT_CLAIM_THRESHOLD = 8;
const HIGH_ENCHANTMENT_CLAIM_RATE = 0.5;
const CURSED_SURCHARGE_RATE = 0.5;
const HIGH_ENCHANTMENT_RATE = 0.3;
const HIGH_ENCHANTMENT_THRESHOLD = 5;
const FIRST_INSURANCE_RATE = 0.1;
const LOYALTY_DISCOUNT_RATE = 0.2;
const LOYALTY_YEARS_THRESHOLD = 2;
const FOLLOWUP_DISCOUNT_RATE = 0.15;
const BASE_PREMIUM_BY_TYPE: Record<string, number> = {
  sword: 100,
  amulet: 60,
  staff: 80,
  potion: 40,
  rune: 25,
  moonstone: 25,
};

const INSURANCE_VALUE_BY_TYPE: Record<string, number> = {
  sword: 1000,
  amulet: 600,
  staff: 800,
  potion: 400,
  rune: 250,
  moonstone: 250,
};

const KNOWN_ITEM_TYPES = new Set(Object.keys(BASE_PREMIUM_BY_TYPE));

const insuranceValue = (item: Item): number =>
  INSURANCE_VALUE_BY_TYPE[item.type] ?? 0;

const insuranceSum = (items: Item[]): number =>
  items.reduce((sum, item) => sum + insuranceValue(item), 0);

const basePremium = (item: Item): number =>
  BASE_PREMIUM_BY_TYPE[item.type] ?? 0;

const COMPONENT_TYPES = new Set(["rune", "moonstone"]);

const groupByType = (items: Item[]): Map<string, Item[]> => {
  const groups = new Map<string, Item[]>();
  for (const item of items) {
    const existing = groups.get(item.type) ?? [];
    existing.push(item);
    groups.set(item.type, existing);
  }
  return groups;
};

const sumBasePremiums = (items: Item[]): number =>
  items.reduce((sum, item) => sum + basePremium(item), 0);

const isCompleteComponentBlock = (type: string, group: Item[]): boolean =>
  group.length === BLOCK_SIZE && COMPONENT_TYPES.has(type);

const groupTotal = (type: string, group: Item[]): number =>
  isCompleteComponentBlock(type, group)
    ? COMPONENT_BLOCK_PRICE
    : sumBasePremiums(group);

const policyBase = (items: Item[]): number =>
  Array.from(groupByType(items)).reduce(
    (sum, [type, group]) => sum + groupTotal(type, group),
    0,
  );

const perItemSurcharge = (
  items: Item[],
  predicate: (item: Item) => boolean,
  rate: number,
): number =>
  items
    .filter(predicate)
    .reduce((sum, item) => sum + basePremium(item) * rate, 0);

const isCursed = (item: Item): boolean => item.cursed === true;

const enchantmentLevel = (item: Item): number => item.enchantment ?? 0;

const isHighlyEnchanted = (item: Item): boolean =>
  enchantmentLevel(item) >= HIGH_ENCHANTMENT_THRESHOLD;

const firstInsuranceSurcharge = (base: number): number =>
  base * FIRST_INSURANCE_RATE;

const loyaltyDiscount = (base: number, customer: Customer): number =>
  customer.yearsWithMHPCO >= LOYALTY_YEARS_THRESHOLD
    ? base * LOYALTY_DISCOUNT_RATE
    : 0;

const followupDiscount = (base: number, quoteIndex: number): number =>
  quoteIndex > 0 ? base * FOLLOWUP_DISCOUNT_RATE : 0;

const totalSurcharges = (items: Item[], base: number): number =>
  perItemSurcharge(items, isCursed, CURSED_SURCHARGE_RATE) +
  perItemSurcharge(items, isHighlyEnchanted, HIGH_ENCHANTMENT_RATE) +
  firstInsuranceSurcharge(base);

const totalDiscounts = (
  base: number,
  customer: Customer,
  quoteIndex: number,
): number =>
  loyaltyDiscount(base, customer) + followupDiscount(base, quoteIndex);

const quotePremium = (
  items: Item[],
  customer: Customer,
  quoteIndex: number,
): number => {
  const base = policyBase(items);
  const adjusted =
    base +
    totalSurcharges(items, base) -
    totalDiscounts(base, customer, quoteIndex);
  return Math.ceil(adjusted) + PROCESSING_FEE;
};

interface Policy {
  items: Item[];
  remainingCap: number;
}

interface ScenarioState {
  customer: Customer;
  policies: Map<number, Policy>;
  quoteIndex: number;
}

const validateItemTypes = (items: Item[]): void => {
  for (const item of items) {
    if (!KNOWN_ITEM_TYPES.has(item.type)) {
      throw new Error(`unknown item type: ${item.type}`);
    }
  }
};

const processQuote = (
  step: QuoteStep,
  state: ScenarioState,
  policyId: number,
): QuoteResult => {
  validateItemTypes(step.items);
  state.policies.set(policyId, {
    items: step.items,
    remainingCap: insuranceSum(step.items) * CAP_MULTIPLIER,
  });
  const premium = quotePremium(step.items, state.customer, state.quoteIndex);
  state.quoteIndex += 1;
  return { premium };
};

const reimbursementRate = (item: Item): number =>
  enchantmentLevel(item) >= HIGH_ENCHANTMENT_CLAIM_THRESHOLD
    ? HIGH_ENCHANTMENT_CLAIM_RATE
    : 1;

const damagePayout = (damage: Damage, items: Item[]): number => {
  const item = items.find((it) => it.type === damage.itemType) as Item;
  return damage.amount * reimbursementRate(item) - DEDUCTIBLE;
};

const countBy = <T>(items: T[], key: (item: T) => string): Map<string, number> => {
  const counts = new Map<string, number>();
  for (const item of items) {
    const k = key(item);
    counts.set(k, (counts.get(k) ?? 0) + 1);
  }
  return counts;
};

const validateNonNegativeAmounts = (damages: Damage[]): void => {
  for (const damage of damages) {
    if (damage.amount < 0) {
      throw new Error(`claim damage amount must be non-negative`);
    }
  }
};

const validateCoverage = (damages: Damage[], items: Item[]): void => {
  const itemCounts = countBy(items, (item) => item.type);
  const damageCounts = countBy(damages, (damage) => damage.itemType);
  for (const [type, count] of damageCounts) {
    if (count > (itemCounts.get(type) ?? 0)) {
      throw new Error(
        `claim damages exceed policy coverage for itemType ${type}`,
      );
    }
  }
};

const sumDamagePayouts = (damages: Damage[], items: Item[]): number =>
  damages.reduce((sum, damage) => sum + damagePayout(damage, items), 0);

const processClaim = (step: ClaimStep, state: ScenarioState): ClaimResult => {
  const policy = state.policies.get(step.policy) as Policy;
  const { damages } = step.incident;
  validateNonNegativeAmounts(damages);
  validateCoverage(damages, policy.items);
  const rawPayout = sumDamagePayouts(damages, policy.items);
  const payout = Math.floor(Math.min(rawPayout, policy.remainingCap));
  policy.remainingCap -= payout;
  return { payout, remainingCap: policy.remainingCap };
};

const processStep = (
  step: Step,
  state: ScenarioState,
  stepIndex: number,
): StepResult =>
  step.op === "quote"
    ? processQuote(step, state, stepIndex)
    : processClaim(step, state);

export const processScenario = (scenario: Scenario): ScenarioOutput => {
  const state: ScenarioState = {
    customer: scenario.customer,
    policies: new Map<number, Policy>(),
    quoteIndex: 0,
  };
  const results: StepResult[] = scenario.steps.map((step, stepIndex) =>
    processStep(step, state, stepIndex),
  );
  return { results };
};
