const PROCESSING_FEE = 5;
const FIRST_INSURANCE_SURCHARGE = 0.1;
const LOYALTY_DISCOUNT = 0.2;
const LOYALTY_THRESHOLD_YEARS = 2;
const FOLLOW_UP_CONTRACT_DISCOUNT = 0.15;
const FLOAT_ROUNDING_TOLERANCE = 1e-9;
const BLOCK_OF_THREE_DISCOUNT = 15;

const BASE_PREMIUM: Record<string, number> = {
  sword: 100,
  amulet: 60,
  staff: 80,
  potion: 40,
  rune: 25,
  moonstone: 25,
};

const INSURANCE_VALUE: Record<string, number> = {
  sword: 1000,
  amulet: 600,
  staff: 800,
  potion: 400,
  rune: 250,
  moonstone: 250,
};

const CAP_MULTIPLIER = 2;

type Item = { type: string; cursed?: boolean; enchantment?: number };
type QuoteStep = { op: "quote"; items: Array<Item> };
type Damage = { itemType: string; amount: number };
type ClaimStep = { op: "claim"; policy: number; incident: { cause: string; damages: Array<Damage> } };
type Step = QuoteStep | ClaimStep;
type Customer = { yearsWithMHPCO: number };
type Scenario = {
  customer: Customer;
  steps: Array<Step>;
};

const roundDownInMHPCOFavor = (amount: number): number =>
  Math.floor(amount + FLOAT_ROUNDING_TOLERANCE);

const roundUpInMHPCOFavor = (amount: number): number =>
  Math.ceil(amount - FLOAT_ROUNDING_TOLERANCE);

const requireDefined = <T>(value: T | undefined, errorMessage: string): T => {
  if (value === undefined) {
    throw new Error(errorMessage);
  }
  return value;
};

const lookupByItemType = (table: Record<string, number>, item: Item): number =>
  requireDefined(table[item.type], `Unknown item type: ${item.type}`);

const basePremiumOf = (item: Item): number => lookupByItemType(BASE_PREMIUM, item);

const insuranceValueOf = (item: Item): number => lookupByItemType(INSURANCE_VALUE, item);

const HIGH_ENCHANTMENT_SURCHARGE_THRESHOLD = 5;

type ItemSurcharge = { applies: (item: Item) => boolean; rate: number };

const ITEM_SURCHARGES: Array<ItemSurcharge> = [
  { applies: (item) => item.cursed === true, rate: 0.5 },
  { applies: (item) => (item.enchantment ?? 0) >= HIGH_ENCHANTMENT_SURCHARGE_THRESHOLD, rate: 0.3 },
];

const surchargesFor = (item: Item): number =>
  ITEM_SURCHARGES.reduce(
    (sum, { applies, rate }) => sum + (applies(item) ? basePremiumOf(item) * rate : 0),
    0,
  );

const sumOfBasePrices = (items: Array<Item>): number =>
  items.reduce((sum, item) => sum + basePremiumOf(item), 0);

const sumOfItemSurcharges = (items: Array<Item>): number =>
  items.reduce((sum, item) => sum + surchargesFor(item), 0);

const COMPONENT_TYPES = ["rune", "moonstone"];
const BLOCK_SIZE = 3;

const countsByKey = <T>(xs: Array<T>, keyOf: (x: T) => string): Map<string, number> =>
  xs.reduce(
    (counts, x) => counts.set(keyOf(x), (counts.get(keyOf(x)) ?? 0) + 1),
    new Map<string, number>(),
  );

const countOfType = (items: Array<Item>, type: string): number =>
  items.filter((item) => item.type === type).length;

const formsABlock = (items: Array<Item>, type: string): boolean =>
  countOfType(items, type) === BLOCK_SIZE;

const blockDiscountFor = (items: Array<Item>): number =>
  COMPONENT_TYPES.filter((type) => formsABlock(items, type)).length *
  BLOCK_OF_THREE_DISCOUNT;

const basePremiumFor = (items: Array<Item>): number =>
  sumOfBasePrices(items) - blockDiscountFor(items);

type PolicyContext = { customer: Customer; isFollowUp: boolean };
type PolicyAdjustment = { applies: (ctx: PolicyContext) => boolean; signedRate: number };

const POLICY_ADJUSTMENTS: Array<PolicyAdjustment> = [
  { applies: () => true, signedRate: +FIRST_INSURANCE_SURCHARGE },
  { applies: ({ customer }) => customer.yearsWithMHPCO >= LOYALTY_THRESHOLD_YEARS, signedRate: -LOYALTY_DISCOUNT },
  { applies: ({ isFollowUp }) => isFollowUp, signedRate: -FOLLOW_UP_CONTRACT_DISCOUNT },
];

