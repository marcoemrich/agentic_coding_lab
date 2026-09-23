import type { Customer } from "./customer.js";
import type { Item } from "./item.js";
import { itemBasePremium, policyBasePremium } from "./priceList.js";

const PROCESSING_FEE = 5;
const PERCENT = 100;
const FIRST_INSURANCE_SURCHARGE_PERCENT = 10;
const CURSED_SURCHARGE_PERCENT = 50;
const HIGH_ENCHANTMENT_SURCHARGE_PERCENT = 30;
const HIGH_ENCHANTMENT_LEVEL = 5;
const LOYALTY_DISCOUNT_PERCENT = 20;
const LOYALTY_YEARS = 2;
const FOLLOW_UP_DISCOUNT_PERCENT = 15;

function roundPremiumInMhpcoFavor(amount: number): number {
  return Math.ceil(amount);
}

function percentOf(amount: number, percent: number): number {
  return (amount * percent) / PERCENT;
}

function isHighlyEnchanted(item: Item): boolean {
  return (item.enchantment ?? 0) >= HIGH_ENCHANTMENT_LEVEL;
}

function itemRiskSurcharge(item: Item): number {
  const cursedPercent = item.cursed ? CURSED_SURCHARGE_PERCENT : 0;
  const enchantmentPercent = isHighlyEnchanted(item) ? HIGH_ENCHANTMENT_SURCHARGE_PERCENT : 0;
  return percentOf(itemBasePremium(item), cursedPercent + enchantmentPercent);
}

function isLongStandingCustomer(customer: Customer): boolean {
  return customer.yearsWithMHPCO >= LOYALTY_YEARS;
}

function policyWideModifierPercent(customer: Customer, previousContracts: number): number {
  const loyaltyPercent = isLongStandingCustomer(customer) ? -LOYALTY_DISCOUNT_PERCENT : 0;
  const followUpPercent = previousContracts > 0 ? -FOLLOW_UP_DISCOUNT_PERCENT : 0;
  return FIRST_INSURANCE_SURCHARGE_PERCENT + loyaltyPercent + followUpPercent;
}

export function quotePremium(items: Item[], customer: Customer, previousContracts: number): number {
  const policyBase = policyBasePremium(items);
  const itemSurcharges = items.reduce((sum, item) => sum + itemRiskSurcharge(item), 0);
  const policyModifiers = percentOf(policyBase, policyWideModifierPercent(customer, previousContracts));
  return roundPremiumInMhpcoFavor(policyBase + itemSurcharges + policyModifiers + PROCESSING_FEE);
}
