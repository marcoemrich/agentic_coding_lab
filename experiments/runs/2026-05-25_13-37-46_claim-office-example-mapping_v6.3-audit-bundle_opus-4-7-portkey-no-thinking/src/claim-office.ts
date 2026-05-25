const PROCESSING_FEE = 5;

type Item = { type: string; cursed?: boolean; enchantment?: number; material?: string };
type Customer = { yearsWithMHPCO: number };
type QuoteStep = { op: "quote"; items: Item[] };
type Damage = { itemType: string; amount: number };
type Incident = { cause: string; damages: Damage[] };
type ClaimStep = { op: "claim"; policy: number; incident: Incident };
type Step = QuoteStep | ClaimStep;
type Scenario = { customer: Customer; steps: Step[] };
type QuoteResult = { premium: number };
type ClaimResult = { payout: number; remainingCap: number };
type StepResult = QuoteResult | ClaimResult;
type ScenarioResult = { results: StepResult[] };

type ItemSpec = { basePrice: number; insuranceValue: number };

const ITEM_CATALOG: Record<string, ItemSpec> = {
  sword: { basePrice: 100, insuranceValue: 1000 },
  amulet: { basePrice: 60, insuranceValue: 600 },
  staff: { basePrice: 80, insuranceValue: 800 },
  potion: { basePrice: 40, insuranceValue: 400 },
  rune: { basePrice: 25, insuranceValue: 250 },
  moonstone: { basePrice: 25, insuranceValue: 250 },
};

const specOf = (item: Item): ItemSpec | undefined => ITEM_CATALOG[item.type];

const basePriceOf = (item: Item): number => specOf(item)?.basePrice ?? 0;

const CURSED_SURCHARGE_RATE = 0.5;
const HIGH_ENCHANTMENT_SURCHARGE_RATE = 0.3;
const HIGH_ENCHANTMENT_THRESHOLD = 5;

const enchantmentLevel = (item: Item): number => item.enchantment ?? 0;

const isCursed = (item: Item): boolean => item.cursed === true;
const isHighlyEnchanted = (item: Item): boolean =>
  enchantmentLevel(item) >= HIGH_ENCHANTMENT_THRESHOLD;

const surchargeRate = (item: Item): number =>
  (isCursed(item) ? CURSED_SURCHARGE_RATE : 0) +
  (isHighlyEnchanted(item) ? HIGH_ENCHANTMENT_SURCHARGE_RATE : 0);

const itemSurchargeAmount = (item: Item): number =>
  basePriceOf(item) * surchargeRate(item);

const COMPONENT_TYPES = new Set(["rune", "moonstone"]);
const BLOCK_SIZE = 3;
const BLOCK_PRICE = 60;

const groupItemsByType = (items: Item[]): Item[][] => {
  const groups = new Map<string, Item[]>();
  for (const item of items) {
    const existing = groups.get(item.type) ?? [];
    existing.push(item);
    groups.set(item.type, existing);
  }
  return Array.from(groups.values());
};

const qualifiesForComponentBlock = (members: Item[]): boolean =>
  members.length === BLOCK_SIZE && COMPONENT_TYPES.has(members[0].type);

const sumOf = <T>(items: T[], valueOf: (item: T) => number): number =>
  items.reduce((total, item) => total + valueOf(item), 0);

const sumBasePrices = (items: Item[]): number => sumOf(items, basePriceOf);

const groupBasePremium = (members: Item[]): number =>
  qualifiesForComponentBlock(members) ? BLOCK_PRICE : sumBasePrices(members);

const itemsBaseSubtotal = (items: Item[]): number =>
  sumOf(groupItemsByType(items), groupBasePremium);

const itemsSurchargeSubtotal = (items: Item[]): number =>
  sumOf(items, itemSurchargeAmount);

const LOYALTY_DISCOUNT_RATE = 0.2;
const LOYALTY_YEARS_THRESHOLD = 2;

const isLoyalCustomer = (customer: Customer): boolean =>
  customer.yearsWithMHPCO >= LOYALTY_YEARS_THRESHOLD;

const loyaltyDiscountRate = (customer: Customer): number =>
  isLoyalCustomer(customer) ? LOYALTY_DISCOUNT_RATE : 0;

const FIRST_INSURANCE_SURCHARGE_RATE = 0.1;
const FOLLOW_UP_DISCOUNT_RATE = 0.15;

const hasPreviousContract = (stepIndex: number): boolean => stepIndex > 0;

const followUpDiscountRate = (stepIndex: number): number =>
  hasPreviousContract(stepIndex) ? FOLLOW_UP_DISCOUNT_RATE : 0;

const policyAdjustmentRate = (customer: Customer, stepIndex: number): number =>
  FIRST_INSURANCE_SURCHARGE_RATE -
  loyaltyDiscountRate(customer) -
  followUpDiscountRate(stepIndex);

// Kept as `base + base*rate` (not `base*(1+rate)`) for IEEE-754 stability:
// e.g. 100*(1+0.1) === 110.00000000000001, which trips Math.ceil rounding.
const adjustedBasePremium = (baseSubtotal: number, rate: number): number =>
  baseSubtotal + baseSubtotal * rate;

const quotePremium = (
  items: Item[],
  customer: Customer,
  stepIndex: number,
): number =>
  adjustedBasePremium(
    itemsBaseSubtotal(items),
    policyAdjustmentRate(customer, stepIndex),
  ) +
  itemsSurchargeSubtotal(items) +
  PROCESSING_FEE;

