export interface Customer {
  yearsWithMHPCO: number;
}

const FIRST_INSURANCE_SURCHARGE_RATE = 0.1;
const LOYALTY_DISCOUNT_RATE = 0.2;
const LOYALTY_YEARS = 2;
const FOLLOW_UP_DISCOUNT_RATE = 0.15;

/**
 * The customer's standing with the MHPCO at the moment of a quote: how long the
 * business relationship has lasted, and how many contracts preceded this one.
 */
export interface CustomerStanding {
  customer: Customer;
  previousQuoteCount: number;
}

/**
 * The customer's standing at the moment of this quote, as the MHPCO reads it
 * from the scenario so far: the business relationship and the contracts that
 * preceded this one.
 */
export function standingOf(customer: Customer, previousQuoteCount: number): CustomerStanding {
  return { customer, previousQuoteCount };
}

/** Whether this quote follows an earlier contract of the same customer. */
function isFollowUpContract(standing: CustomerStanding): boolean {
  return standing.previousQuoteCount >= 1;
}

/**
 * Every item in a quote is treated as a first insurance, regardless of customer
 * history, so the office levies the initial assessment on every policy.
 */
function isFirstInsurance(): boolean {
  return true;
}

/** Whether the MHPCO regards the customer as long-standing. */
function isLongStanding(standing: CustomerStanding): boolean {
  return standing.customer.yearsWithMHPCO >= LOYALTY_YEARS;
}

/**
 * A policy-wide clause of the MHPCO's rulebook: the condition under which the
 * office grants or levies it, and the signed rate it charges on the policy base
 * premium — positive for a surcharge, negative for a discount. Condition and
 * rate belong to one clause and change together.
 */
interface PolicyWideClause {
  appliesTo(standing: CustomerStanding): boolean;
  rate: number;
}

/**
 * The policy-wide clauses the MHPCO's rulebook currently contains: the initial
 * assessment surcharge levied on every first insurance, the loyalty discount
 * granted to a long-standing customer, and the follow-up discount granted on
 * each contract after the customer's first.
 */
const POLICY_WIDE_CLAUSES: PolicyWideClause[] = [
  { appliesTo: isFirstInsurance, rate: FIRST_INSURANCE_SURCHARGE_RATE },
  { appliesTo: isLongStanding, rate: -LOYALTY_DISCOUNT_RATE },
  { appliesTo: isFollowUpContract, rate: -FOLLOW_UP_DISCOUNT_RATE },
];

/**
 * The net total of the MHPCO's policy-wide modifiers, each levied on the policy
 * base premium and never on an already-modified amount.
 */
export function policyWideModifiers(policyBase: number, standing: CustomerStanding): number {
  return POLICY_WIDE_CLAUSES.filter((clause) => clause.appliesTo(standing)).reduce(
    (running, clause) => running + policyBase * clause.rate,
    0,
  );
}
