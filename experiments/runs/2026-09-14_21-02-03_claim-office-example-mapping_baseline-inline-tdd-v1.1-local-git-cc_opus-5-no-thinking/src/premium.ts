import { Item, basePremium, itemBasePremium, isComponent } from './pricing.js';

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

/** Rounds in the MHPCO's favour: premiums always go up. */
export function roundPremium(amount: number): number {
  return Math.ceil(amount);
}

/**
 * Item-specific surcharges apply to the base premium of the affected item.
 * Components carry no enchantment level or material, so only their share of
 * the group premium is ever at stake; the kata gives them no curse either.
 */
function itemSurcharges(item: Item): number {
  if (isComponent(item.type)) return 0;

  const base = itemBasePremium(item);
  let surcharge = 0;

  if (item.cursed) surcharge += base * CURSE_SURCHARGE;
  if ((item.enchantment ?? 0) >= HIGH_ENCHANTMENT_THRESHOLD) {
    surcharge += base * HIGH_ENCHANTMENT_SURCHARGE;
  }

  return surcharge;
}

/**
 * Total premium for one quote.
 *
 * `precedingContracts` is the number of quotes the customer already made in
 * this scenario; every contract after the first carries a discount. The first
 * insurance surcharge applies to each item of every quote regardless of
 * customer history - each item is newly insured.
 */
export function quotePremium(
  customer: Customer,
  items: Item[],
  precedingContracts: number,
): number {
  const policyBase = basePremium(items);

  const itemSpecific = items.reduce((sum, item) => sum + itemSurcharges(item), 0);

  let policyWide = policyBase * FIRST_INSURANCE_SURCHARGE;
  if (customer.yearsWithMHPCO >= LOYALTY_THRESHOLD) {
    policyWide -= policyBase * LOYALTY_DISCOUNT;
  }
  if (precedingContracts > 0) {
    policyWide -= policyBase * FOLLOW_UP_DISCOUNT;
  }

  return roundPremium(policyBase + itemSpecific + policyWide + PROCESSING_FEE);
}