// MHPCO always rounds in its own favor: premiums up, payouts down.
const roundPremiumInMhpcoFavor = (amount: number): number => Math.ceil(amount);
const roundPayoutInMhpcoFavor = (amount: number): number => Math.floor(amount);

const insuranceValueOf = (item: Item): number =>
  specOf(item)?.insuranceValue ?? 0;

const DEDUCTIBLE_PER_DAMAGE = 100;
const CAP_MULTIPLIER = 2;

const insuranceSum = (items: Item[]): number =>
  sumOf(items, insuranceValueOf);

const HIGH_ENCHANTMENT_PAYOUT_RATE = 0.5;
const HIGH_ENCHANTMENT_PAYOUT_THRESHOLD = 8;

const isHighEnchantmentForPayout = (item: Item): boolean =>
  enchantmentLevel(item) >= HIGH_ENCHANTMENT_PAYOUT_THRESHOLD;

const reimbursableAmount = (damage: Damage, item: Item): number =>
  isHighEnchantmentForPayout(item)
    ? damage.amount * HIGH_ENCHANTMENT_PAYOUT_RATE
    : damage.amount;

const damagePayout = (damage: Damage, item: Item): number =>
  reimbursableAmount(damage, item) - DEDUCTIBLE_PER_DAMAGE;

// validateDamagesAgainstPolicy rejects damages whose itemType is not on the
// policy before this lookup runs, so the find is total here.
const policyItemOfType = (policyItems: Item[], itemType: string): Item =>
  policyItems.find((item) => item.type === itemType) as Item;

const totalPayout = (damages: Damage[], policyItems: Item[]): number =>
  sumOf(damages, (damage) =>
    damagePayout(damage, policyItemOfType(policyItems, damage.itemType)),
  );

const policyCap = (policyItems: Item[]): number =>
  CAP_MULTIPLIER * insuranceSum(policyItems);

const isKnownItem = (item: Item): boolean => specOf(item) !== undefined;

const validateItemTypes = (items: Item[]): void => {
  const unknown = items.find((item) => !isKnownItem(item));
  if (unknown !== undefined) {
    throw new Error(`unknown item type '${unknown.type}'`);
  }
};

const runQuoteStep = (
  step: QuoteStep,
  customer: Customer,
  stepIndex: number,
): QuoteResult => {
  validateItemTypes(step.items);
  return {
    premium: roundPremiumInMhpcoFavor(
      quotePremium(step.items, customer, stepIndex),
    ),
  };
};

const settleClaim = (
  step: ClaimStep,
  policyItems: Item[],
  availableCap: number,
): ClaimResult => {
  const uncappedPayout = roundPayoutInMhpcoFavor(
    totalPayout(step.incident.damages, policyItems),
  );
  const payout = Math.min(uncappedPayout, availableCap);
  return { payout, remainingCap: availableCap - payout };
};

// Claim steps reference a prior quote step by index; the CLI guarantees that
// reference is valid and points at a quote, so the lookup is total.
const policyItemsAt = (steps: Step[], policyIndex: number): Item[] =>
  (steps[policyIndex] as QuoteStep).items;

const countOccurrences = <T>(items: T[], keyOf: (item: T) => string): Map<string, number> => {
  const counts = new Map<string, number>();
  for (const item of items) {
    const key = keyOf(item);
    counts.set(key, (counts.get(key) ?? 0) + 1);
  }
  return counts;
};

const validateDamageAmounts = (damages: Damage[]): void => {
  const negative = damages.find((damage) => damage.amount < 0);
  if (negative !== undefined) {
    throw new Error(
      `claim damage amount cannot be negative (got ${negative.amount} for '${negative.itemType}')`,
    );
  }
};

const validateDamagesAgainstPolicy = (
  damages: Damage[],
  policyItems: Item[],
): void => {
  const remainingSlots = countOccurrences(policyItems, (item) => item.type);
  for (const damage of damages) {
    const slotsLeft = remainingSlots.get(damage.itemType);
    if (slotsLeft === undefined) {
      throw new Error(
        `claim references '${damage.itemType}' but the policy does not cover it`,
      );
    }
    if (slotsLeft === 0) {
      throw new Error(
        `claim references more '${damage.itemType}' damages than the policy covers`,
      );
    }
    remainingSlots.set(damage.itemType, slotsLeft - 1);
  }
};

const validateClaimDamages = (
  damages: Damage[],
  policyItems: Item[],
): void => {
  validateDamageAmounts(damages);
  validateDamagesAgainstPolicy(damages, policyItems);
};

const settleClaimAgainstPolicyCap = (
  step: ClaimStep,
  steps: Step[],
  remainingCaps: Map<number, number>,
): ClaimResult => {
  const policyItems = policyItemsAt(steps, step.policy);
  validateClaimDamages(step.incident.damages, policyItems);
  const availableCap = remainingCaps.get(step.policy) ?? policyCap(policyItems);
  const result = settleClaim(step, policyItems, availableCap);
  remainingCaps.set(step.policy, result.remainingCap);
  return result;
};

const runStep = (
  step: Step,
  customer: Customer,
  stepIndex: number,
  steps: Step[],
  remainingCaps: Map<number, number>,
): StepResult =>
  step.op === "quote"
    ? runQuoteStep(step, customer, stepIndex)
    : settleClaimAgainstPolicyCap(step, steps, remainingCaps);

export const runScenario = (input: Scenario): ScenarioResult => {
  const remainingCaps = new Map<number, number>();
  return {
    results: input.steps.map((step, i) =>
      runStep(step, input.customer, i, input.steps, remainingCaps),
    ),
  };
};
