import { basePremiumOf, policyBasePremium } from "./price-list.js";

export interface QuoteItem {
  type: string;
  material?: string;
  enchantment?: number;
  cursed?: boolean;
}

export interface Customer {
  yearsWithMHPCO: number;
}

const PROCESSING_FEE = 5;
const FIRST_INSURANCE_PERCENT = 10;
const CURSED_PERCENT = 50;
const HIGH_ENCHANTMENT_PERCENT = 30;
const HIGH_ENCHANTMENT_THRESHOLD = 5;
const LOYALTY_PERCENT = 20;
const LOYALTY_YEARS = 2;
const FOLLOW_UP_PERCENT = 15;
const PERCENT = 100;

function curseSurchargePercent(item: QuoteItem): number {
  return item.cursed ? CURSED_PERCENT : 0;
}

function highEnchantmentSurchargePercent(item: QuoteItem): number {
  return (item.enchantment ?? 0) >= HIGH_ENCHANTMENT_THRESHOLD ? HIGH_ENCHANTMENT_PERCENT : 0;
}

function riskSurchargePercent(item: QuoteItem): number {
  return curseSurchargePercent(item) + highEnchantmentSurchargePercent(item);
}

function riskSurchargeOf(item: QuoteItem): number {
  return basePremiumOf(item.type) * riskSurchargePercent(item);
}

function loyaltyDiscountPercent(customer: Customer): number {
  return customer.yearsWithMHPCO >= LOYALTY_YEARS ? LOYALTY_PERCENT : 0;
}

function followUpDiscountPercent(isFollowUpContract: boolean): number {
  return isFollowUpContract ? FOLLOW_UP_PERCENT : 0;
}

function policyWidePercent(customer: Customer, isFollowUpContract: boolean): number {
  return (
    PERCENT +
    FIRST_INSURANCE_PERCENT -
    loyaltyDiscountPercent(customer) -
    followUpDiscountPercent(isFollowUpContract)
  );
}

export function quotePremium(items: QuoteItem[], customer: Customer, isFollowUpContract: boolean): number {
  const policyBase = policyBasePremium(items.map((item) => item.type));
  const riskSurcharges = items.reduce((sum, item) => sum + riskSurchargeOf(item), 0);
  const hundredths = policyBase * policyWidePercent(customer, isFollowUpContract) + riskSurcharges;
  return Math.ceil(hundredths / PERCENT) + PROCESSING_FEE;
}
