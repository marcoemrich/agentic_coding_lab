import type { Customer } from "./customer.js";

/** Policy-wide modifiers, charged on the policy base premium. */
const LOYALTY_DISCOUNT_PERCENT = 20;
const FIRST_INSURANCE_SURCHARGE_PERCENT = 10;
const FOLLOW_UP_CONTRACT_DISCOUNT_PERCENT = 15;
const LOYAL_CUSTOMER_YEARS = 2;

function isLongStanding(customer: Customer): boolean {
  return customer.yearsWithMHPCO >= LOYAL_CUSTOMER_YEARS;
}

function isFollowUpContract(previousContractCount: number): boolean {
  return previousContractCount > 0;
}

export function policyModifierPercent(customer: Customer, previousContractCount: number): number {
  const loyaltyPercent = isLongStanding(customer) ? -LOYALTY_DISCOUNT_PERCENT : 0;
  const followUpPercent = isFollowUpContract(previousContractCount)
    ? -FOLLOW_UP_CONTRACT_DISCOUNT_PERCENT
    : 0;
  return FIRST_INSURANCE_SURCHARGE_PERCENT + loyaltyPercent + followUpPercent;
}
