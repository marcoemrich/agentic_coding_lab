import { type Item, policyBasePremiumOf } from "./price-list.js";
import { itemRiskSurchargesOf } from "./risk-surcharge.js";
import { roundAmountChargedInMHPCOsFavour } from "./rounding.js";

// What the MHPCO charges to open a policy: the price list's base premium for
// the items, the risk surcharges the items themselves carry, the modifiers the
// customer's standing earns, and the office's processing fee.

export type { Item };

export interface Customer {
  yearsWithMHPCO: number;
}

const PROCESSING_FEE = 5;
const FIRST_INSURANCE_SURCHARGE_RATE = 0.1;
const LOYALTY_YEARS = 2;
const LOYALTY_DISCOUNT_RATE = 0.2;
const FOLLOW_UP_CONTRACT_DISCOUNT_RATE = 0.15;

// The customer's relationship with MHPCO as of this quote: how long they have
// been doing business and how many contracts they have already taken out.
interface CustomerStanding {
  yearsWithMHPCO: number;
  previousQuoteCount: number;
}

function isLongStanding(standing: CustomerStanding): boolean {
  return standing.yearsWithMHPCO >= LOYALTY_YEARS;
}

function isFollowUpContract(standing: CustomerStanding): boolean {
  return standing.previousQuoteCount > 0;
}

// The initial assessment surcharge the MHPCO levies on every newly quoted
// policy, regardless of customer history -- each quoted item is a first
// insurance even on a follow-up contract.
function firstInsuranceSurchargeOf(policyBasePremium: number): number {
  return policyBasePremium * FIRST_INSURANCE_SURCHARGE_RATE;
}

// Discounts earned by the customer's standing, in contrast to the surcharge
// above, which does not turn on customer history at all.
function standingDiscountRateOf(standing: CustomerStanding): number {
  return (
    (isLongStanding(standing) ? LOYALTY_DISCOUNT_RATE : 0) +
    (isFollowUpContract(standing) ? FOLLOW_UP_CONTRACT_DISCOUNT_RATE : 0)
  );
}

// Policy-wide modifiers apply to the policy base premium (the sum of all
// item base premiums), in contrast to the item-specific risk surcharges.
function policyWideModifiersOf(
  standing: CustomerStanding,
  policyBasePremium: number,
): number {
  return (
    firstInsuranceSurchargeOf(policyBasePremium) -
    policyBasePremium * standingDiscountRateOf(standing)
  );
}

export function quote(
  customer: Customer,
  items: Item[],
  previousQuoteCount: number,
): number {
  const standing = { ...customer, previousQuoteCount };
  const policyBasePremium = policyBasePremiumOf(items);
  const premium =
    policyBasePremium +
    itemRiskSurchargesOf(items) +
    policyWideModifiersOf(standing, policyBasePremium) +
    PROCESSING_FEE;
  return roundAmountChargedInMHPCOsFavour(premium);
}
