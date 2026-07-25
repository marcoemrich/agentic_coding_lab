export interface QuoteItem {
  type: string;
  material?: string;
  enchantment?: number;
  cursed?: boolean;
}

export interface Customer {
  yearsWithMHPCO: number;
}

export interface QuoteResult {
  premium: number;
}

import { avoidFloatNoise } from "./rounding.js";

const PROCESSING_FEE = 5;
const FIRST_INSURANCE_SURCHARGE_RATE = 0.1;

const BASE_PREMIUMS: Record<string, number> = {
  sword: 100,
  amulet: 60,
  staff: 80,
  potion: 40,
  rune: 25,
  moonstone: 25,
};

const roundUpInInsurersFavor = (amount: number): number =>
  Math.ceil(avoidFloatNoise(amount));

const BLOCK_SIZE = 3;
const BLOCK_PREMIUM = 60;

const basePremiumOf = (type: string): number => {
  const premium = BASE_PREMIUMS[type];
  if (premium === undefined) {
    throw new Error(`Unknown item type: ${type}`);
  }
  return premium;
};

export const countByType = (items: QuoteItem[]): Record<string, number> =>
  items.reduce((counts, item) => {
    counts[item.type] = (counts[item.type] ?? 0) + 1;
    return counts;
  }, {} as Record<string, number>);

// A "block" of exactly BLOCK_SIZE alike items is priced at a flat
// BLOCK_PREMIUM instead of the usual per-item rate.
const premiumForType = (type: string, count: number): number =>
  count === BLOCK_SIZE ? BLOCK_PREMIUM : count * basePremiumOf(type);

const sumBasePremiums = (counts: Record<string, number>): number =>
  Object.entries(counts).reduce(
    (sum, [type, count]) => sum + premiumForType(type, count),
    0
  );

// Shared shape behind every surcharge/discount: a rate applied to a base amount.
const percentOf = (rate: number, base: number): number => rate * base;

// Every surcharge/discount rule follows the same "apply this rate to this
// base, but only when some condition holds" shape. Centralizing it here
// means each rule below just states its condition and rate.
const percentIf = (condition: boolean, rate: number, base: number): number =>
  condition ? percentOf(rate, base) : 0;

const CURSE_SURCHARGE_RATE = 0.5;

const curseSurchargeFor = (item: QuoteItem): number =>
  percentIf(
    item.cursed ?? false,
    CURSE_SURCHARGE_RATE,
    basePremiumOf(item.type)
  );

const HIGH_ENCHANTMENT_SURCHARGE_RATE = 0.3;
const HIGH_ENCHANTMENT_THRESHOLD = 5;

const highEnchantmentSurchargeFor = (item: QuoteItem): number =>
  percentIf(
    (item.enchantment ?? 0) >= HIGH_ENCHANTMENT_THRESHOLD,
    HIGH_ENCHANTMENT_SURCHARGE_RATE,
    basePremiumOf(item.type)
  );

const sumItemSurcharges = (items: QuoteItem[]): number =>
  items.reduce(
    (sum, item) =>
      sum + curseSurchargeFor(item) + highEnchantmentSurchargeFor(item),
    0
  );

const LOYALTY_DISCOUNT_RATE = 0.2;
const LOYALTY_THRESHOLD_YEARS = 2;

const loyaltyDiscount = (
  customer: Customer,
  policyBasePremium: number
): number =>
  percentIf(
    customer.yearsWithMHPCO >= LOYALTY_THRESHOLD_YEARS,
    LOYALTY_DISCOUNT_RATE,
    policyBasePremium
  );

const FOLLOW_UP_DISCOUNT_RATE = 0.15;

const followUpDiscount = (
  previousQuoteCount: number,
  policyBasePremium: number
): number =>
  percentIf(previousQuoteCount > 0, FOLLOW_UP_DISCOUNT_RATE, policyBasePremium);

export const computeQuote = (
  customer: Customer,
  items: QuoteItem[],
  previousQuoteCount = 0
): QuoteResult => {
  const counts = countByType(items);
  const policyBasePremium = sumBasePremiums(counts);
  const itemSurcharges = sumItemSurcharges(items);
  const firstInsuranceSurcharge = percentOf(
    FIRST_INSURANCE_SURCHARGE_RATE,
    policyBasePremium
  );
  const discount = loyaltyDiscount(customer, policyBasePremium);
  const followUp = followUpDiscount(previousQuoteCount, policyBasePremium);
  const premium = roundUpInInsurersFavor(
    policyBasePremium +
      itemSurcharges +
      firstInsuranceSurcharge -
      discount -
      followUp +
      PROCESSING_FEE
  );
  return { premium };
};
