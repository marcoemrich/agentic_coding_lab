import { type Item, basePremiumOf, itemsBasePremium } from "./price-list.js";

const PROCESSING_FEE = 5;
const PERCENT = 100;
const FIRST_INSURANCE_PERCENT = 10;
const LOYALTY_DISCOUNT_PERCENT = 20;
const LOYALTY_YEARS = 2;
const FOLLOW_UP_DISCOUNT_PERCENT = 15;
const CURSED_PERCENT = 50;
const HIGH_ENCHANTMENT_PERCENT = 30;
const HIGH_ENCHANTMENT_LEVEL = 5;

function riskSurchargePercent(item: Item): number {
  const cursed = item.cursed ? CURSED_PERCENT : 0;
  const highlyEnchanted = (item.enchantment ?? 0) >= HIGH_ENCHANTMENT_LEVEL ? HIGH_ENCHANTMENT_PERCENT : 0;
  return cursed + highlyEnchanted;
}

export type QuoteCustomer = { yearsWithMHPCO: number; isFollowUpContract: boolean };

function loyaltyDiscountPercent(yearsWithMHPCO: number): number {
  return yearsWithMHPCO >= LOYALTY_YEARS ? LOYALTY_DISCOUNT_PERCENT : 0;
}

function followUpDiscountPercent(isFollowUpContract: boolean): number {
  return isFollowUpContract ? FOLLOW_UP_DISCOUNT_PERCENT : 0;
}

function policyPercent(customer: QuoteCustomer): number {
  return (
    FIRST_INSURANCE_PERCENT -
    loyaltyDiscountPercent(customer.yearsWithMHPCO) -
    followUpDiscountPercent(customer.isFollowUpContract)
  );
}

export function quotePremium(items: Item[], customer: QuoteCustomer): number {
  const base = itemsBasePremium(items);
  const riskSurcharge = items.reduce(
    (sum, item) => sum + (basePremiumOf(item) * riskSurchargePercent(item)) / PERCENT,
    0,
  );
  const policyAdjustment = (base * policyPercent(customer)) / PERCENT;
  return Math.ceil(base + riskSurcharge + policyAdjustment) + PROCESSING_FEE;
}
