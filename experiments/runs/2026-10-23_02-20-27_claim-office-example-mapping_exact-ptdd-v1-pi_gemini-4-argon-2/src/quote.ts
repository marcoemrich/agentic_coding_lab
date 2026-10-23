import type { QuoteItem, ScenarioCustomer } from "./claim-office.js";
import {
  calculatePolicyBasePremium,
  getItemBasePremium,
} from "./price-list.js";

const PROCESSING_FEE = 5;
const FIRST_INSURANCE_SURCHARGE_RATE = 0.1;
const CURSED_SURCHARGE_RATE = 0.5;
const HIGH_ENCHANTMENT_SURCHARGE_THRESHOLD = 5;
const HIGH_ENCHANTMENT_SURCHARGE_RATE = 0.3;
const LOYALTY_YEARS_THRESHOLD = 2;
const LOYALTY_DISCOUNT_RATE = 0.2;
const FOLLOW_UP_CONTRACT_DISCOUNT_RATE = 0.15;

function roundPremiumInMHPCOFavor(amount: number): number {
  return Math.ceil(amount);
}

function isHighlyEnchantedForQuote(item: QuoteItem): boolean {
  return (item.enchantment ?? 0) >= HIGH_ENCHANTMENT_SURCHARGE_THRESHOLD;
}

function calculateItemRiskSurcharge(item: QuoteItem): number {
  const itemBasePremium = getItemBasePremium(item.type);
  const cursedSurcharge = item.cursed
    ? itemBasePremium * CURSED_SURCHARGE_RATE
    : 0;
  const highEnchantmentSurcharge = isHighlyEnchantedForQuote(item)
    ? itemBasePremium * HIGH_ENCHANTMENT_SURCHARGE_RATE
    : 0;
  return cursedSurcharge + highEnchantmentSurcharge;
}

function isLongStandingCustomer(customer: ScenarioCustomer): boolean {
  return customer.yearsWithMHPCO >= LOYALTY_YEARS_THRESHOLD;
}

function calculatePolicyWideModifierAdjustment(
  basePremium: number,
  customer: ScenarioCustomer,
  isFollowUpContract: boolean,
): number {
  const loyaltyDiscount = isLongStandingCustomer(customer)
    ? basePremium * LOYALTY_DISCOUNT_RATE
    : 0;
  const followUpDiscount = isFollowUpContract
    ? basePremium * FOLLOW_UP_CONTRACT_DISCOUNT_RATE
    : 0;
  const firstInsuranceSurcharge = basePremium * FIRST_INSURANCE_SURCHARGE_RATE;
  return firstInsuranceSurcharge - loyaltyDiscount - followUpDiscount;
}

export function calculateQuotePremium(
  items: QuoteItem[],
  customer: ScenarioCustomer,
  isFollowUpContract: boolean,
): number {
  const basePremium = calculatePolicyBasePremium(items);
  const itemRiskSurcharges = items.reduce(
    (sum, item) => sum + calculateItemRiskSurcharge(item),
    0,
  );
  const policyWideAdjustment = calculatePolicyWideModifierAdjustment(
    basePremium,
    customer,
    isFollowUpContract,
  );
  return roundPremiumInMHPCOFavor(
    basePremium + itemRiskSurcharges + policyWideAdjustment + PROCESSING_FEE,
  );
}
