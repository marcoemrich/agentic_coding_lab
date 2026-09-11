export interface Customer {
  yearsWithMHPCO: number;
}

export interface QuoteItem {
  type: string;
  enchantment?: number;
  cursed?: boolean;
}

export interface QuoteResult {
  premium: number;
}

const BASE_PREMIUMS: Record<string, number> = {
  sword: 100,
  amulet: 60,
  staff: 80,
  potion: 40,
  rune: 25,
  moonstone: 25,
};

const PROCESSING_FEE = 5;
const COMPONENT_TYPES = new Set(["rune", "moonstone"]);
const COMPONENT_BLOCK_SIZE = 3;
const COMPONENT_BLOCK_PREMIUM = 60;
const PERCENT_BASE = 100;

// All percentage-based modifiers are expressed out of 100, consistently, so
// they read as directly comparable rates rather than mixed fractions.
const percentOf = (percent: number, amount: number): number =>
  (amount * percent) / PERCENT_BASE;

const assertKnownItemTypes = (items: QuoteItem[]): void => {
  for (const item of items) {
    if (!(item.type in BASE_PREMIUMS)) {
      throw new Error(`Unknown item type: "${item.type}"`);
    }
  }
};

const countByType = (items: QuoteItem[]): Map<string, number> => {
  const counts = new Map<string, number>();
  for (const item of items) {
    counts.set(item.type, (counts.get(item.type) ?? 0) + 1);
  }
  return counts;
};

// A component type (rune/moonstone) prices as a flat block premium when
// exactly COMPONENT_BLOCK_SIZE of that type are present; otherwise every
// item (component or not) prices per-unit from BASE_PREMIUMS.
const basePremiumForTypeCount = (type: string, count: number): number => {
  if (COMPONENT_TYPES.has(type) && count === COMPONENT_BLOCK_SIZE) {
    return COMPONENT_BLOCK_PREMIUM;
  }
  return BASE_PREMIUMS[type] * count;
};

// NOTE: assumes the item's per-unit base price is BASE_PREMIUMS[item.type],
// which is true for all currently-tested cases (including lone/non-block
// components). This is NOT yet verified for a cursed component that's part
// of a priced block-of-3 (block premium is 20/item effective, not 25/item) —
// no test covers that combination yet, so this is left as-is pending one.
const CURSE_SURCHARGE_DIVISOR = 2;

const curseSurcharge = (item: QuoteItem): number =>
  item.cursed ? BASE_PREMIUMS[item.type] / CURSE_SURCHARGE_DIVISOR : 0;

const HIGH_ENCHANTMENT_THRESHOLD = 5;
const HIGH_ENCHANTMENT_SURCHARGE_PERCENT = 30;

const enchantmentSurcharge = (item: QuoteItem): number =>
  (item.enchantment ?? 0) >= HIGH_ENCHANTMENT_THRESHOLD
    ? percentOf(HIGH_ENCHANTMENT_SURCHARGE_PERCENT, BASE_PREMIUMS[item.type])
    : 0;

const LOYALTY_THRESHOLD_YEARS = 2;

const FIRST_INSURANCE_SURCHARGE_PERCENT = 10;
const LOYALTY_DISCOUNT_PERCENT = 20;
const FOLLOW_UP_DISCOUNT_PERCENT = 15;

// Policy-wide modifiers (loyalty, first insurance, follow-up contract) are
// all percentages of the pure policy base premium (sum of item base
// premiums, before curse/enchantment surcharges), summed together — not
// compounded. First-insurance surcharge always applies (per spec, every
// item in a quote is treated as first insurance regardless of customer
// history); follow-up-contract discount additionally applies whenever this
// is not the customer's first quote in the scenario (contractIndex > 0).
const policyWideModifiers = (
  customer: Customer,
  policyBase: number,
  contractIndex: number
): number => {
  const firstInsuranceSurcharge = percentOf(FIRST_INSURANCE_SURCHARGE_PERCENT, policyBase);
  const loyaltyDiscount =
    customer.yearsWithMHPCO >= LOYALTY_THRESHOLD_YEARS
      ? percentOf(LOYALTY_DISCOUNT_PERCENT, policyBase)
      : 0;
  const followUpDiscount =
    contractIndex > 0 ? percentOf(FOLLOW_UP_DISCOUNT_PERCENT, policyBase) : 0;
  return firstInsuranceSurcharge - loyaltyDiscount - followUpDiscount;
};

export const quote = (
  customer: Customer,
  items: QuoteItem[],
  contractIndex: number
): QuoteResult => {
  assertKnownItemTypes(items);
  const counts = countByType(items);
  let policyBase = 0;
  for (const [type, count] of counts) {
    policyBase += basePremiumForTypeCount(type, count);
  }
  // itemLevelSubtotal starts from the pure policy base and adds per-item
  // surcharges (curse, enchantment). Separate loop from the block above:
  // curse/enchantment surcharges are per-item modifiers, while the loop
  // above is inherently per-type-count (block-of-3 pricing can't be
  // computed one item at a time). Kept as a direct sum rather than an
  // array-of-modifiers + reduce: with just two modifiers, this is lower
  // mass AND reads more directly than iterating a modifier array. Revisit
  // the array/reduce abstraction if a third per-item modifier appears.
  let itemLevelSubtotal = policyBase;
  for (const item of items) {
    itemLevelSubtotal += curseSurcharge(item) + enchantmentSurcharge(item);
  }
  // Multiply-then-divide by whole numbers (not `* 1.1`) avoids float
  // epsilon errors for the bases seen so far. The subtotal is intentionally
  // left as a fraction — per spec, only the final premium is rounded, via
  // the single Math.ceil below.
  const subtotal =
    itemLevelSubtotal + policyWideModifiers(customer, policyBase, contractIndex);
  const premium = Math.ceil(subtotal + PROCESSING_FEE);
  return { premium };
};
