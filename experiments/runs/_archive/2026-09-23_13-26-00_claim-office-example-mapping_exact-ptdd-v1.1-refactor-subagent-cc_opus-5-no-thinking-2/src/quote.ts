import { policyBasePremium, type Item } from "./item-pricing.js";
import { policyItemRiskSurcharges } from "./item-risk.js";
import { roundAmountOfficeReceives } from "./office-favour-rounding.js";
import {
  policyWideModifiers,
  standingOf,
  type Customer,
  type CustomerStanding,
} from "./policy-wide-modifiers.js";

export type { Item, Customer };

const PROCESSING_FEE = 5;

/**
 * The MHPCO's rule about the scope of each modifier: an item-specific risk
 * surcharge is levied on the base premium of its own item, while a policy-wide
 * modifier is levied on the policy base premium — never on an already-modified
 * amount. All parts are kept as exact fractions here.
 */
function premiumBeforeProcessingFee(standing: CustomerStanding, items: Item[]): number {
  const policyBase = policyBasePremium(items);
  return policyBase + policyItemRiskSurcharges(items) + policyWideModifiers(policyBase, standing);
}

/**
 * How the MHPCO assembles a premium: the modified premium for the insured
 * items, with the processing fee added at the very end and the total rounded in
 * the office's favour.
 */
export function quote(customer: Customer, items: Item[], previousQuoteCount: number): number {
  return roundAmountOfficeReceives(
    premiumBeforeProcessingFee(standingOf(customer, previousQuoteCount), items) + PROCESSING_FEE,
  );
}
