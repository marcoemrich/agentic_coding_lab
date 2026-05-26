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

// Premium constants
const PROCESSING_FEE = 5;
const FIRST_INSURANCE_RATE = 0.1;
const CURSE_SURCHARGE_RATE = 0.5;
const ENCHANTMENT_SURCHARGE_RATE = 0.3;
const ENCHANTMENT_SURCHARGE_MIN = 5;
const LOYALTY_DISCOUNT_RATE = 0.2;
const LOYALTY_YEARS_THRESHOLD = 2;
const FOLLOWUP_DISCOUNT_RATE = 0.15;

// Claim/payout constants
const DEDUCTIBLE = 100;
const CAP_MULTIPLIER = 2;
const INSURANCE_VALUE_MULTIPLIER = 10;
const FULL_REIMBURSEMENT_RATE = 1;
const REDUCED_REIMBURSEMENT_RATE = 0.5;
const REDUCED_REIMBURSEMENT_MIN_ENCHANTMENT = 8;

const BASE_PRICES = {
  sword: 100,
  amulet: 60,
  staff: 80,
  potion: 40,
  rune: 25,
  moonstone: 25,
} as const;

type KnownItemType = keyof typeof BASE_PRICES;

const basePriceOf = (item: Item): number => {
  const price = BASE_PRICES[item.type as KnownItemType];
  if (price === undefined) {
    throw new Error(`Unknown item type: ${item.type}`);
  }
  return price;
};

const insuranceValueOf = (item: Item): number =>
  basePriceOf(item) * INSURANCE_VALUE_MULTIPLIER;

const sumBy = <T>(items: readonly T[], valueOf: (item: T) => number): number =>
  items.reduce((total, item) => total + valueOf(item), 0);

const COMPONENT_BLOCK_SIZE = 3;
const COMPONENT_BLOCK_PRICE = 60;
const COMPONENT_TYPES: ReadonlySet<string> = new Set(["rune", "moonstone"]);

const groupByType = (items: Item[]): Item[][] => {
  const groups = new Map<string, Item[]>();
  for (const item of items) {
    const bucket = groups.get(item.type) ?? [];
    bucket.push(item);
    groups.set(item.type, bucket);
  }
  return [...groups.values()];
};

const isComponentBlock = (group: Item[]): boolean =>
  group.length === COMPONENT_BLOCK_SIZE && COMPONENT_TYPES.has(group[0].type);

const baseTotalForGroup = (group: Item[]): number =>
  isComponentBlock(group) ? COMPONENT_BLOCK_PRICE : sumBy(group, basePriceOf);

const baseTotal = (items: Item[]): number => sumBy(groupByType(items), baseTotalForGroup);

const isLoyalCustomer = (customer: Customer): boolean =>
  customer.yearsWithMHPCO >= LOYALTY_YEARS_THRESHOLD;

const enchantmentOf = (item: Item): number => item.enchantment ?? 0;

const rateIf = (condition: boolean, rate: number): number => (condition ? rate : 0);

const surchargeRateFor = (item: Item): number =>
  rateIf(item.cursed === true, CURSE_SURCHARGE_RATE) +
  rateIf(enchantmentOf(item) >= ENCHANTMENT_SURCHARGE_MIN, ENCHANTMENT_SURCHARGE_RATE);

const surchargeFor = (item: Item): number => basePriceOf(item) * surchargeRateFor(item);

const policyDiscountRate = (customer: Customer, isFollowup: boolean): number =>
  rateIf(isLoyalCustomer(customer), LOYALTY_DISCOUNT_RATE) +
  rateIf(isFollowup, FOLLOWUP_DISCOUNT_RATE);

const premiumFor = (items: Item[], customer: Customer, isFollowup: boolean): number => {
  const base = baseTotal(items);
  const itemSurcharges = sumBy(items, surchargeFor);
  const firstInsuranceSurcharge = base * FIRST_INSURANCE_RATE;
  const policyDiscount = base * policyDiscountRate(customer, isFollowup);
  return Math.ceil(base + itemSurcharges + firstInsuranceSurcharge - policyDiscount + PROCESSING_FEE);
};

const insuranceSumOf = (items: Item[]): number => sumBy(items, insuranceValueOf);

const reimbursementRateFor = (item: Item): number =>
  enchantmentOf(item) >= REDUCED_REIMBURSEMENT_MIN_ENCHANTMENT
    ? REDUCED_REIMBURSEMENT_RATE
    : FULL_REIMBURSEMENT_RATE;

