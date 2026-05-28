const PROCESSING_FEE = 5;
const FIRST_INSURANCE_RATE = 0.1;
const CURSE_RATE = 0.5;
const HIGH_ENCHANTMENT_THRESHOLD = 5;
const HIGH_ENCHANTMENT_RATE = 0.3;
const LOYALTY_THRESHOLD_YEARS = 2;
const LOYALTY_RATE = 0.2;
const FOLLOW_UP_RATE = 0.15;
const BLOCK_SIZE = 3;
const BLOCK_PREMIUM = 60;
const DEDUCTIBLE = 100;
const CAP_MULTIPLIER = 2;
const HIGH_ENCHANTMENT_CLAIM_THRESHOLD = 8;
const HIGH_ENCHANTMENT_CLAIM_RATE = 0.5;

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

type Item = {
  type: string;
  material?: string;
  enchantment?: number;
  cursed?: boolean;
};
type Damage = { itemType: string; amount: number };
type Incident = { cause: string; damages: Damage[] };
type QuoteStep = { op: "quote"; items: Item[] };
type ClaimStep = { op: "claim"; policy: number; incident: Incident };
type Step = QuoteStep | ClaimStep;
type Customer = { yearsWithMHPCO: number };
type Scenario = { customer: Customer; steps: Step[] };
type QuoteResult = { premium: number };
type ClaimResult = { payout: number; remainingCap: number };
type StepResult = QuoteResult | ClaimResult;
type ScenarioOutput = { results: StepResult[] };

type Policy = { items: Item[]; remainingCap: number };

const countBy = <T>(values: T[], keyOf: (value: T) => string): Map<string, number> => {
  const counts = new Map<string, number>();
  for (const value of values) {
    const key = keyOf(value);
    counts.set(key, (counts.get(key) ?? 0) + 1);
  }
  return counts;
};

const groupCountsByType = (items: Item[]): Map<string, number> =>
  countBy(items, (item) => item.type);

const basePremiumForGroup = (type: string, count: number): number => {
  if (!(type in BASE_PREMIUM)) {
    throw new Error(`unknown item type: ${type}`);
  }
  if (count === BLOCK_SIZE) return BLOCK_PREMIUM;
  return count * BASE_PREMIUM[type];
};

const basePremiumFor = (items: Item[]): number =>
  Array.from(groupCountsByType(items)).reduce(
    (total, [type, count]) => total + basePremiumForGroup(type, count),
    0,
  );

const curseSurchargeFor = (item: Item): number =>
  item.cursed ? BASE_PREMIUM[item.type] * CURSE_RATE : 0;

const highEnchantmentSurchargeFor = (item: Item): number =>
  (item.enchantment ?? 0) >= HIGH_ENCHANTMENT_THRESHOLD
    ? BASE_PREMIUM[item.type] * HIGH_ENCHANTMENT_RATE
    : 0;

const ITEM_SURCHARGES: Array<(item: Item) => number> = [
  curseSurchargeFor,
  highEnchantmentSurchargeFor,
];

const surchargesForItem = (item: Item): number =>
  ITEM_SURCHARGES.reduce((sum, surcharge) => sum + surcharge(item), 0);

const itemSurchargesFor = (items: Item[]): number =>
  items.reduce((sum, item) => sum + surchargesForItem(item), 0);

const firstInsuranceSurchargeFor = (basePremium: number): number =>
  basePremium * FIRST_INSURANCE_RATE;

const loyaltyDiscountFor = (basePremium: number, customer: Customer): number =>
  customer.yearsWithMHPCO >= LOYALTY_THRESHOLD_YEARS
    ? basePremium * LOYALTY_RATE
    : 0;

const followUpDiscountFor = (basePremium: number, isFollowUp: boolean): number =>
  isFollowUp ? basePremium * FOLLOW_UP_RATE : 0;

const premiumFor = (items: Item[], customer: Customer, isFollowUp: boolean): number => {
  const basePremium = basePremiumFor(items);
  const surcharges =
    itemSurchargesFor(items) + firstInsuranceSurchargeFor(basePremium);
  const discounts =
    loyaltyDiscountFor(basePremium, customer) +
    followUpDiscountFor(basePremium, isFollowUp);
  return Math.ceil(basePremium + surcharges - discounts + PROCESSING_FEE);
};

const insuranceSumFor = (items: Item[]): number =>
  items.reduce((sum, { type }) => sum + INSURANCE_VALUE[type], 0);

const reimbursableAmountFor = (item: Item, damageAmount: number): number =>
  (item.enchantment ?? 0) >= HIGH_ENCHANTMENT_CLAIM_THRESHOLD
    ? damageAmount * HIGH_ENCHANTMENT_CLAIM_RATE
    : damageAmount;

const insuredItemFor = (damage: Damage, policy: Policy): Item =>
  policy.items.find((item) => item.type === damage.itemType)!;

const payoutForDamage = (damage: Damage, policy: Policy): number => {
  const reimbursable = reimbursableAmountFor(insuredItemFor(damage, policy), damage.amount);
  return Math.max(0, reimbursable - DEDUCTIBLE);
};

const rejectNegativeAmounts = (damages: Damage[]): void => {
  const negative = damages.find((damage) => damage.amount < 0);
  if (negative) {
    throw new Error(`negative damage amount: ${negative.amount}`);
  }
};

const rejectClaimsExceedingInsured = (damages: Damage[], policy: Policy): void => {
  const insuredCounts = groupCountsByType(policy.items);
  const damageCounts = countBy(damages, (damage) => damage.itemType);
  for (const [type, count] of damageCounts) {
    if (count > (insuredCounts.get(type) ?? 0)) {
      throw new Error(`claim references more ${type} items than insured`);
    }
  }
};

const validateDamages = (damages: Damage[], policy: Policy): void => {
  rejectNegativeAmounts(damages);
  rejectClaimsExceedingInsured(damages, policy);
};

const handleClaim = (
  { policy: policyIndex, incident }: ClaimStep,
  policies: Policy[],
): ClaimResult => {
  const policy = policies[policyIndex];
  validateDamages(incident.damages, policy);
  const grossPayout = incident.damages.reduce(
    (sum, damage) => sum + payoutForDamage(damage, policy),
    0,
  );
  const payout = Math.floor(Math.min(grossPayout, policy.remainingCap));
  policy.remainingCap -= payout;
  return { payout, remainingCap: policy.remainingCap };
};

const openPolicy = (items: Item[]): Policy => ({
  items,
  remainingCap: insuranceSumFor(items) * CAP_MULTIPLIER,
});

const handleQuote = (
  { items }: QuoteStep,
  customer: Customer,
  policies: Policy[],
): QuoteResult => {
  const isFollowUp = policies.length > 0;
  policies.push(openPolicy(items));
  return { premium: premiumFor(items, customer, isFollowUp) };
};

export const runScenario = (input: Scenario): ScenarioOutput => {
  const policies: Policy[] = [];
  const results: StepResult[] = input.steps.map((step) =>
    step.op === "quote"
      ? handleQuote(step, input.customer, policies)
      : handleClaim(step, policies),
  );
  return { results };
};
