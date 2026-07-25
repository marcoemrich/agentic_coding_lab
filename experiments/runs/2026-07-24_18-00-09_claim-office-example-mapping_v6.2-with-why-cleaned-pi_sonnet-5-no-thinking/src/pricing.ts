import { Item, policyBasePremium, MAIN_ITEM_BASE_PREMIUM_BY_TYPE } from "./items.js";

export interface QuoteItem extends Item {
  material?: string;
  cursed?: boolean;
  enchantment?: number;
}

export interface Customer {
  yearsWithMHPCO: number;
}

const PROCESSING_FEE = 5;
const CURSE_SURCHARGE_RATE = 0.5;
const HIGH_ENCHANTMENT_SURCHARGE_RATE = 0.3;
const HIGH_ENCHANTMENT_THRESHOLD = 5;
const FIRST_INSURANCE_SURCHARGE_RATE = 0.1;
const LOYALTY_DISCOUNT_RATE = 0.2;
const LOYALTY_THRESHOLD_YEARS = 2;
const FOLLOW_UP_DISCOUNT_RATE = 0.15;

const COMPONENT_BASE_PREMIUM_BY_TYPE: Record<string, number> = {
  rune: 25,
  moonstone: 25,
};

// The full set of item types this system recognizes at all -- the union of every
// type that has a base premium (main item or component). Single source of truth
// so callers don't need to know which table an item type lives in.
export const KNOWN_ITEM_TYPES = new Set([
  ...Object.keys(MAIN_ITEM_BASE_PREMIUM_BY_TYPE),
  ...Object.keys(COMPONENT_BASE_PREMIUM_BY_TYPE),
]);

const itemBasePremium = (item: QuoteItem): number =>
  MAIN_ITEM_BASE_PREMIUM_BY_TYPE[item.type] ?? COMPONENT_BASE_PREMIUM_BY_TYPE[item.type] ?? 0;

// Applies `rate` to `base` only when `condition` holds, otherwise contributes nothing.
// Shared by every conditional surcharge/discount in this file (curse, high-enchantment,
// loyalty, follow-up) so the "percentage applied when a condition is met" rule lives once.
const amountWhen = (condition: boolean, base: number, rate: number): number =>
  condition ? base * rate : 0;

export const itemSurchargeTotal = (item: QuoteItem, baseItemPremium: number): number => {
  const curseSurcharge = amountWhen(!!item.cursed, baseItemPremium, CURSE_SURCHARGE_RATE);
  const highEnchantmentSurcharge = amountWhen(
    (item.enchantment ?? 0) >= HIGH_ENCHANTMENT_THRESHOLD,
    baseItemPremium,
    HIGH_ENCHANTMENT_SURCHARGE_RATE
  );
  return curseSurcharge + highEnchantmentSurcharge;
};

export const computeQuote = (
  items: QuoteItem[],
  customer: Customer,
  isFollowUpContract: boolean
): number => {
  const policyBaseSum = policyBasePremium(items);
  const itemSurchargeSum = items.reduce(
    (sum, item) => sum + itemSurchargeTotal(item, itemBasePremium(item)),
    0
  );
  const firstInsuranceSurcharge = policyBaseSum * FIRST_INSURANCE_SURCHARGE_RATE;
  const loyaltyDiscount = amountWhen(
    customer.yearsWithMHPCO >= LOYALTY_THRESHOLD_YEARS,
    policyBaseSum,
    LOYALTY_DISCOUNT_RATE
  );
  const followUpDiscount = amountWhen(isFollowUpContract, policyBaseSum, FOLLOW_UP_DISCOUNT_RATE);

  const total =
    policyBaseSum +
    itemSurchargeSum +
    firstInsuranceSurcharge -
    loyaltyDiscount -
    followUpDiscount +
    PROCESSING_FEE;

  return Math.ceil(total);
};
