import type { Customer } from "./item.js";

const LOYALTY_DISCOUNT_RATE = 0.2;
const LOYALTY_THRESHOLD_YEARS = 2;
const FIRST_INSURANCE_SURCHARGE_RATE = 0.1;
const FOLLOW_UP_DISCOUNT_RATE = 0.15;

function isLongStanding(customer: Customer): boolean {
  return customer.yearsWithMHPCO >= LOYALTY_THRESHOLD_YEARS;
}

function isFollowUpContract(previousQuotes: number): boolean {
  return previousQuotes >= 1;
}

export function customerModifierRate(
  customer: Customer,
  previousQuotes: number,
): number {
  let rate = FIRST_INSURANCE_SURCHARGE_RATE;
  if (isLongStanding(customer)) {
    rate -= LOYALTY_DISCOUNT_RATE;
  }
  if (isFollowUpContract(previousQuotes)) {
    rate -= FOLLOW_UP_DISCOUNT_RATE;
  }
  return rate;
}
