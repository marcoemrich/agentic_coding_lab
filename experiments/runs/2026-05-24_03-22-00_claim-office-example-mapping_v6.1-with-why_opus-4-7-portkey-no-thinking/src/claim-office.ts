type Item = { type: string; material?: string; cursed?: boolean; enchantment?: number };
type Damage = { itemType: string; amount: number };
type Incident = { cause: string; damages: Damage[] };
type QuoteStep = { op: "quote"; items: Item[] };
type ClaimStep = { op: "claim"; policy: number; incident: Incident };
type Step = QuoteStep | ClaimStep;
type Customer = { yearsWithMHPCO: number };
type Input = { customer: Customer; steps: Step[] };

const PROCESSING_FEE = 5;
const FIRST_INSURANCE_SURCHARGE_PERCENT = 10;
const CURSE_SURCHARGE_PERCENT = 50;
const HIGH_ENCHANTMENT_THRESHOLD = 5;
const HIGH_ENCHANTMENT_SURCHARGE_PERCENT = 30;
const LOYALTY_THRESHOLD_YEARS = 2;
const LOYALTY_DISCOUNT_PERCENT = 20;
const FOLLOWUP_CONTRACT_DISCOUNT_PERCENT = 15;
const COMPONENT_BLOCK_SIZE = 3;
const COMPONENT_BLOCK_PREMIUM = 60;
const DEDUCTIBLE = 100;
const CAP_MULTIPLIER = 2;
const HIGH_ENCHANTMENT_CLAIM_THRESHOLD = 8;
const HIGH_ENCHANTMENT_CLAIM_PERCENT = 50;

const INSURANCE_VALUE_BY_TYPE: Record<string, number> = {
  sword: 1000,
  amulet: 600,
  staff: 800,
  potion: 400,
  rune: 250,
  moonstone: 250,
};

const BASE_PREMIUM_BY_TYPE: Record<string, number> = {
  sword: 100,
  amulet: 60,
  staff: 80,
  potion: 40,
  rune: 25,
  moonstone: 25,
};

const COMPONENT_TYPES = new Set(["rune", "moonstone"]);

const groupBaseAmount = (type: string, count: number): number => {
  if (COMPONENT_TYPES.has(type) && count === COMPONENT_BLOCK_SIZE) {
    return COMPONENT_BLOCK_PREMIUM;
  }
  return count * BASE_PREMIUM_BY_TYPE[type];
};

const frequencyMap = <T>(values: T[], keyOf: (value: T) => string): Map<string, number> =>
  values.reduce(
    (counts, value) => {
      const key = keyOf(value);
      return counts.set(key, (counts.get(key) ?? 0) + 1);
    },
    new Map<string, number>(),
  );

const countByType = (items: Item[]): Map<string, number> =>
  frequencyMap(items, (item) => item.type);

const basePremium = (items: Item[]): number =>
  Array.from(countByType(items)).reduce(
    (total, [type, count]) => total + groupBaseAmount(type, count),
    0,
  );

const percentOf = (amount: number, percent: number): number =>
  (amount * percent) / 100;

const percentOfItemBase = (item: Item, percent: number): number =>
  percentOf(BASE_PREMIUM_BY_TYPE[item.type], percent);

const firstInsuranceSurcharge = (base: number): number =>
  percentOf(base, FIRST_INSURANCE_SURCHARGE_PERCENT);

const enchantmentAtLeast = (item: Item, threshold: number): boolean =>
  (item.enchantment ?? 0) >= threshold;

type ItemSurchargeRule = { applies: (item: Item) => boolean; percent: number };

const ITEM_SURCHARGE_RULES: ItemSurchargeRule[] = [
  { applies: (item) => item.cursed === true, percent: CURSE_SURCHARGE_PERCENT },
  { applies: (item) => enchantmentAtLeast(item, HIGH_ENCHANTMENT_THRESHOLD), percent: HIGH_ENCHANTMENT_SURCHARGE_PERCENT },
];

const surchargesForItem = (item: Item): number =>
  ITEM_SURCHARGE_RULES.reduce(
    (sum, { applies, percent }) => sum + (applies(item) ? percentOfItemBase(item, percent) : 0),
    0,
  );

const itemSurcharges = (items: Item[]): number =>
  items.reduce((sum, item) => sum + surchargesForItem(item), 0);

