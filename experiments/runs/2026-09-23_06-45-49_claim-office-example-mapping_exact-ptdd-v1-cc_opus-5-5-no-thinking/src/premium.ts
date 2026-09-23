import type { Item } from "./catalogue.js";
import { policyBasePremium } from "./policyBasePremium.js";
import { percentOf } from "./percent.js";
import { riskSurcharges } from "./riskSurcharges.js";

const PROCESSING_FEE = 5;
const FIRST_INSURANCE_SURCHARGE_PERCENT = 10;
const LOYALTY_DISCOUNT_PERCENT = 20;
const LOYALTY_YEARS = 2;
const FOLLOW_UP_DISCOUNT_PERCENT = 15;

export interface Customer {
  yearsWithMHPCO: number;
}

function isLongStandingCustomer(customer: Customer): boolean {
  return customer.yearsWithMHPCO >= LOYALTY_YEARS;
}

function policyModifierPercent(customer: Customer, isFollowUpContract: boolean): number {
  const loyaltyPercent = isLongStandingCustomer(customer) ? LOYALTY_DISCOUNT_PERCENT : 0;
  const followUpPercent = isFollowUpContract ? FOLLOW_UP_DISCOUNT_PERCENT : 0;
  return FIRST_INSURANCE_SURCHARGE_PERCENT - loyaltyPercent - followUpPercent;
}

export function calculatePremium(items: Item[], customer: Customer, isFollowUpContract: boolean): number {
  const basePremium = policyBasePremium(items);
  const premium =
    basePremium + riskSurcharges(items) + percentOf(basePremium, policyModifierPercent(customer, isFollowUpContract)) + PROCESSING_FEE;
  return Math.ceil(premium);
}
