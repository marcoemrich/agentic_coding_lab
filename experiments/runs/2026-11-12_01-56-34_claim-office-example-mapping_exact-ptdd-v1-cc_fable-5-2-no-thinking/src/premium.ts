import { percentOf } from "./amounts.js";
import { policyBasePremium, type Item } from "./price-list.js";
import { riskSurcharge } from "./risk-surcharge.js";
import { roundPremiumInMHPCOsFavor } from "./rounding.js";

export type Customer = { yearsWithMHPCO: number };

const PROCESSING_FEE = 5;
const LONG_STANDING_YEARS = 2;
const LOYALTY_DISCOUNT_PERCENT = 20;
const FIRST_INSURANCE_SURCHARGE_PERCENT = 10;
const FOLLOW_UP_DISCOUNT_PERCENT = 15;

function isLongStanding(customer: Customer): boolean {
  return customer.yearsWithMHPCO >= LONG_STANDING_YEARS;
}

function isFollowUpContract(previousContracts: number): boolean {
  return previousContracts > 0;
}

function policyWideModifierPercent(customer: Customer, previousContracts: number): number {
  const loyaltyDiscount = isLongStanding(customer) ? LOYALTY_DISCOUNT_PERCENT : 0;
  const followUpDiscount = isFollowUpContract(previousContracts) ? FOLLOW_UP_DISCOUNT_PERCENT : 0;
  return FIRST_INSURANCE_SURCHARGE_PERCENT - loyaltyDiscount - followUpDiscount;
}

export function quotePremium(customer: Customer, items: Item[], previousContracts: number): number {
  const basePremium = policyBasePremium(items);
  const policyWideModifiers = percentOf(
    basePremium,
    policyWideModifierPercent(customer, previousContracts),
  );
  return roundPremiumInMHPCOsFavor(
    basePremium + riskSurcharge(items) + policyWideModifiers + PROCESSING_FEE,
  );
}
