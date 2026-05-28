const PROCESSING_FEE = 5;
const FIRST_INSURANCE_SURCHARGE_RATE = 0.1;
const CURSED_SURCHARGE_RATE = 0.5;
const HIGH_ENCHANTMENT_SURCHARGE_RATE = 0.3;
const HIGH_ENCHANTMENT_THRESHOLD = 5;
const LOYALTY_DISCOUNT_RATE = 0.2;
const LOYALTY_YEARS_THRESHOLD = 2;
const FOLLOW_UP_DISCOUNT_RATE = 0.15;
const BLOCK_SIZE = 3;
const BLOCK_PREMIUM = 60;

const BASE_PREMIUMS: Record<string, number> = {
  sword: 100,
  amulet: 60,
  staff: 80,
  potion: 40,
  rune: 25,
  moonstone: 25,
};

const COMPONENT_TYPES = new Set(["rune", "moonstone"]);

const INSURANCE_VALUE_MULTIPLIER = 10;
const insuranceValueFor = (type: string): number => BASE_PREMIUMS[type] * INSURANCE_VALUE_MULTIPLIER;
const DEDUCTIBLE = 100;
const HIGH_ENCHANTMENT_PAYOUT_THRESHOLD = 8;
const HIGH_ENCHANTMENT_PAYOUT_RATE = 0.5;
const CAP_MULTIPLIER = 2;

type Item = { type: string; cursed?: boolean; enchantment?: number };
type QuoteStep = { op: "quote"; items: Array<Item> };
type Damage = { itemType: string; amount: number };
type ClaimStep = { op: "claim"; policy: number; incident: { cause: string; damages: Array<Damage> } };
type Step = QuoteStep | ClaimStep;
type Customer = { yearsWithMHPCO: number };
type Scenario = { customer: Customer; steps: Array<Step> };
type Policy = { items: Array<Item>; remainingCap: number };

const sum = (xs: number[]): number => xs.reduce((a, b) => a + b, 0);

const countBy = <T>(items: T[], keyOf: (item: T) => string): Record<string, number> => {
  const counts: Record<string, number> = {};
  for (const item of items) {
    const key = keyOf(item);
    counts[key] = (counts[key] ?? 0) + 1;
  }
  return counts;
};

const typeOf = (item: Item): string => item.type;
const damageTypeOf = (damage: Damage): string => damage.itemType;

const qualifiesForBlockDiscount = (type: string, count: number): boolean =>
  COMPONENT_TYPES.has(type) && count === BLOCK_SIZE;

const subtotalForType = (type: string, count: number): number =>
  qualifiesForBlockDiscount(type, count) ? BLOCK_PREMIUM : count * BASE_PREMIUMS[type];

const policyBaseFor = (items: Item[]): number =>
  sum(Object.entries(countBy(items, typeOf)).map(([type, count]) => subtotalForType(type, count)));

const hasEnchantmentAtLeast = (item: Item, threshold: number): boolean =>
  (item.enchantment ?? 0) >= threshold;

const isHighlyEnchanted = (item: Item): boolean =>
  hasEnchantmentAtLeast(item, HIGH_ENCHANTMENT_THRESHOLD);

const surchargeRate = (item: Item): number =>
  (item.cursed ? CURSED_SURCHARGE_RATE : 0) +
  (isHighlyEnchanted(item) ? HIGH_ENCHANTMENT_SURCHARGE_RATE : 0);

const itemSurcharge = (item: Item): number => BASE_PREMIUMS[item.type] * surchargeRate(item);

const itemSurchargesFor = (items: Item[]): number => sum(items.map(itemSurcharge));

const qualifiesForLoyaltyDiscount = (customer: Customer): boolean =>
  customer.yearsWithMHPCO >= LOYALTY_YEARS_THRESHOLD;

const loyaltyDiscountFor = (policyBase: number, customer: Customer): number =>
  qualifiesForLoyaltyDiscount(customer) ? policyBase * LOYALTY_DISCOUNT_RATE : 0;

