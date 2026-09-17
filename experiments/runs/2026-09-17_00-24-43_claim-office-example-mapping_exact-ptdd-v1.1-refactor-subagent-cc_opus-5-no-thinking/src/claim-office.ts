/**
 * MHPCO's counter: the two things the office does, and the order it does them
 * in.
 *
 * This module owns no ruling of the office's — every amount it assembles is
 * ruled on in a module of its own. What it owns is the *order*: a premium is
 * billed price list first and processing fee last, and a damage report is
 * settled clauses first, cap next, and the office's favour taken once at the
 * very end. Those orders are themselves rulings of the office's, and revising
 * one of them is an edit here and nowhere else.
 *
 * It is also the face the rest of the system addresses the office through, so
 * the types a caller needs are re-exported from here rather than gathered by
 * the caller from the modules that happen to define them.
 */

import { policyBasePremium, policyInsuranceSum } from "./price-list.js";
import { type Item } from "./item.js";
import { itemRiskSurcharges } from "./item-risk.js";
import { policyModifiers } from "./customer-standing.js";
import { type Customer } from "./customer.js";
import { roundPayoutInMHPCOFavour, roundPremiumInMHPCOFavour } from "./mhpco-rounding.js";
import { capPayout, incidentReimbursement, payoutCap, type Incident } from "./claims.js";
import { coverageOf } from "./policy-coverage.js";
import { processingFee } from "./processing-fee.js";

export type { Item, Customer };
export type { Incident, Damage } from "./claims.js";

/** A policy MHPCO has written: what it covers and what it was quoted for. */
export interface Policy {
  readonly premium: number;
  readonly insuranceSum: number;
  readonly items: readonly Item[];
  /** What the office may still pay out on this policy. */
  readonly remainingCap: number;
}

/**
 * The settlement of one claim: what MHPCO pays, and the policy as it stands
 * afterwards — a claim consumes part of the cap, so later claims against the
 * same policy are settled against what is left, and `policy.remainingCap` is
 * the one record of what the office may still pay out.
 */
export interface Settlement {
  readonly payout: number;
  readonly policy: Policy;
}

/**
 * Writes a policy for the items the customer wishes to insure: the premium they
 * owe, and the insurance sum the office's payouts are measured against.
 */
export function createPolicy(customer: Customer, items: readonly Item[]): Policy {
  const insuranceSum = policyInsuranceSum(items);
  return {
    premium: quote(customer, items),
    insuranceSum,
    items,
    remainingCap: payoutCap(insuranceSum),
  };
}

/**
 * Settles a damage report against a policy MHPCO has written, in the order the
 * office settles it: what the report's damages come to under the reimbursement
 * clauses, held down to what the policy's cap still allows, and rounded once at
 * the end — the amount that actually leaves the office is the final payout, so
 * the office's favour is taken on that and not on the uncapped total.
 *
 * Each of those rulings is made elsewhere; this function only knows their order.
 */
export function claim(policy: Policy, incident: Incident): Settlement {
  const owed = incidentReimbursement(incident, coverageOf(policy.items));
  const capped = capPayout(owed, policy.remainingCap);
  return {
    payout: roundPayoutInMHPCOFavour(capped.payout),
    policy: { ...policy, remainingCap: capped.remainingCap },
  };
}

/**
 * Assembles the bill in the order the office bills it: the price-list base
 * premium of the policy, the risk surcharges its individual items carry, the
 * modifiers rated on the policy as a whole, and finally the processing fee.
 *
 * Each of those amounts is ruled on elsewhere; this function only knows the
 * order they are applied in and that the total is rounded once, at the end.
 */
export function quote(customer: Customer, items: readonly Item[]): number {
  const policyBase = policyBasePremium(items);
  const premium =
    policyBase +
    itemRiskSurcharges(items) +
    policyModifiers(customer, policyBase) +
    processingFee();
  return roundPremiumInMHPCOFavour(premium);
}
