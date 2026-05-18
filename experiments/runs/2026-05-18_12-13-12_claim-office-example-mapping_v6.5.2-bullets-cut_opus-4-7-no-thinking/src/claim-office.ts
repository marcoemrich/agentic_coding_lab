// Quote constants
const PROCESSING_FEE = 5;
const DEFAULT_BASE_PREMIUM = 100;
const CURSE_SURCHARGE_RATE = 0.5;
const FIRST_INSURANCE_RATE = 0.1;
const HIGH_ENCHANTMENT_RATE = 0.3;
const HIGH_ENCHANTMENT_THRESHOLD = 5;
const LOYALTY_DISCOUNT_RATE = 0.2;
const LOYALTY_THRESHOLD_YEARS = 2;
const FOLLOW_UP_DISCOUNT_RATE = 0.15;

// Claim constants
const DEDUCTIBLE = 100;
const CAP_MULTIPLIER = 2;
const DEFAULT_INSURANCE_VALUE = 1000;
const HIGH_ENCHANTMENT_PAYOUT_THRESHOLD = 8;
const HIGH_ENCHANTMENT_PAYOUT_RATE = 0.5;
const FULL_PAYOUT_RATE = 1;

type QuoteItem = { type: string; material?: string; enchantment?: number; cursed?: boolean };
type Damage = { itemType: string; amount: number };
type Incident = { cause: string; damages: Damage[] };
type Step =
  | { op: "quote"; items: QuoteItem[] }
  | { op: "claim"; policy: number; incident: Incident };
type Customer = { yearsWithMHPCO: number };
type Scenario = { customer: Customer; steps: Step[] };

const BLOCK_TYPE = "block";
const BLOCK_OF_THREE_BASE = 60;
const BLOCK_SIZE = 3;

const BASE_PREMIUM_BY_TYPE: Record<string, number> = {
  amulet: 60,
  rune: 25,
  moonstone: 25,
  [BLOCK_TYPE]: BLOCK_OF_THREE_BASE,
};
const BLOCK_TYPES = new Set(["rune", "moonstone"]);

const INSURANCE_VALUE_BY_TYPE: Record<string, number> = {
  sword: 1000,
  amulet: 600,
  staff: 800,
  potion: 400,
  rune: 250,
  moonstone: 250,
};

const isKnownItemType = (type: string): boolean =>
  type in INSURANCE_VALUE_BY_TYPE;

const assertKnownItemType = (item: QuoteItem): void => {
  if (!isKnownItemType(item.type)) {
    throw new Error(`Unknown item type: ${item.type}`);
  }
};

const insuranceValueForItem = (item: QuoteItem): number =>
  INSURANCE_VALUE_BY_TYPE[item.type] ?? DEFAULT_INSURANCE_VALUE;

const basePremiumForItem = (item: QuoteItem): number =>
  BASE_PREMIUM_BY_TYPE[item.type] ?? DEFAULT_BASE_PREMIUM;

const groupByType = (items: QuoteItem[]): Map<string, QuoteItem[]> =>
  items.reduce((groups, item) => {
    const group = groups.get(item.type) ?? [];
    return groups.set(item.type, [...group, item]);
  }, new Map<string, QuoteItem[]>());

const isHighEnchantment = (item: QuoteItem): boolean =>
  (item.enchantment ?? 0) >= HIGH_ENCHANTMENT_THRESHOLD;

const itemSurchargeRate = (item: QuoteItem): number =>
  (item.cursed ? CURSE_SURCHARGE_RATE : 0) +
  (isHighEnchantment(item) ? HIGH_ENCHANTMENT_RATE : 0) +
  FIRST_INSURANCE_RATE;

const itemPremium = (item: QuoteItem): number => {
  const base = basePremiumForItem(item);
  return base + base * itemSurchargeRate(item);
};

const isBlockGroup = (type: string, group: QuoteItem[]): boolean =>
  BLOCK_TYPES.has(type) && group.length === BLOCK_SIZE;

const billingItems = (items: QuoteItem[]): QuoteItem[] =>
  [...groupByType(items)].flatMap(([type, group]) =>
    isBlockGroup(type, group) ? [{ type: BLOCK_TYPE }] : group,
  );

const sumBy = <T>(items: T[], fn: (item: T) => number): number =>
  items.reduce((total, item) => total + fn(item), 0);