type PolicyContext = { customer: Customer; stepIndex: number };
type PolicyDiscountRule = { applies: (ctx: PolicyContext) => boolean; percent: number };

const POLICY_DISCOUNT_RULES: PolicyDiscountRule[] = [
  { applies: ({ customer }) => customer.yearsWithMHPCO >= LOYALTY_THRESHOLD_YEARS, percent: LOYALTY_DISCOUNT_PERCENT },
  { applies: ({ stepIndex }) => stepIndex > 0, percent: FOLLOWUP_CONTRACT_DISCOUNT_PERCENT },
];

const policyDiscounts = (base: number, ctx: PolicyContext): number =>
  POLICY_DISCOUNT_RULES.reduce(
    (sum, { applies, percent }) => sum + (applies(ctx) ? percentOf(base, percent) : 0),
    0,
  );

const quotePremium = (items: Item[], ctx: PolicyContext): number => {
  const base = basePremium(items);
  const surcharges = itemSurcharges(items) + firstInsuranceSurcharge(base);
  const discounts = policyDiscounts(base, ctx);
  return Math.ceil(base + surcharges - discounts + PROCESSING_FEE);
};

const insuranceSum = (items: Item[]): number =>
  items.reduce((sum, { type }) => sum + INSURANCE_VALUE_BY_TYPE[type], 0);

const policyCap = (items: Item[]): number => CAP_MULTIPLIER * insuranceSum(items);

const reimbursableAmount = (amount: number, item: Item): number =>
  enchantmentAtLeast(item, HIGH_ENCHANTMENT_CLAIM_THRESHOLD)
    ? percentOf(amount, HIGH_ENCHANTMENT_CLAIM_PERCENT)
    : amount;

const damagePayout = (amount: number, item: Item): number =>
  Math.max(0, reimbursableAmount(amount, item) - DEDUCTIBLE);

const findInsuredItem = (items: Item[], itemType: string): Item => {
  const item = items.find((i) => i.type === itemType);
  if (!item) throw new Error(`item type ${itemType} not in policy`);
  return item;
};

const validateDamageCounts = (damages: Damage[], items: Item[]): void => {
  const insuredCounts = countByType(items);
  const damageCounts = frequencyMap(damages, (damage) => damage.itemType);
  for (const [itemType, count] of damageCounts) {
    if (count > (insuredCounts.get(itemType) ?? 0)) {
      throw new Error(`more ${itemType} damages than insured`);
    }
  }
};

const validateDamageAmounts = (damages: Damage[]): void => {
  const negative = damages.find((damage) => damage.amount < 0);
  if (negative) {
    throw new Error(`negative damage amount: ${negative.amount}`);
  }
};

const totalRequestedPayout = (damages: Damage[], items: Item[]): number => {
  validateDamageAmounts(damages);
  validateDamageCounts(damages, items);
  return damages.reduce(
    (sum, { itemType, amount }) => sum + damagePayout(amount, findInsuredItem(items, itemType)),
    0,
  );
};

type Policy = { items: Item[]; remainingCap: number };

type StepResult = { premium: number } | { payout: number; remainingCap: number };

const validateItemTypes = (items: Item[]): void => {
  const unknown = items.find((item) => !(item.type in BASE_PREMIUM_BY_TYPE));
  if (unknown) {
    throw new Error(`unknown item type: ${unknown.type}`);
  }
};

const processQuote = (step: QuoteStep, ctx: PolicyContext, policies: Policy[]): StepResult => {
  validateItemTypes(step.items);
  policies.push({ items: step.items, remainingCap: policyCap(step.items) });
  return { premium: quotePremium(step.items, ctx) };
};

const processClaim = (step: ClaimStep, policies: Policy[]): StepResult => {
  const policy = policies[step.policy];
  const requested = totalRequestedPayout(step.incident.damages, policy.items);
  const payout = Math.floor(Math.min(requested, policy.remainingCap));
  policy.remainingCap -= payout;
  return { payout, remainingCap: policy.remainingCap };
};

export const run = (input: unknown): unknown => {
  const { customer, steps } = input as Input;
  const policies: Policy[] = [];
  const results = steps.map((step, stepIndex): StepResult =>
    step.op === "quote"
      ? processQuote(step, { customer, stepIndex }, policies)
      : processClaim(step, policies),
  );
  return { results };
};
