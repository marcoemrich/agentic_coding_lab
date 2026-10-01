import { isComponent, priceListEntryFor, type InsuredItem } from "./itemCatalogue.js";

export interface Customer {
  yearsWithMHPCO: number;
}

const PROCESSING_FEE = 5;
const BLOCK_SIZE = 3;
const BLOCK_BASE_PREMIUM = 60;
const FIRST_INSURANCE_SURCHARGE_PERCENT = 10;
const CURSE_SURCHARGE_PERCENT = 50;
const LONG_STANDING_CUSTOMER_YEARS = 2;
const LOYALTY_DISCOUNT_PERCENT = 20;
const FOLLOW_UP_CONTRACT_DISCOUNT_PERCENT = 15;
const HIGH_ENCHANTMENT_LEVEL = 5;
const HIGH_ENCHANTMENT_SURCHARGE_PERCENT = 30;
const WHOLE_PERCENT = 100;

// Amounts are kept in hundredths of a G so percentages stay exact until final rounding.
const HUNDREDTHS_PER_G = 100;

function toHundredths(amountInG: number): number {
  return amountInG * HUNDREDTHS_PER_G;
}

function percentOf(amountInHundredths: number, percent: number): number {
  return (amountInHundredths * percent) / WHOLE_PERCENT;
}

function roundInMhpcoFavour(amountInHundredths: number): number {
  return Math.ceil(amountInHundredths / HUNDREDTHS_PER_G);
}

function basePremiumOfOneItem(type: string): number {
  return priceListEntryFor(type).basePremium;
}

function basePremiumOfAlikeItems(type: string, count: number): number {
  if (isComponent(type) && count === BLOCK_SIZE) {
    return BLOCK_BASE_PREMIUM;
  }
  return count * basePremiumOfOneItem(type);
}

// Items are alike when they share the same type.
function countAlikeItems(items: InsuredItem[]): Map<string, number> {
  const countsByType = new Map<string, number>();
  for (const item of items) {
    countsByType.set(item.type, (countsByType.get(item.type) ?? 0) + 1);
  }
  return countsByType;
}

function policyBasePremium(items: InsuredItem[]): number {
  let total = 0;
  for (const [type, count] of countAlikeItems(items)) {
    total += basePremiumOfAlikeItems(type, count);
  }
  return total;
}

// Item-specific modifiers apply to the affected item's own base premium.
function percentOfItemBasePremium(item: InsuredItem, percent: number): number {
  return percentOf(toHundredths(basePremiumOfOneItem(item.type)), percent);
}

function curseSurcharge(item: InsuredItem): number {
  return item.cursed ? percentOfItemBasePremium(item, CURSE_SURCHARGE_PERCENT) : 0;
}

function highEnchantmentSurcharge(item: InsuredItem): number {
  const isHighlyEnchanted = (item.enchantment ?? 0) >= HIGH_ENCHANTMENT_LEVEL;
  return isHighlyEnchanted ? percentOfItemBasePremium(item, HIGH_ENCHANTMENT_SURCHARGE_PERCENT) : 0;
}

function itemSurcharges(items: InsuredItem[]): number {
  return items.reduce((sum, item) => sum + curseSurcharge(item) + highEnchantmentSurcharge(item), 0);
}

// Policy-wide modifiers apply to the policy base premium.
function firstInsuranceSurcharge(policyBaseInHundredths: number): number {
  return percentOf(policyBaseInHundredths, FIRST_INSURANCE_SURCHARGE_PERCENT);
}

function loyaltyDiscount(policyBaseInHundredths: number, customer: Customer): number {
  const isLongStandingCustomer = customer.yearsWithMHPCO >= LONG_STANDING_CUSTOMER_YEARS;
  return isLongStandingCustomer ? percentOf(policyBaseInHundredths, LOYALTY_DISCOUNT_PERCENT) : 0;
}

function followUpContractDiscount(policyBaseInHundredths: number, previousContracts: number): number {
  return previousContracts > 0 ? percentOf(policyBaseInHundredths, FOLLOW_UP_CONTRACT_DISCOUNT_PERCENT) : 0;
}

function policyWideModifiers(policyBaseInHundredths: number, customer: Customer, previousContracts: number): number {
  return (
    firstInsuranceSurcharge(policyBaseInHundredths) -
    loyaltyDiscount(policyBaseInHundredths, customer) -
    followUpContractDiscount(policyBaseInHundredths, previousContracts)
  );
}

// All modifiers are additive on their base; the processing fee comes last.
export function premiumFor(items: InsuredItem[], customer: Customer, previousContracts: number): number {
  const policyBaseInHundredths = toHundredths(policyBasePremium(items));
  const premiumInHundredths =
    policyBaseInHundredths +
    policyWideModifiers(policyBaseInHundredths, customer, previousContracts) +
    itemSurcharges(items) +
    toHundredths(PROCESSING_FEE);
  return roundInMhpcoFavour(premiumInHundredths);
}
