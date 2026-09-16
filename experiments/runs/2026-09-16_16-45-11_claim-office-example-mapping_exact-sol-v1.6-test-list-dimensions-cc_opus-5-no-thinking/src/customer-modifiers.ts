const LOYALTY_DISCOUNT_RATE = 0.2;
const LOYALTY_YEARS_THRESHOLD = 2;
const FIRST_INSURANCE_SURCHARGE_RATE = 0.1;
const FOLLOW_UP_CONTRACT_DISCOUNT_RATE = 0.15;

export interface Customer {
  yearsWithMHPCO: number;
}

function isLongStanding(customer: Customer): boolean {
  return customer.yearsWithMHPCO >= LOYALTY_YEARS_THRESHOLD;
}

function loyaltyDiscount(customer: Customer, policyBasePremium: number): number {
  return isLongStanding(customer) ? policyBasePremium * LOYALTY_DISCOUNT_RATE : 0;
}

/** Every item in a quote is newly insured, so this surcharge applies to every quote. */
function initialAssessmentSurcharge(policyBasePremium: number): number {
  return policyBasePremium * FIRST_INSURANCE_SURCHARGE_RATE;
}

function followUpContractDiscount(
  policyBasePremium: number,
  previousContracts: number,
): number {
  return previousContracts > 0
    ? policyBasePremium * FOLLOW_UP_CONTRACT_DISCOUNT_RATE
    : 0;
}

/** The net policy-wide adjustment to the policy base premium. */
export function policyWideAdjustment(
  customer: Customer,
  policyBasePremium: number,
  previousContracts: number,
): number {
  return (
    initialAssessmentSurcharge(policyBasePremium) -
    loyaltyDiscount(customer, policyBasePremium) -
    followUpContractDiscount(policyBasePremium, previousContracts)
  );
}
