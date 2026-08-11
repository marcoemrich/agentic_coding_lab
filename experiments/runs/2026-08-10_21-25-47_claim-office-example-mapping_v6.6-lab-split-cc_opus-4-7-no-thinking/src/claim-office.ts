const PROCESSING_FEE = 5;
const FIRST_INSURANCE_SURCHARGE_RATE = 0.1;
const CURSE_SURCHARGE_RATE = 0.5;
const HIGH_ENCHANTMENT_SURCHARGE_RATE = 0.3;
const HIGH_ENCHANTMENT_THRESHOLD = 5;
const LOYALTY_DISCOUNT_RATE = 0.2;
const LOYALTY_YEARS_THRESHOLD = 2;
const FOLLOW_UP_DISCOUNT_RATE = 0.15;

const COMPONENT_BASE_PREMIUM = 25;
const BLOCK_SIZE = 3;
const BLOCK_PREMIUM = 60;

const DEDUCTIBLE = 100;
const CAP_MULTIPLIER = 2;
const REIMBURSEMENT_HIGH_ENCHANTMENT_THRESHOLD = 8;
const REIMBURSEMENT_HIGH_ENCHANTMENT_RATE = 0.5;

const FLOAT_PRECISION_SCALE = 1e6;

const BASE_PREMIUM: Record<string, number> = {
  sword: 100,
  amulet: 60,
  staff: 80,
  potion: 40,
  rune: COMPONENT_BASE_PREMIUM,
  moonstone: COMPONENT_BASE_PREMIUM,
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

type Item = { type: string; cursed?: boolean; enchantment?: number; material?: string };
type Customer = { yearsWithMHPCO: number };
type Damage = { itemType: string; amount: number };
type QuoteStep = { op: "quote"; items: Item[] };
type ClaimStep = {
  op: "claim";
  policy: number;
  incident: { cause: string; damages: Damage[] };
};
type Step = QuoteStep | ClaimStep;
type Scenario = { customer: Customer; steps: Step[] };

type QuoteResult = { premium: number };
type ClaimResult = { payout: number; remainingCap: number };
type StepResult = QuoteResult | ClaimResult;

type PolicyState = { items: Item[]; remainingCap: number };

const countBy = <T>(values: T[], key: (value: T) => string): Map<string, number> =>
  values.reduce(
    (counts, value) => counts.set(key(value), (counts.get(key(value)) ?? 0) + 1),
    new Map<string, number>(),
  );

const countsByType = (items: Item[]): Map<string, number> =>
  countBy(items, (item) => item.type);

const groupBase = (type: string, count: number): number =>
  COMPONENT_TYPES.has(type) && count === BLOCK_SIZE
    ? BLOCK_PREMIUM
    : count * BASE_PREMIUM[type];

const itemsBase = (items: Item[]): number =>
  [...countsByType(items)].reduce(
    (total, [type, count]) => total + groupBase(type, count),
    0,
  );

const isCursed = (item: Item): boolean => item.cursed === true;
const isHighlyEnchanted = (item: Item): boolean =>
  (item.enchantment ?? 0) >= HIGH_ENCHANTMENT_THRESHOLD;

const SURCHARGE_RULES: Array<{ applies: (item: Item) => boolean; rate: number }> = [
  { applies: isCursed, rate: CURSE_SURCHARGE_RATE },
  { applies: isHighlyEnchanted, rate: HIGH_ENCHANTMENT_SURCHARGE_RATE },
];

const itemSurcharge = (item: Item): number => {
  const base = BASE_PREMIUM[item.type];
  return SURCHARGE_RULES.reduce(
    (sum, rule) => sum + (rule.applies(item) ? base * rule.rate : 0),
    0,
  );
};

const itemSurchargesTotal = (items: Item[]): number =>
  items.reduce((sum, item) => sum + itemSurcharge(item), 0);

const normalizePrecision = (amount: number): number =>
  Math.round(amount * FLOAT_PRECISION_SCALE) / FLOAT_PRECISION_SCALE;

const roundUpInFavorOfInsurer = (amount: number): number =>
  Math.ceil(normalizePrecision(amount));

const roundDownInFavorOfInsurer = (amount: number): number =>
  Math.floor(normalizePrecision(amount));

const isLoyal = (customer: Customer): boolean =>
  customer.yearsWithMHPCO >= LOYALTY_YEARS_THRESHOLD;

const loyaltyDiscount = (customer: Customer, policyBase: number): number =>
  isLoyal(customer) ? policyBase * LOYALTY_DISCOUNT_RATE : 0;

const firstInsuranceSurcharge = (policyBase: number): number =>
  policyBase * FIRST_INSURANCE_SURCHARGE_RATE;

const followUpDiscount = (policyBase: number, isFollowUp: boolean): number =>
  isFollowUp ? policyBase * FOLLOW_UP_DISCOUNT_RATE : 0;

const validateItems = (items: Item[]): void => {
  const unknown = items.find((item) => !(item.type in BASE_PREMIUM));
  if (unknown) throw new Error(`unknown item type: ${unknown.type}`);
};

const quotePremium = (items: Item[], customer: Customer, isFollowUp: boolean): number => {
  validateItems(items);
  const policyBase = itemsBase(items);
  return roundUpInFavorOfInsurer(
    policyBase +
      itemSurchargesTotal(items) +
      firstInsuranceSurcharge(policyBase) -
      loyaltyDiscount(customer, policyBase) -
      followUpDiscount(policyBase, isFollowUp) +
      PROCESSING_FEE,
  );
};

const insuranceSum = (items: Item[]): number =>
  items.reduce((sum, item) => sum + INSURANCE_VALUE[item.type], 0);

const createPolicy = (items: Item[]): PolicyState => ({
  items,
  remainingCap: insuranceSum(items) * CAP_MULTIPLIER,
});

const reimbursementRate = (item: Item): number =>
  (item.enchantment ?? 0) >= REIMBURSEMENT_HIGH_ENCHANTMENT_THRESHOLD
    ? REIMBURSEMENT_HIGH_ENCHANTMENT_RATE
    : 1;

const damagePayout = (damage: Damage, damagedItem: Item): number =>
  damage.amount * reimbursementRate(damagedItem) - DEDUCTIBLE;

const findDamagedItem = (policy: PolicyState, itemType: string): Item =>
  policy.items.find((i) => i.type === itemType)!;

const payoutForDamage = (policy: PolicyState, damage: Damage): number =>
  damagePayout(damage, findDamagedItem(policy, damage.itemType));

const rejectNegativeDamages = (damages: Damage[]): void => {
  const negative = damages.find((damage) => damage.amount < 0);
  if (negative) throw new Error(`negative damage amount: ${negative.amount}`);
};

const rejectOverCountedDamages = (damages: Damage[], policy: PolicyState): void => {
  const damageCounts = countBy(damages, (damage) => damage.itemType);
  const insuredCounts = countsByType(policy.items);
  damageCounts.forEach((count, type) => {
    if (count > (insuredCounts.get(type) ?? 0)) {
      throw new Error(`damage for ${type} exceeds insured count`);
    }
  });
};

const validateDamages = (damages: Damage[], policy: PolicyState): void => {
  rejectNegativeDamages(damages);
  rejectOverCountedDamages(damages, policy);
};

const totalDesiredPayout = (policy: PolicyState, damages: Damage[]): number =>
  damages.reduce((sum, damage) => sum + payoutForDamage(policy, damage), 0);

const settleClaim = (policy: PolicyState, damages: Damage[]): ClaimResult => {
  validateDamages(damages, policy);
  const desired = totalDesiredPayout(policy, damages);
  const payout = roundDownInFavorOfInsurer(Math.min(desired, policy.remainingCap));
  policy.remainingCap -= payout;
  return { payout, remainingCap: policy.remainingCap };
};

export const runScenario = (scenario: unknown): unknown => {
  const { customer, steps } = scenario as Scenario;
  const policies = new Map<number, PolicyState>();
  let quoteCount = 0;

  const runQuote = (step: QuoteStep, index: number): QuoteResult => {
    const isFollowUp = quoteCount++ > 0;
    policies.set(index, createPolicy(step.items));
    return { premium: quotePremium(step.items, customer, isFollowUp) };
  };

  const runClaim = (step: ClaimStep): ClaimResult =>
    settleClaim(policies.get(step.policy)!, step.incident.damages);

  const results: StepResult[] = steps.map((step, index) =>
    step.op === "claim" ? runClaim(step) : runQuote(step, index),
  );
  return { results };
};
