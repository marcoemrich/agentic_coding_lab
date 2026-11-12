import type { Item } from "./item.js";
import { percentOf } from "./percent.js";
import { basePremiumOf, policyBasePremium } from "./price-list.js";
import { roundPremiumInFavorOfMHPCO } from "./rounding.js";

const CURSE_SURCHARGE_PERCENT = 50;
const HIGH_ENCHANTMENT_LEVEL = 5;
const HIGH_ENCHANTMENT_SURCHARGE_PERCENT = 30;
const LOYALTY_YEARS = 2;
const LOYALTY_DISCOUNT_PERCENT = 20;
const FIRST_INSURANCE_SURCHARGE_PERCENT = 10;
const FOLLOW_UP_CONTRACT_DISCOUNT_PERCENT = 15;
const PROCESSING_FEE = 5;

export interface CustomerHistory {
  yearsWithMHPCO: number;
  previousContracts: number;
}

export function quotePremium(items: Item[], customer: CustomerHistory): number {
  const basePremium = policyBasePremium(items);
  const policyWideModifiers = percentOf(basePremium, policyWideModifierPercent(customer));
  return roundPremiumInFavorOfMHPCO(basePremium + riskSurcharges(items) + policyWideModifiers + PROCESSING_FEE);
}

function riskSurcharges(items: Item[]): number {
  return items.reduce((sum, item) => sum + percentOf(basePremiumOf(item.type), riskSurchargePercent(item)), 0);
}

function riskSurchargePercent(item: Item): number {
  const curseSurcharge = item.cursed ? CURSE_SURCHARGE_PERCENT : 0;
  const highEnchantmentSurcharge = isHighlyEnchanted(item) ? HIGH_ENCHANTMENT_SURCHARGE_PERCENT : 0;
  return curseSurcharge + highEnchantmentSurcharge;
}

function isHighlyEnchanted(item: Item): boolean {
  return (item.enchantment ?? 0) >= HIGH_ENCHANTMENT_LEVEL;
}

function policyWideModifierPercent(customer: CustomerHistory): number {
  const loyaltyDiscount = isLongStanding(customer) ? LOYALTY_DISCOUNT_PERCENT : 0;
  const followUpDiscount = isFollowUpContract(customer) ? FOLLOW_UP_CONTRACT_DISCOUNT_PERCENT : 0;
  return FIRST_INSURANCE_SURCHARGE_PERCENT - loyaltyDiscount - followUpDiscount;
}

function isLongStanding(customer: CustomerHistory): boolean {
  return customer.yearsWithMHPCO >= LOYALTY_YEARS;
}

function isFollowUpContract(customer: CustomerHistory): boolean {
  return customer.previousContracts > 0;
}