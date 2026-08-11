import type { Customer, Item } from './types.js';
import { BLOCK_BASE_PREMIUM, BLOCK_SIZE, lookUp } from './priceList.js';

const CURSE_SURCHARGE = 0.5;
const HIGH_ENCHANTMENT_SURCHARGE = 0.3;
const HIGH_ENCHANTMENT_THRESHOLD = 5;
const LOYALTY_DISCOUNT = 0.2;
const LOYALTY_THRESHOLD = 2;
const FIRST_INSURANCE_SURCHARGE = 0.1;
const FOLLOW_UP_DISCOUNT = 0.15;
const PROCESSING_FEE = 5;

/**
 * Base premium of the components in the policy. Components of the same type
 * form building blocks of exactly 3; leftovers are charged individually.
 */
export function componentsBasePremium(components: Item[]): number {
  const countsByType = new Map<string, number>();
  for (const item of components) {
    countsByType.set(item.type, (countsByType.get(item.type) ?? 0) + 1);
  }

  let total = 0;
  for (const [type, count] of countsByType) {
    // The block rate is offered for exactly 3 alike components; 4 or 7 runes
    // are charged individually, at the full rate.
    total +=
      count === BLOCK_SIZE ? BLOCK_BASE_PREMIUM : count * lookUp(type).basePremium;
  }
  return total;
}

/** Surcharges that attach to a single item rather than to the whole policy. */
function itemSurcharges(item: Item, basePremium: number): number {
  let surcharge = 0;
  if (item.cursed) {
    surcharge += basePremium * CURSE_SURCHARGE;
  }
  if ((item.enchantment ?? 0) >= HIGH_ENCHANTMENT_THRESHOLD) {
    surcharge += basePremium * HIGH_ENCHANTMENT_SURCHARGE;
  }
  return surcharge;
}

/**
 * Premium for a single quote. `previousContracts` is the number of quotes the
 * customer has already taken out in this scenario; every contract after the
 * first earns a discount.
 */
export function quotePremium(
  items: Item[],
  customer: Customer,
  previousContracts: number,
): number {
  const components = items.filter((item) => lookUp(item.type).isComponent);
  const mainItems = items.filter((item) => !lookUp(item.type).isComponent);

  // The policy base premium is the sum of the item base premiums, block
  // discounts included but item-specific surcharges excluded.
  const policyBase =
    componentsBasePremium(components) +
    mainItems.reduce((sum, item) => sum + lookUp(item.type).basePremium, 0);

  // Item-specific modifiers apply to the base premium of the affected item.
  // A component's share of a block discount is not itself surcharged, so
  // component surcharges are computed from the individual component rate.
  const surcharges = items.reduce(
    (sum, item) => sum + itemSurcharges(item, lookUp(item.type).basePremium),
    0,
  );

  // Policy-wide modifiers apply to the policy base premium.
  let premium = policyBase + surcharges;
  if (customer.yearsWithMHPCO >= LOYALTY_THRESHOLD) {
    premium -= policyBase * LOYALTY_DISCOUNT;
  }
  // Each item in a quote is treated as a first insurance, regardless of
  // customer history.
  premium += policyBase * FIRST_INSURANCE_SURCHARGE;
  if (previousContracts > 0) {
    premium -= policyBase * FOLLOW_UP_DISCOUNT;
  }

  // The fee is added at the very end; rounding favours the MHPCO.
  return Math.ceil(premium + PROCESSING_FEE);
}