const firstInsuranceSurchargeFor = (policyBase: number): number =>
  policyBase * FIRST_INSURANCE_SURCHARGE_RATE;

const followUpDiscountFor = (policyBase: number, quoteIndex: number): number =>
  quoteIndex > 0 ? policyBase * FOLLOW_UP_DISCOUNT_RATE : 0;

const quotePremium = ({ items }: QuoteStep, customer: Customer, quoteIndex: number): number => {
  const policyBase = policyBaseFor(items);
  const surcharges = itemSurchargesFor(items) + firstInsuranceSurchargeFor(policyBase);
  const discounts = loyaltyDiscountFor(policyBase, customer) + followUpDiscountFor(policyBase, quoteIndex);
  return Math.ceil(policyBase + surcharges - discounts + PROCESSING_FEE);
};

const insuranceSumFor = (items: Item[]): number =>
  sum(items.map((item) => insuranceValueFor(item.type)));

const payoutRateFor = (item: Item): number =>
  hasEnchantmentAtLeast(item, HIGH_ENCHANTMENT_PAYOUT_THRESHOLD) ? HIGH_ENCHANTMENT_PAYOUT_RATE : 1;

const insuredItemOfType = (policy: Policy, itemType: string): Item =>
  policy.items.find((i) => i.type === itemType)!;

const payoutForDamage = (damage: Damage, policy: Policy): number =>
  Math.floor(damage.amount * payoutRateFor(insuredItemOfType(policy, damage.itemType)) - DEDUCTIBLE);

const validateNonNegativeAmounts = (damages: Damage[]): void => {
  const negative = damages.find((d) => d.amount < 0);
  if (negative) throw new Error(`Damage amount must be non-negative`);
};

const validateDamageCounts = (damages: Damage[], policy: Policy): void => {
  const insuredCounts = countBy(policy.items, typeOf);
  const overclaimed = Object.entries(countBy(damages, damageTypeOf))
    .find(([type, count]) => count > (insuredCounts[type] ?? 0));
  if (overclaimed) throw new Error(`Damage count for '${overclaimed[0]}' exceeds insured count`);
};

const validateDamages = (damages: Damage[], policy: Policy): void => {
  validateNonNegativeAmounts(damages);
  validateDamageCounts(damages, policy);
};

const claimedPayoutFor = (damages: Damage[], policy: Policy): number =>
  sum(damages.map((d) => payoutForDamage(d, policy)));

const processClaim = (step: ClaimStep, policies: Policy[]): { payout: number; remainingCap: number } => {
  const policy = policies[step.policy];
  const { damages } = step.incident;
  validateDamages(damages, policy);
  const payout = Math.min(claimedPayoutFor(damages, policy), policy.remainingCap);
  policy.remainingCap -= payout;
  return { payout, remainingCap: policy.remainingCap };
};

const capFor = (items: Item[]): number => insuranceSumFor(items) * CAP_MULTIPLIER;

const newPolicy = (items: Item[]): Policy =>
  ({ items, remainingCap: capFor(items) });

const isKnownItemType = (type: string): boolean => type in BASE_PREMIUMS;

const validateItemTypes = (items: Item[]): void => {
  const unknown = items.find((item) => !isKnownItemType(item.type));
  if (unknown) throw new Error(`Unknown item type: '${unknown.type}'`);
};

const processQuote = (step: QuoteStep, customer: Customer, policies: Policy[]): { premium: number } => {
  validateItemTypes(step.items);
  const premium = quotePremium(step, customer, policies.length);
  policies.push(newPolicy(step.items));
  return { premium };
};

export const runScenario = (input: unknown): unknown => {
  const scenario = input as Scenario;
  const policies: Policy[] = [];
  const results = scenario.steps.map((step) =>
    step.op === "quote"
      ? processQuote(step, scenario.customer, policies)
      : processClaim(step, policies)
  );
  return { results };
};
