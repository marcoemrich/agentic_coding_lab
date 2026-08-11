const PROCESSING_FEE = 5;
const FIRST_INSURANCE_SURCHARGE_RATE = 0.1;
const CURSE_SURCHARGE_RATE = 0.5;
const HIGH_ENCHANTMENT_SURCHARGE_RATE = 0.3;
const HIGH_ENCHANTMENT_THRESHOLD = 5;
const LOYALTY_DISCOUNT_RATE = 0.2;
const LOYALTY_THRESHOLD_YEARS = 2;
const FOLLOWUP_CONTRACT_DISCOUNT_RATE = 0.15;
const COMPONENT_BLOCK_BASE = 60;
const COMPONENT_BLOCK_SIZE = 3;
const DEDUCTIBLE_PER_DAMAGE = 100;
const CAP_MULTIPLIER = 2;
const HIGH_ENCHANTMENT_PAYOUT_THRESHOLD = 8;
const HIGH_ENCHANTMENT_PAYOUT_RATE = 0.5;

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

type Item = { type: string; cursed?: boolean; enchantment?: number; material?: string };
type Customer = { yearsWithMHPCO: number };
type QuoteStep = { op: "quote"; items: Item[] };
type Damage = { itemType: string; amount: number };
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

type Policy = { items: Item[]; remainingCap: number };

const countBy = <T>(values: T[], keyOf: (value: T) => string): Map<string, number> =>
  values.reduce((counts, value) => {
    const key = keyOf(value);
    return counts.set(key, (counts.get(key) ?? 0) + 1);
  }, new Map<string, number>());

const countByType = (items: Item[]): Map<string, number> =>
  countBy(items, (item) => item.type);

const basePremiumForGroup = (type: string, count: number): number =>
  COMPONENT_TYPES.has(type) && count === COMPONENT_BLOCK_SIZE
    ? COMPONENT_BLOCK_BASE
    : count * BASE_PREMIUM[type];

const basePremiumForItems = (items: Item[]): number =>
  [...countByType(items)].reduce(
    (sum, [type, count]) => sum + basePremiumForGroup(type, count),
    0,
  );

const enchantmentLevel = (item: Item): number => item.enchantment ?? 0;

const surchargeRateForItem = (item: Item): number =>
  (item.cursed ? CURSE_SURCHARGE_RATE : 0) +
  (enchantmentLevel(item) >= HIGH_ENCHANTMENT_THRESHOLD ? HIGH_ENCHANTMENT_SURCHARGE_RATE : 0);

const itemSurcharges = (items: Item[]): number =>
  items.reduce(
    (sum, item) => sum + BASE_PREMIUM[item.type] * surchargeRateForItem(item),
    0,
  );

const roundUpForInsurer = (premium: number): number => Math.ceil(premium);
const roundDownForInsurer = (payout: number): number => Math.floor(payout);

const loyaltyDiscountRate = (customer: Customer): number =>
  customer.yearsWithMHPCO >= LOYALTY_THRESHOLD_YEARS ? LOYALTY_DISCOUNT_RATE : 0;

const followupDiscountRate = (quoteIndex: number): number =>
  quoteIndex > 0 ? FOLLOWUP_CONTRACT_DISCOUNT_RATE : 0;

const withPolicyWideModifiers = (
  base: number,
  customer: Customer,
  quoteIndex: number,
): number =>
  base +
  base * FIRST_INSURANCE_SURCHARGE_RATE -
  base * loyaltyDiscountRate(customer) -
  base * followupDiscountRate(quoteIndex);

const quotePremium = (
  items: Item[],
  customer: Customer,
  quoteIndex: number,
): number =>
  roundUpForInsurer(
    withPolicyWideModifiers(basePremiumForItems(items), customer, quoteIndex) +
      itemSurcharges(items),
  ) + PROCESSING_FEE;

const insuranceSumFor = (items: Item[]): number =>
  items.reduce((sum, item) => sum + INSURANCE_VALUE[item.type], 0);

const initialCapFor = (items: Item[]): number =>
  insuranceSumFor(items) * CAP_MULTIPLIER;

const policyFrom = (items: Item[]): Policy => ({
  items,
  remainingCap: initialCapFor(items),
});

const reimbursementRateFor = (item: Item): number =>
  enchantmentLevel(item) >= HIGH_ENCHANTMENT_PAYOUT_THRESHOLD ? HIGH_ENCHANTMENT_PAYOUT_RATE : 1;

const payoutForDamage = (item: Item, amount: number): number =>
  roundDownForInsurer(Math.max(0, amount * reimbursementRateFor(item) - DEDUCTIBLE_PER_DAMAGE));

const findInsuredItem = (items: Item[], itemType: string): Item =>
  items.find((item) => item.type === itemType)!;

const totalPayoutFor = ({ items }: Policy, damages: Damage[]): number =>
  damages.reduce(
    (sum, { itemType, amount }) => sum + payoutForDamage(findInsuredItem(items, itemType), amount),
    0,
  );

const validateDamageAmounts = (damages: Damage[]): void => {
  damages.forEach(({ amount }) => {
    if (amount < 0) {
      throw new Error(`Damage amount must be non-negative`);
    }
  });
};

const validateDamageCounts = (policy: Policy, damages: Damage[]): void => {
  const insuredCounts = countByType(policy.items);
  countBy(damages, (damage) => damage.itemType).forEach((damageCount, itemType) => {
    if (damageCount > (insuredCounts.get(itemType) ?? 0)) {
      throw new Error(`Damage entries for ${itemType} exceed insured count`);
    }
  });
};

const validateDamages = (policy: Policy, damages: Damage[]): void => {
  validateDamageAmounts(damages);
  validateDamageCounts(policy, damages);
};

const applyClaim = (policy: Policy, damages: Damage[]): ClaimResult => {
  validateDamages(policy, damages);
  const payout = Math.min(totalPayoutFor(policy, damages), policy.remainingCap);
  return { payout, remainingCap: policy.remainingCap - payout };
};

const validateItemTypes = (items: Item[]): void => {
  items.forEach((item) => {
    if (!(item.type in BASE_PREMIUM)) {
      throw new Error(`Unknown item type: ${item.type}`);
    }
  });
};

const handleQuote = (
  { items }: QuoteStep,
  customer: Customer,
  policies: Map<number, Policy>,
  index: number,
): QuoteResult => {
  validateItemTypes(items);
  const premium = quotePremium(items, customer, policies.size);
  policies.set(index, policyFrom(items));
  return { premium };
};

const handleClaim = (
  step: ClaimStep,
  policies: Map<number, Policy>,
): ClaimResult => {
  const policy = policies.get(step.policy)!;
  const result = applyClaim(policy, step.incident.damages);
  policies.set(step.policy, { ...policy, remainingCap: result.remainingCap });
  return result;
};

export const runScenario = ({ customer, steps }: Scenario): { results: StepResult[] } => {
  const policies = new Map<number, Policy>();
  const results = steps.map((step, index) =>
    step.op === "quote"
      ? handleQuote(step, customer, policies, index)
      : handleClaim(step, policies),
  );
  return { results };
};