const policyDiscountRate = (customer: Customer, quoteIndex: number): number =>
  (customer.yearsWithMHPCO >= LOYALTY_THRESHOLD_YEARS ? LOYALTY_DISCOUNT_RATE : 0) +
  (quoteIndex > 0 ? FOLLOW_UP_DISCOUNT_RATE : 0);

type QuoteResult = { premium: number };
type ClaimResult = { payout: number; remainingCap: number };
type StepResult = QuoteResult | ClaimResult;

type Policy = { items: QuoteItem[]; remainingCap: number };

const quoteStep = (
  customer: Customer,
  quoteIndex: number,
  items: QuoteItem[],
): QuoteResult => {
  items.forEach(assertKnownItemType);
  const billables = billingItems(items);
  const policyBase = sumBy(billables, basePremiumForItem);
  const subtotal = sumBy(billables, itemPremium);
  const discount = policyBase * policyDiscountRate(customer, quoteIndex);
  return { premium: Math.ceil(subtotal - discount + PROCESSING_FEE) };
};

const hasHighEnchantmentPayout = (item: QuoteItem): boolean =>
  (item.enchantment ?? 0) >= HIGH_ENCHANTMENT_PAYOUT_THRESHOLD;

const payoutRate = (item: QuoteItem): number =>
  hasHighEnchantmentPayout(item) ? HIGH_ENCHANTMENT_PAYOUT_RATE : FULL_PAYOUT_RATE;

const findInsuredItem = (policy: Policy, itemType: string): QuoteItem | undefined =>
  policy.items.find((it) => it.type === itemType);

const assertNonNegativeDamage = (damage: Damage): void => {
  if (damage.amount < 0) {
    throw new Error(`Negative damage amount: ${damage.amount}`);
  }
};

const findInsuredItemOrThrow = (policy: Policy, itemType: string): QuoteItem => {
  const item = findInsuredItem(policy, itemType);
  if (item === undefined) {
    throw new Error(`Damaged item not insured: ${itemType}`);
  }
  return item;
};

const reimbursementForDamage = (policy: Policy, damage: Damage): number => {
  assertNonNegativeDamage(damage);
  const item = findInsuredItemOrThrow(policy, damage.itemType);
  return damage.amount * payoutRate(item) - DEDUCTIBLE;
};

const totalReimbursement = (policy: Policy, incident: Incident): number =>
  sumBy(incident.damages, (damage) => reimbursementForDamage(policy, damage));

const claimStep = (policy: Policy, incident: Incident): { result: ClaimResult; policy: Policy } => {
  const { remainingCap: cap } = policy;
  const payout = Math.floor(Math.min(totalReimbursement(policy, incident), cap));
  const remainingCap = cap - payout;
  return {
    result: { payout, remainingCap },
    policy: { ...policy, remainingCap },
  };
};

const policyFromItems = (items: QuoteItem[]): Policy => ({
  items,
  remainingCap: sumBy(items, insuranceValueForItem) * CAP_MULTIPLIER,
});

type ScenarioState = {
  results: StepResult[];
  quoteIndex: number;
  policies: Record<number, Policy>;
};

const initialState: ScenarioState = { results: [], quoteIndex: 0, policies: {} };

const applyQuote = (
  customer: Customer,
  state: ScenarioState,
  items: QuoteItem[],
  policyId: number,
): ScenarioState => ({
  ...state,
  results: [...state.results, quoteStep(customer, state.quoteIndex, items)],
  quoteIndex: state.quoteIndex + 1,
  policies: { ...state.policies, [policyId]: policyFromItems(items) },
});

const applyClaim = (
  state: ScenarioState,
  policyId: number,
  incident: Incident,
): ScenarioState => {
  const { result, policy } = claimStep(state.policies[policyId], incident);
  return {
    ...state,
    results: [...state.results, result],
    policies: { ...state.policies, [policyId]: policy },
  };
};

const applyStep = (
  customer: Customer,
  state: ScenarioState,
  step: Step,
  index: number,
): ScenarioState =>
  step.op === "quote"
    ? applyQuote(customer, state, step.items, index)
    : applyClaim(state, step.policy, step.incident);

export const runScenario = (scenario: unknown): unknown => {
  const { customer, steps } = scenario as Scenario;
  const { results } = steps.reduce(
    (state, step, index) => applyStep(customer, state, step, index),
    initialState,
  );
  return { results };
};