interface Policy {
  items: Item[];
  remainingCap: number;
}

const newPolicy = (items: Item[]): Policy => ({
  items,
  remainingCap: insuranceSumOf(items) * CAP_MULTIPLIER,
});

const policyWithCap = (policy: Policy, remainingCap: number): Policy => ({
  ...policy,
  remainingCap,
});

const findInsuredItem = (policy: Policy, itemType: string): Item => {
  const item = policy.items.find((it) => it.type === itemType);
  if (item === undefined) {
    throw new Error(`Policy does not insure item type: ${itemType}`);
  }
  return item;
};

const payoutForDamage = (damage: Damage, policy: Policy): number => {
  const item = findInsuredItem(policy, damage.itemType);
  return Math.max(0, damage.amount * reimbursementRateFor(item) - DEDUCTIBLE);
};

const countBy = <T>(entries: readonly T[], keyOf: (entry: T) => string): Map<string, number> => {
  const counts = new Map<string, number>();
  for (const entry of entries) {
    const key = keyOf(entry);
    counts.set(key, (counts.get(key) ?? 0) + 1);
  }
  return counts;
};

const assertNonNegativeAmounts = (damages: Damage[]): void => {
  for (const damage of damages) {
    if (damage.amount < 0) {
      throw new Error(`Damage amount must be non-negative: ${damage.amount}`);
    }
  }
};

const assertDamageCountsCoveredByPolicy = (policy: Policy, damages: Damage[]): void => {
  const insuredCounts = countBy(policy.items, (item) => item.type);
  const damageCounts = countBy(damages, (damage) => damage.itemType);
  for (const [itemType, damageCount] of damageCounts) {
    const insuredCount = insuredCounts.get(itemType) ?? 0;
    if (damageCount > insuredCount) {
      throw new Error(
        `Damage count for ${itemType} (${damageCount}) exceeds insured count (${insuredCount})`,
      );
    }
  }
};

const validateClaim = (policy: Policy, damages: Damage[]): void => {
  assertNonNegativeAmounts(damages);
  assertDamageCountsCoveredByPolicy(policy, damages);
};

const settleClaim = (policy: Policy, incident: Incident): ClaimResult => {
  validateClaim(policy, incident.damages);
  const grossPayout = sumBy(incident.damages, (damage) => payoutForDamage(damage, policy));
  const cappedPayout = Math.min(grossPayout, policy.remainingCap);
  const payout = Math.floor(cappedPayout);
  const remainingCap = policy.remainingCap - payout;
  return { payout, remainingCap };
};

interface ScenarioState {
  policies: Record<number, Policy>;
  hasPriorQuote: boolean;
  results: StepResult[];
}

const initialState: ScenarioState = { policies: {}, hasPriorQuote: false, results: [] };

const appendResult = (state: ScenarioState, result: StepResult): ScenarioState => ({
  ...state,
  results: [...state.results, result],
});

const withPolicy = (state: ScenarioState, policyKey: number, policy: Policy): ScenarioState => ({
  ...state,
  policies: { ...state.policies, [policyKey]: policy },
});

const markQuoteRecorded = (state: ScenarioState): ScenarioState => ({
  ...state,
  hasPriorQuote: true,
});

const handleQuote = (
  state: ScenarioState,
  step: QuoteStep,
  policyKey: number,
  customer: Customer,
): ScenarioState => {
  const premium = premiumFor(step.items, customer, state.hasPriorQuote);
  const stateWithPolicy = withPolicy(state, policyKey, newPolicy(step.items));
  return appendResult(markQuoteRecorded(stateWithPolicy), { premium });
};

const handleClaim = (state: ScenarioState, step: ClaimStep): ScenarioState => {
  const policy = state.policies[step.policy];
  const result = settleClaim(policy, step.incident);
  const updatedPolicy = policyWithCap(policy, result.remainingCap);
  return appendResult(withPolicy(state, step.policy, updatedPolicy), result);
};

const applyStep = (
  state: ScenarioState,
  step: Step,
  index: number,
  customer: Customer,
): ScenarioState =>
  step.op === "quote"
    ? handleQuote(state, step, index, customer)
    : handleClaim(state, step);

export const runScenario = (scenario: Scenario): ScenarioOutput => {
  const finalState = scenario.steps.reduce(
    (state, step, index) => applyStep(state, step, index, scenario.customer),
    initialState,
  );
  return { results: finalState.results };
};
