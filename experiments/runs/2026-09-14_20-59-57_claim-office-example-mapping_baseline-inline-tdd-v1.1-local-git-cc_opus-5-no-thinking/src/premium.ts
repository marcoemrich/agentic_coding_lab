import { Item, itemBasePremium, policyBasePremium } from './pricing.js';

export interface Customer {
  yearsWithMHPCO: number;
}

const CURSE_SURCHARGE = 0.5;
const HIGH_ENCHANTMENT_SURCHARGE = 0.3;
const HIGH_ENCHANTMENT_THRESHOLD = 5;
const LOYALTY_DISCOUNT = 0.2;
const LOYALTY_THRESHOLD = 2;
const FIRST_INSURANCE_SURCHARGE = 0.1;
const FOLLOW_UP_DISCOUNT = 0.15;
const PROCESSING_FEE = 5;

/**
 * Surcharges tied to a single item, expressed in G. They are computed from
 * that item's own base premium, never from the policy total.
 */
function itemSurcharges(item: Item): number {
  const base = itemBasePremium(item);
  let surcharge = 0;
  if (item.cursed) surcharge += base * CURSE_SURCHARGE;
  if ((item.enchantment ?? 0) >= HIGH_ENCHANTMENT_THRESHOLD) {
    surcharge += base * HIGH_ENCHANTMENT_SURCHARGE;
  }
  return surcharge;
}

/**
 * Policy-wide adjustments in G. Each is a percentage of the policy base
 * premium (the sum of the item base premiums), not of the running subtotal,
 * so the order in which they are applied does not matter.
 *
 * Every item in a quote counts as a first insurance regardless of customer
 * history, so that surcharge stacks with the follow-up contract discount.
 */
function policyAdjustments(
  base: number,
  customer: Customer,
  precedingContracts: number,
): number {
  let adjustment = base * FIRST_INSURANCE_SURCHARGE;
  if (customer.yearsWithMHPCO >= LOYALTY_THRESHOLD) {
    adjustment -= base * LOYALTY_DISCOUNT;
  }
  if (precedingContracts > 0) {
    adjustment -= base * FOLLOW_UP_DISCOUNT;
  }
  return adjustment;
}

/**
 * Total premium in whole G for insuring `items`, rounded up (the MHPCO's
 * favour). Intermediate amounts are kept as fractions.
 *
 * `precedingContracts` is how many quotes the customer already made in this
 * scenario; from the second contract on, the follow-up discount applies.
 */
export function quotePremium(
  items: Item[],
  customer: Customer,
  precedingContracts: number,
): number {
  const base = policyBasePremium(items);
  const surcharges = items.reduce((sum, item) => sum + itemSurcharges(item), 0);
  const adjustments = policyAdjustments(base, customer, precedingContracts);

  return Math.ceil(base + surcharges + adjustments + PROCESSING_FEE);
}
