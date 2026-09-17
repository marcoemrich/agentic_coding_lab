import type { Customer } from "./policy.js";

/**
 * Policy-wide modifiers scale the policy base premium (the sum of all item
 * base premiums). Item-specific modifiers live with the items they affect.
 *
 * Three independent policies live here, and they answer to different facts:
 * the initial assessment surcharge is a property of the quote itself, the
 * loyalty discount is a property of the customer's relationship with the
 * MHPCO, and the follow-up contract discount is a property of the
 * customer's contract history in this scenario.
 *
 * Each is expressed as a signed adjustment to the policy base premium, so
 * that a surcharge and a discount differ only in sign and the quote can sum
 * them without knowing which is which.
 */

/** Long-standing customers are rewarded with a loyalty discount. */
const LOYALTY_DISCOUNT_RATE = 0.2;
const LOYALTY_YEARS = 2;

const INITIAL_ASSESSMENT_SURCHARGE_RATE = 0.1;

/** Every contract after the customer's first is discounted. */
const FOLLOW_UP_CONTRACT_DISCOUNT_RATE = 0.15;

/** What the quote is assessed against, beyond the items themselves. */
export interface Contract {
  readonly customer: Customer;
  /** Contracts this customer already holds in the scenario. */
  readonly previousContracts: number;
}

function isLongStanding(customer: Customer): boolean {
  return customer.yearsWithMHPCO >= LOYALTY_YEARS;
}

/** A follow-up contract is any contract after the customer's first. */
function isFollowUpContract(contract: Contract): boolean {
  return contract.previousContracts > 0;
}

/** Long-standing customers are rewarded off the premium. */
function loyaltyDiscount(contract: Contract, policyBasePremium: number): number {
  return isLongStanding(contract.customer)
    ? -policyBasePremium * LOYALTY_DISCOUNT_RATE
    : 0;
}

function followUpContractDiscount(
  contract: Contract,
  policyBasePremium: number,
): number {
  return isFollowUpContract(contract)
    ? -policyBasePremium * FOLLOW_UP_CONTRACT_DISCOUNT_RATE
    : 0;
}

/**
 * Every item in a quote is assessed as a first insurance, regardless of
 * customer history, so this surcharge always applies.
 */
function initialAssessmentSurcharge(policyBasePremium: number): number {
  return policyBasePremium * INITIAL_ASSESSMENT_SURCHARGE_RATE;
}

/**
 * The net signed adjustment the policy-wide modifiers make to the policy
 * base premium: positive for a surcharge, negative for a discount.
 */
export function policyWideAdjustment(
  contract: Contract,
  policyBasePremium: number,
): number {
  return (
    initialAssessmentSurcharge(policyBasePremium) +
    loyaltyDiscount(contract, policyBasePremium) +
    followUpContractDiscount(contract, policyBasePremium)
  );
}