const policyAdjustmentsOn = (policyBase: number, ctx: PolicyContext): number =>
  POLICY_ADJUSTMENTS.reduce(
    (sum, { applies, signedRate }) => sum + (applies(ctx) ? policyBase * signedRate : 0),
    0,
  );

const quoteStep = (step: QuoteStep, ctx: PolicyContext): { premium: number } => {
  const policyBase = basePremiumFor(step.items);
  const premiumBeforeRounding =
    policyBase
    + policyAdjustmentsOn(policyBase, ctx)
    + sumOfItemSurcharges(step.items)
    + PROCESSING_FEE;
  return { premium: roundUpInMHPCOFavor(premiumBeforeRounding) };
};

const DEDUCTIBLE = 100;
const HIGH_ENCHANTMENT_PAYOUT_THRESHOLD = 8;
const HIGH_ENCHANTMENT_PAYOUT_RATE = 0.5;

const findInsuredItem = (policy: QuoteStep, itemType: string): Item =>
  requireDefined(
    policy.items.find((item) => item.type === itemType),
    `Item not in policy: ${itemType}`,
  );

const reimbursementOf = (item: Item, damage: Damage): number =>
  (item.enchantment ?? 0) >= HIGH_ENCHANTMENT_PAYOUT_THRESHOLD
    ? damage.amount * HIGH_ENCHANTMENT_PAYOUT_RATE
    : damage.amount;

const payoutForDamage = (item: Item, damage: Damage): number =>
  reimbursementOf(item, damage) - DEDUCTIBLE;

const sumOfInsuranceValues = (items: Array<Item>): number =>
  items.reduce((sum, item) => sum + insuranceValueOf(item), 0);

const capFor = (policy: QuoteStep): number =>
  CAP_MULTIPLIER * sumOfInsuranceValues(policy.items);

const assertDamageAmountsNonNegative = (step: ClaimStep): void => {
  const negative = step.incident.damages.find((damage) => damage.amount < 0);
  if (negative !== undefined) {
    throw new Error(`Damage amount must be non-negative: ${negative.amount}`);
  }
};

const assertDamagesFitPolicy = (step: ClaimStep, policy: QuoteStep): void => {
  const insuredCounts = countsByKey(policy.items, (item) => item.type);
  const damageCounts = countsByKey(step.incident.damages, (damage) => damage.itemType);
  for (const [itemType, dmgCount] of damageCounts) {
    if (dmgCount > (insuredCounts.get(itemType) ?? 0)) {
      throw new Error(`Damage entries exceed insured count for: ${itemType}`);
    }
  }
};

const assertClaimIsValid = (step: ClaimStep, policy: QuoteStep): void => {
  assertDamageAmountsNonNegative(step);
  assertDamagesFitPolicy(step, policy);
};

const claimStep = (
  step: ClaimStep,
  policy: QuoteStep,
  remainingCap: number,
): { payout: number; remainingCap: number } => {
  assertClaimIsValid(step, policy);
  const payoutBeforeRounding = step.incident.damages.reduce(
    (sum, damage) => sum + payoutForDamage(findInsuredItem(policy, damage.itemType), damage),
    0,
  );
  const desiredPayout = roundDownInMHPCOFavor(payoutBeforeRounding);
  const payout = Math.min(desiredPayout, remainingCap);
  return { payout, remainingCap: remainingCap - payout };
};

const isQuoteStep = (step: Step): step is QuoteStep => step.op === "quote";

const claimAgainstRemainingCap = (
  step: ClaimStep,
  steps: Array<Step>,
  remainingCapByPolicy: Map<number, number>,
): { payout: number; remainingCap: number } => {
  const policy = steps[step.policy] as QuoteStep;
  const currentCap = remainingCapByPolicy.get(step.policy) ?? capFor(policy);
  const result = claimStep(step, policy, currentCap);
  remainingCapByPolicy.set(step.policy, result.remainingCap);
  return result;
};

export const processScenario = (scenario: unknown): unknown => {
  const { customer, steps } = scenario as Scenario;
  const remainingCapByPolicy = new Map<number, number>();
  const results = steps.map((step, index) =>
    isQuoteStep(step)
      ? quoteStep(step, { customer, isFollowUp: index > 0 })
      : claimAgainstRemainingCap(step, steps, remainingCapByPolicy),
  );
  return { results };
};
