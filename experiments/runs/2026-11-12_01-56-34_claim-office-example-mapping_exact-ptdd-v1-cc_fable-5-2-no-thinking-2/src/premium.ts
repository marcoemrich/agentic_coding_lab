import { percentOf } from "./percent.js";
import { type Item, itemBasePremium, policyBasePremium } from "./price-list.js";
import { premiumRoundedInFavorOfMHPCO } from "./rounding.js";

export interface Customer {
  yearsWithMHPCO: number;
}

const CURSE_SURCHARGE_PERCENT = 50;
const HIGH_ENCHANTMENT_LEVEL = 5;
const HIGH_ENCHANTMENT_SURCHARGE_PERCENT = 30;
const LONG_STANDING_YEARS = 2;
const LOYALTY_DISCOUNT_PERCENT = 20;
const FIRST_INSURANCE_SURCHARGE_PERCENT = 10;
const FOLLOW_UP_CONTRACT_DISCOUNT_PERCENT = 15;
const PROCESSING_FEE = 5;

function isHighlyEnchanted(item: Item): boolean {
  return (item.enchantment ?? 0) >= HIGH_ENCHANTMENT_LEVEL;
}

function riskSurchargePercent(item: Item): number {
  const cursePercent = item.cursed ? CURSE_SURCHARGE_PERCENT : 0;
  const highEnchantmentPercent = isHighlyEnchanted(item) ? HIGH_ENCHANTMENT_SURCHARGE_PERCENT : 0;
  return cursePercent + highEnchantmentPercent;
}

function itemRiskSurcharge(item: Item): number {
  return percentOf(itemBasePremium(item), riskSurchargePercent(item));
}

function isLongStandingCustomer(customer: Customer): boolean {
  return customer.yearsWithMHPCO >= LONG_STANDING_YEARS;
}

function isFollowUpContract(previousContracts: number): boolean {
  return previousContracts > 0;
}

function policyWideModifierPercent(customer: Customer, previousContracts: number): number {
  const loyaltyDiscountPercent = isLongStandingCustomer(customer) ? LOYALTY_DISCOUNT_PERCENT : 0;
  const followUpDiscountPercent = isFollowUpContract(previousContracts) ? FOLLOW_UP_CONTRACT_DISCOUNT_PERCENT : 0;
  return FIRST_INSURANCE_SURCHARGE_PERCENT - loyaltyDiscountPercent - followUpDiscountPercent;
}

export function quotePremium(items: Item[], customer: Customer, previousContracts: number): number {
  const basePremium = policyBasePremium(items);
  const riskSurcharges = items.reduce((sum, item) => sum + itemRiskSurcharge(item), 0);
  const policyWideModifiers = percentOf(basePremium, policyWideModifierPercent(customer, previousContracts));
  return premiumRoundedInFavorOfMHPCO(basePremium + riskSurcharges + policyWideModifiers + PROCESSING_FEE);
}
