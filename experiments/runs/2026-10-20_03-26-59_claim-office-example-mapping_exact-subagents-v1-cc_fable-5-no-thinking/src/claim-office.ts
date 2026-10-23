export type Customer = {
  yearsWithMHPCO: number;
};

export type Item = {
  type: string;
  material?: string;
  cursed?: boolean;
  enchantment?: number;
};

const PROCESSING_FEE = 5;

const COMPONENT_BASE_PREMIUM = 25;

const BASE_PREMIUMS: Record<string, number> = {
  sword: 100,
  amulet: 60,
  staff: 80,
  potion: 40,
  rune: COMPONENT_BASE_PREMIUM,
  moonstone: COMPONENT_BASE_PREMIUM,
};

const basePremiumFor = (type: string): number => {
  const basePremium = BASE_PREMIUMS[type];
  if (basePremium === undefined) {
    throw new Error(`Unknown item type: ${type}`);
  }
  return basePremium;
};

const COMPONENT_BLOCK_PREMIUM = 60;
const COMPONENT_BLOCK_SIZE = 3;

const countOccurrences = (values: string[]): Map<string, number> => {
  const counts = new Map<string, number>();
  for (const value of values) {
    counts.set(value, (counts.get(value) ?? 0) + 1);
  }
  return counts;
};

const countByType = (items: Item[]): Map<string, number> =>
  countOccurrences(items.map((item) => item.type));

const premiumForGroup = (type: string, count: number): number => {
  const basePremium = basePremiumFor(type);
  const isComponentBlock =
    basePremium === COMPONENT_BASE_PREMIUM && count === COMPONENT_BLOCK_SIZE;
  if (isComponentBlock) {
    return COMPONENT_BLOCK_PREMIUM;
  }
  return count * basePremium;
};

const totalBasePremiumFor = (items: Item[]): number =>
  [...countByType(items)].reduce(
    (total, [type, count]) => total + premiumForGroup(type, count),
    0,
  );

const surchargeFor = (
  items: Item[],
  applies: (item: Item) => boolean,
  rate: number,
): number =>
  items
    .filter(applies)
    .reduce(
      (surcharge, item) => surcharge + basePremiumFor(item.type) * rate,
      0,
    );

const CURSE_SURCHARGE_RATE = 0.5;

const curseSurchargeFor = (items: Item[]): number =>
  surchargeFor(items, (item) => item.cursed === true, CURSE_SURCHARGE_RATE);

const HIGH_ENCHANTMENT_SURCHARGE_RATE = 0.3;
const HIGH_ENCHANTMENT_THRESHOLD = 5;

const isHighlyEnchanted = (item: Item): boolean =>
  (item.enchantment ?? 0) >= HIGH_ENCHANTMENT_THRESHOLD;

const highEnchantmentSurchargeFor = (items: Item[]): number =>
  surchargeFor(items, isHighlyEnchanted, HIGH_ENCHANTMENT_SURCHARGE_RATE);

const FIRST_INSURANCE_SURCHARGE_RATE = 0.1;

const firstInsuranceSurchargeOn = (policyBasePremium: number): number =>
  policyBasePremium * FIRST_INSURANCE_SURCHARGE_RATE;

const LOYALTY_DISCOUNT_RATE = 0.2;
const LOYALTY_YEARS_THRESHOLD = 2;

const loyaltyDiscountFor = (
  customer: Customer,
  policyBasePremium: number,
): number =>
  customer.yearsWithMHPCO >= LOYALTY_YEARS_THRESHOLD
    ? policyBasePremium * LOYALTY_DISCOUNT_RATE
    : 0;

export type QuoteOptions = {
  contractNumber?: number;
};

const FOLLOW_UP_DISCOUNT_RATE = 0.15;
const FIRST_CONTRACT_NUMBER = 1;

const followUpDiscountFor = (
  options: QuoteOptions | undefined,
  policyBasePremium: number,
): number =>
  (options?.contractNumber ?? FIRST_CONTRACT_NUMBER) > FIRST_CONTRACT_NUMBER
    ? policyBasePremium * FOLLOW_UP_DISCOUNT_RATE
    : 0;

