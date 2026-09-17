/**
 * MHPCO's rating of a policy as a whole, as opposed to the items on it.
 *
 * This module owns one underwriting policy: the modifiers the office charges or
 * credits on the *policy* base premium — the sum of all item base premiums —
 * rather than on any single item. They turn on the customer's standing with the
 * office and on the office's own assessment habits, not on what is insured,
 * which is what keeps them apart from the item-specific risk surcharges.
 *
 * The processing fee is deliberately not here: it is a flat charge added after
 * every modifier, not a rating of the policy base premium.
 */

import { type Customer } from "./customer.js";

const PERCENT = 100;

/**
 * A policy-wide modifier: when the office applies it, and the percentage of the
 * policy base premium it moves. A positive rate is a surcharge the customer
 * owes, a negative rate a discount the office grants.
 */
interface PolicyModifier {
  readonly appliesTo: (customer: Customer) => boolean;
  readonly ratePercent: number;
}

/**
 * Every item in a quote is treated as a first insurance regardless of customer
 * history, so the initial assessment surcharge is charged on every policy.
 */
const INITIAL_ASSESSMENT_SURCHARGE_PERCENT = 10;

/**
 * A long-standing customer is one who has been with MHPCO for 2 years or more;
 * the office credits their loyalty against the policy base premium.
 */
const LONG_STANDING_FROM_YEARS = 2;
const LOYALTY_DISCOUNT_PERCENT = -20;

/**
 * Every contract after the customer's first is a follow-up contract; the office
 * credits the customer's return against the policy base premium.
 */
const FIRST_CONTRACT_COUNT = 1;
const FOLLOW_UP_CONTRACT_DISCOUNT_PERCENT = -15;

/**
 * The office's register of policy-wide modifiers. Each entry is an independent
 * ruling: a further modifier is added here, and the rate of an existing one is
 * revised here, without touching how a premium is assembled.
 */
const POLICY_MODIFIERS: readonly PolicyModifier[] = [
  { appliesTo: () => true, ratePercent: INITIAL_ASSESSMENT_SURCHARGE_PERCENT },
  {
    appliesTo: (customer) => customer.yearsWithMHPCO >= LONG_STANDING_FROM_YEARS,
    ratePercent: LOYALTY_DISCOUNT_PERCENT,
  },
  {
    appliesTo: (customer) => customer.previousContracts >= FIRST_CONTRACT_COUNT,
    ratePercent: FOLLOW_UP_CONTRACT_DISCOUNT_PERCENT,
  },
];

/**
 * Records that MHPCO has written a contract for this customer: every policy
 * the office writes counts towards the standing the next one is rated against.
 */
export function afterWritingAContract(customer: Customer): Customer {
  return { ...customer, previousContracts: customer.previousContracts + 1 };
}

/**
 * The net policy-wide modifier MHPCO applies to a policy base premium: the
 * surcharges the customer owes less the discounts their standing earns.
 */
export function policyModifiers(customer: Customer, policyBasePremium: number): number {
  return POLICY_MODIFIERS.filter((modifier) => modifier.appliesTo(customer)).reduce(
    (total, modifier) => total + (policyBasePremium * modifier.ratePercent) / PERCENT,
    0,
  );
}
