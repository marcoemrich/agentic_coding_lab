import { mainItemBasePremiumOf, mainItemsOf, policyBasePremiumOf } from "./basePremium.js";
import type { QuoteItem } from "./item.js";

export interface Customer {
  yearsWithMHPCO: number;
}

export interface QuoteResult {
  premium: number;
}

const PROCESSING_FEE = 5;
const FIRST_INSURANCE_SURCHARGE_PERCENT = 10;
const PERCENT = 100;
const CURSE_SURCHARGE_PERCENT = 50;
const LOYALTY_DISCOUNT_PERCENT = 20;
const LOYALTY_YEARS = 2;
const FOLLOW_UP_CONTRACT_DISCOUNT_PERCENT = 15;
const HIGH_ENCHANTMENT_SURCHARGE_PERCENT = 30;
const HIGH_ENCHANTMENT_THRESHOLD = 5;

function percentOf(amount: number, percent: number): number {
  return (amount * percent) / PERCENT;
}

function firstInsuranceSurchargeOn(policyBasePremium: number): number {
  return percentOf(policyBasePremium, FIRST_INSURANCE_SURCHARGE_PERCENT);
}

function isHighlyEnchanted(mainItem: QuoteItem): boolean {
  return (mainItem.enchantment ?? 0) >= HIGH_ENCHANTMENT_THRESHOLD;
}

function curseSurchargePercentOf(mainItem: QuoteItem): number {
  return mainItem.cursed ? CURSE_SURCHARGE_PERCENT : 0;
}

function highEnchantmentSurchargePercentOf(mainItem: QuoteItem): number {
  return isHighlyEnchanted(mainItem) ? HIGH_ENCHANTMENT_SURCHARGE_PERCENT : 0;
}

function riskSurchargePercentOf(mainItem: QuoteItem): number {
  return curseSurchargePercentOf(mainItem) + highEnchantmentSurchargePercentOf(mainItem);
}

function riskSurchargeOn(mainItem: QuoteItem): number {
  return percentOf(mainItemBasePremiumOf(mainItem), riskSurchargePercentOf(mainItem));
}

function riskSurchargesOf(items: QuoteItem[]): number {
  return mainItemsOf(items).reduce((sum, mainItem) => sum + riskSurchargeOn(mainItem), 0);
}

function isLoyalCustomer(customer: Customer): boolean {
  return customer.yearsWithMHPCO >= LOYALTY_YEARS;
}

function loyaltyDiscountOn(policyBasePremium: number, customer: Customer): number {
  return isLoyalCustomer(customer) ? percentOf(policyBasePremium, LOYALTY_DISCOUNT_PERCENT) : 0;
}

function followUpContractDiscountOn(policyBasePremium: number, isFollowUpContract: boolean): number {
  return isFollowUpContract ? percentOf(policyBasePremium, FOLLOW_UP_CONTRACT_DISCOUNT_PERCENT) : 0;
}

function policyWideModifiersOn(policyBasePremium: number, customer: Customer, isFollowUpContract: boolean): number {
  return (
    firstInsuranceSurchargeOn(policyBasePremium) -
    loyaltyDiscountOn(policyBasePremium, customer) -
    followUpContractDiscountOn(policyBasePremium, isFollowUpContract)
  );
}

function premiumRoundedInMHPCOsFavor(premium: number): number {
  return Math.ceil(premium);
}

export function quote(items: QuoteItem[], customer: Customer, isFollowUpContract: boolean): QuoteResult {
  const policyBasePremium = policyBasePremiumOf(items);
  const unroundedPremium =
    policyBasePremium +
    riskSurchargesOf(items) +
    policyWideModifiersOn(policyBasePremium, customer, isFollowUpContract) +
    PROCESSING_FEE;
  return { premium: premiumRoundedInMHPCOsFavor(unroundedPremium) };
}
