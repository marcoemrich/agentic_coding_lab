import type { Customer, QuoteItem } from "./scenario.js";
import {
  basePremiumOf,
  componentsBasePremium,
  componentsBasePremiumByType,
  isComponent,
} from "./catalog.js";

const PROCESSING_FEE = 5;
const FIRST_INSURANCE_RATE = 0.1;
const LOYAL_CUSTOMER_YEARS = 2;
const LOYALTY_DISCOUNT_RATE = 0.2;
const HIGH_ENCHANTMENT_LEVEL = 5;
const CURSE_SURCHARGE_RATE = 0.5;
const HIGH_ENCHANTMENT_SURCHARGE_RATE = 0.3;
const FOLLOW_UP_DISCOUNT_RATE = 0.15;

export function quotePremium(
  items: QuoteItem[],
  customer: Customer,
  contractNumber: number
): number {
  const basePremium = basePremiumOfPolicy(items);
  const itemSurcharges = totalItemSurcharges(items);
  return Math.ceil(
    basePremium +
      itemSurcharges +
      policyWideAdjustment(basePremium, customer, contractNumber) +
      PROCESSING_FEE
  );
}

function policyWideAdjustment(
  basePremium: number,
  customer: Customer,
  contractNumber: number
): number {
  const firstInsurance = basePremium * FIRST_INSURANCE_RATE;
  const loyaltyDiscount = isLoyalCustomer(customer)
    ? basePremium * LOYALTY_DISCOUNT_RATE
    : 0;
  const followUpDiscount =
    contractNumber > 1 ? basePremium * FOLLOW_UP_DISCOUNT_RATE : 0;
  return firstInsurance - loyaltyDiscount - followUpDiscount;
}

function isLoyalCustomer(customer: Customer): boolean {
  return customer.yearsWithMHPCO >= LOYAL_CUSTOMER_YEARS;
}

function totalItemSurcharges(items: QuoteItem[]): number {
  return items.reduce((sum, item) => sum + itemSurchargeOf(item), 0);
}

function itemSurchargeOf(item: QuoteItem): number {
  const base = basePremiumOfItem(item);
  const curse = item.cursed ? base * CURSE_SURCHARGE_RATE : 0;
  const highEnchantment = isHighlyEnchanted(item)
    ? base * HIGH_ENCHANTMENT_SURCHARGE_RATE
    : 0;
  return curse + highEnchantment;
}

function isHighlyEnchanted(item: QuoteItem): boolean {
  return (item.enchantment ?? 0) >= HIGH_ENCHANTMENT_LEVEL;
}

function basePremiumOfItem(item: QuoteItem): number {
  return isComponent(item.type)
    ? componentsBasePremium(1)
    : basePremiumOf(item.type);
}

function basePremiumOfPolicy(items: QuoteItem[]): number {
  const mainItems = items.filter((item) => !isComponent(item.type));
  const componentTypes = items
    .filter((item) => isComponent(item.type))
    .map((item) => item.type);
  const mainPremium = mainItems.reduce(
    (sum, item) => sum + basePremiumOf(item.type),
    0
  );
  return mainPremium + componentsBasePremiumByType(componentTypes);
}
