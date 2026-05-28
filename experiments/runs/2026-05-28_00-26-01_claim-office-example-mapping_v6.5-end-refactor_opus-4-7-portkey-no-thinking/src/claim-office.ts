// --- Rates, fees, and thresholds ---
const PROCESSING_FEE = 5;
const FIRST_INSURANCE_RATE = 0.1;
const FOLLOW_UP_DISCOUNT_RATE = 0.15;
const LOYALTY_RATE = 0.2;
const LOYALTY_THRESHOLD_YEARS = 2;
const CURSE_RATE = 0.5;
const HIGH_ENCHANTMENT_RATE = 0.3;
const HIGH_ENCHANTMENT_THRESHOLD = 5;
const BLOCK_SIZE = 3;
const BLOCK_BASE_PREMIUM = 60;
const DEDUCTIBLE = 100;
const CAP_MULTIPLIER = 2;
const HIGH_ENCHANTMENT_CLAIM_THRESHOLD = 8;
const HIGH_ENCHANTMENT_REIMBURSEMENT_RATE = 0.5;

// --- Item catalog ---
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

const COMPONENT_TYPES = new Set(["rune", "moonstone"]);

// --- Domain types ---
type Customer = { yearsWithMHPCO: number };
type Item = { type: string; cursed?: boolean; enchantment?: number; material?: string };
type QuoteStep = { op: "quote"; items: Item[] };
type Damage = { itemType: string; amount: number };
type Incident = { cause: string; damages: Damage[] };
type ClaimStep = { op: "claim"; policy: number; incident: Incident };
type Step = QuoteStep | ClaimStep;
type Input = { customer: Customer; steps: Step[] };
type QuoteResult = { premium: number };
type ClaimResult = { payout: number; remainingCap: number };
type StepResult = QuoteResult | ClaimResult;

const countBy = <T>(items: T[], keyOf: (item: T) => string): Map<string, number> => {
  const counts = new Map<string, number>();
  for (const item of items) {
    const key = keyOf(item);
    counts.set(key, (counts.get(key) ?? 0) + 1);
  }
  return counts;
};

const countByType = (items: Item[]): Map<string, number> =>
  countBy(items, (item) => item.type);

const basePremiumForType = (type: string, count: number): number => {
  const unit = BASE_PREMIUM[type];
  if (COMPONENT_TYPES.has(type) && count === BLOCK_SIZE) {
    return BLOCK_BASE_PREMIUM;
  }
  return unit * count;
};

const basePremium = (items: Item[]): number =>
  Array.from(countByType(items)).reduce(
    (total, [type, count]) => total + basePremiumForType(type, count),
    0,
  );

// MHPCO always rounds in its own favor: premiums up (collect more),
// payouts down (pay less).
const roundUpInMHPCOFavor = (amount: number): number => Math.ceil(amount);
const roundDownInMHPCOFavor = (amount: number): number => Math.floor(amount);

const isCursed = (item: Item): boolean => item.cursed === true;
const isHighlyEnchanted = (item: Item): boolean =>
  (item.enchantment ?? 0) >= HIGH_ENCHANTMENT_THRESHOLD;

const itemSurcharge = (item: Item): number => {
  const unit = BASE_PREMIUM[item.type];
  const curseSurcharge = isCursed(item) ? unit * CURSE_RATE : 0;
  const enchantmentSurcharge = isHighlyEnchanted(item)
    ? unit * HIGH_ENCHANTMENT_RATE
    : 0;
  return curseSurcharge + enchantmentSurcharge;
};

const sumItemSurcharges = (items: Item[]): number =>
  items.reduce((total, item) => total + itemSurcharge(item), 0);

const isLoyalCustomer = (customer: Customer): boolean =>
  customer.yearsWithMHPCO >= LOYALTY_THRESHOLD_YEARS;

const loyaltyDiscount = (base: number, customer: Customer): number =>
  isLoyalCustomer(customer) ? base * LOYALTY_RATE : 0;