export const quote = (
  customer: Customer,
  items: Item[],
  options?: QuoteOptions,
): number => {
  const policyBasePremium = totalBasePremiumFor(items);
  return Math.ceil(
    policyBasePremium +
      curseSurchargeFor(items) +
      highEnchantmentSurchargeFor(items) +
      firstInsuranceSurchargeOn(policyBasePremium) -
      loyaltyDiscountFor(customer, policyBasePremium) -
      followUpDiscountFor(options, policyBasePremium) +
      PROCESSING_FEE,
  );
};

export type Damage = {
  itemType: string;
  amount: number;
};

export type ClaimResult = {
  payout: number;
  remainingCap: number;
};

const DEDUCTIBLE = 100;
const HALF_REIMBURSEMENT_ENCHANTMENT_THRESHOLD = 8;
const HALF_REIMBURSEMENT_RATE = 0.5;
const FULL_REIMBURSEMENT_RATE = 1;

const reimbursementRateFor = (item: Item): number =>
  (item.enchantment ?? 0) >= HALF_REIMBURSEMENT_ENCHANTMENT_THRESHOLD
    ? HALF_REIMBURSEMENT_RATE
    : FULL_REIMBURSEMENT_RATE;

// Invariant guard: assertDamagesCovered runs first in claim, so this
// throw is unreachable there; it narrows the type and protects misuse.
const insuredItemFor = (policyItems: Item[], itemType: string): Item => {
  const item = policyItems.find((policyItem) => policyItem.type === itemType);
  if (item === undefined) {
    throw new Error(`No insured item of type: ${itemType}`);
  }
  return item;
};

const payoutForDamage = (policyItems: Item[], damage: Damage): number => {
  const item = insuredItemFor(policyItems, damage.itemType);
  return damage.amount * reimbursementRateFor(item) - DEDUCTIBLE;
};

const INSURANCE_VALUES: Record<string, number> = {
  sword: 1000,
  amulet: 600,
};

const PAYOUT_CAP_MULTIPLIER = 2;

// Item types without a listed insurance value leave the policy uncapped.
const UNLIMITED_INSURANCE_VALUE = Infinity;

const payoutCapFor = (policyItems: Item[]): number =>
  PAYOUT_CAP_MULTIPLIER *
  policyItems.reduce(
    (sum, item) =>
      sum + (INSURANCE_VALUES[item.type] ?? UNLIMITED_INSURANCE_VALUE),
    0,
  );

export type ClaimOptions = {
  remainingCap?: number;
};

const assertDamagesCovered = (policyItems: Item[], damages: Damage[]): void => {
  const insuredCounts = countByType(policyItems);
  const damageCounts = countOccurrences(
    damages.map((damage) => damage.itemType),
  );
  for (const [itemType, count] of damageCounts) {
    if (count > (insuredCounts.get(itemType) ?? 0)) {
      throw new Error(
        `More damage entries than insured items of type: ${itemType}`,
      );
    }
  }
};

const uncappedPayoutFor = (policyItems: Item[], damages: Damage[]): number =>
  damages.reduce(
    (total, damage) => total + payoutForDamage(policyItems, damage),
    0,
  );

const assertDamageAmountsNotNegative = (damages: Damage[]): void => {
  const negativeDamage = damages.find((damage) => damage.amount < 0);
  if (negativeDamage !== undefined) {
    throw new Error(`Negative damage amount: ${negativeDamage.amount}`);
  }
};

export const claim = (
  policyItems: Item[],
  damages: Damage[],
  options?: ClaimOptions,
): ClaimResult => {
  assertDamagesCovered(policyItems, damages);
  assertDamageAmountsNotNegative(damages);
  const startingCap = options?.remainingCap ?? payoutCapFor(policyItems);
  const uncappedPayout = uncappedPayoutFor(policyItems, damages);
  const payout = Math.floor(Math.min(uncappedPayout, startingCap));
  return {
    payout,
    remainingCap: startingCap - payout,
  };
};
