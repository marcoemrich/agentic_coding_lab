import { priceItems } from "./item-price-rules.js";
import type { Customer, Item } from "./policy.js";
import { policyWideAdjustment } from "./policy-modifier.js";
import { premiumRoundedInMHPCOsFavour } from "./rounding.js";

/** Every premium carries the MHPCO's flat processing fee. */
const PROCESSING_FEE = 5;

/**
 * Item-specific modifiers apply to the base premium of the affected item;
 * policy-wide modifiers apply to the policy base premium; the processing
 * fee is added at the very end, so it is part of the amount that is
 * rounded.
 *
 * Every intermediate amount stays a fraction; only this final premium is
 * stated in whole G.
 */
export function quote(
  customer: Customer,
  items: readonly Item[],
  previousContracts: number,
): number {
  const { basePremium, riskSurcharges } = priceItems(items);

  const premium =
    basePremium +
    riskSurcharges +
    policyWideAdjustment({ customer, previousContracts }, basePremium) +
    PROCESSING_FEE;

  return premiumRoundedInMHPCOsFavour(premium);
}