const firstInsuranceSurcharge = (base: number): number =>
  base * FIRST_INSURANCE_RATE;

const followUpDiscount = (base: number, stepIndex: number): number =>
  stepIndex > 0 ? base * FOLLOW_UP_DISCOUNT_RATE : 0;

const validateItemTypes = (items: Item[]): void => {
  for (const item of items) {
    if (!(item.type in BASE_PREMIUM)) {
      throw new Error(`Unknown item type "${item.type}"`);
    }
  }
};

const quotePremium = (
  { items }: QuoteStep,
  customer: Customer,
  stepIndex: number,
): QuoteResult => {
  validateItemTypes(items);
  const base = basePremium(items);
  const premium =
    base +
    sumItemSurcharges(items) +
    firstInsuranceSurcharge(base) -
    loyaltyDiscount(base, customer) -
    followUpDiscount(base, stepIndex) +
    PROCESSING_FEE;
  return { premium: roundUpInMHPCOFavor(premium) };
};

const insuranceSum = (items: Item[]): number =>
  items.reduce((total, item) => total + INSURANCE_VALUE[item.type], 0);

const policyCap = (items: Item[]): number =>
  CAP_MULTIPLIER * insuranceSum(items);

const triggersHighEnchantmentClause = (item: Item): boolean =>
  (item.enchantment ?? 0) >= HIGH_ENCHANTMENT_CLAIM_THRESHOLD;

const reimbursableAmount = (item: Item, amount: number): number =>
  triggersHighEnchantmentClause(item)
    ? amount * HIGH_ENCHANTMENT_REIMBURSEMENT_RATE
    : amount;

const damagePayout = (damage: Damage, items: Item[]): number => {
  const item = items.find((i) => i.type === damage.itemType)!;
  return Math.max(reimbursableAmount(item, damage.amount) - DEDUCTIBLE, 0);
};

const totalPayout = (damages: Damage[], items: Item[]): number =>
  damages.reduce((total, damage) => total + damagePayout(damage, items), 0);

const remainingCapFor = (
  policy: number,
  items: Item[],
  remainingCaps: Map<number, number>,
): number => remainingCaps.get(policy) ?? policyCap(items);

const validateDamageCounts = (damages: Damage[], items: Item[]): void => {
  const itemCounts = countByType(items);
  const damageCounts = countBy(damages, (d) => d.itemType);
  for (const [type, damageCount] of damageCounts) {
    const policyCount = itemCounts.get(type) ?? 0;
    if (damageCount > policyCount) {
      throw new Error(
        `Claim references ${damageCount} damages of type "${type}" but policy covers only ${policyCount}`,
      );
    }
  }
};

const validateDamageAmounts = (damages: Damage[]): void => {
  for (const damage of damages) {
    if (damage.amount < 0) {
      throw new Error(`Damage amount must be non-negative, got ${damage.amount}`);
    }
  }
};

const processClaim = (
  { policy, incident: { damages } }: ClaimStep,
  steps: Step[],
  remainingCaps: Map<number, number>,
): ClaimResult => {
  const { items } = steps[policy] as QuoteStep;
  validateDamageAmounts(damages);
  validateDamageCounts(damages, items);
  const desired = totalPayout(damages, items);
  const available = remainingCapFor(policy, items, remainingCaps);
  const payout = roundDownInMHPCOFavor(Math.min(desired, available));
  const remainingCap = available - payout;
  remainingCaps.set(policy, remainingCap);
  return { payout, remainingCap };
};

export const run = (input: Input): { results: StepResult[] } => {
  const { customer, steps } = input;
  const remainingCaps = new Map<number, number>();
  const processStep = (step: Step, index: number): StepResult =>
    step.op === "quote"
      ? quotePremium(step, customer, index)
      : processClaim(step, steps, remainingCaps);
  return { results: steps.map(processStep) };
};
