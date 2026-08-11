import {
  COMPONENT_BLOCK_PREMIUM,
  COMPONENT_BLOCK_SIZE,
  isComponent,
  priceOf,
} from './priceList.js';
import type { Customer, Item } from './types.js';

const CURSE_SURCHARGE = 0.5;
const HIGH_ENCHANTMENT_SURCHARGE = 0.3;
const HIGH_ENCHANTMENT_THRESHOLD = 5;
const LOYALTY_DISCOUNT = 0.2;
const LOYALTY_THRESHOLD = 2;
const FIRST_INSURANCE_SURCHARGE = 0.1;
const FOLLOW_UP_DISCOUNT = 0.15;
const PROCESSING_FEE = 5;

/**
 * The base premium each item contributes. Components of a type that forms a
 * building block (exactly 3 alike) share the reduced block premium equally, so
 * that item-specific surcharges still attach to a single item's share.
 */
function itemBasePremiums(items: Item[]): number[] {
  const componentCounts = new Map<string, number>();
  for (const item of items) {
    if (isComponent(item.type)) {
      componentCounts.set(item.type, (componentCounts.get(item.type) ?? 0) + 1);
    }
  }

  return items.map((item) => {
    const isBlocked =
      isComponent(item.type) && componentCounts.get(item.type) === COMPONENT_BLOCK_SIZE;
    return isBlocked
      ? COMPONENT_BLOCK_PREMIUM / COMPONENT_BLOCK_SIZE
      : priceOf(item.type).basePremium;
  });
}

export function policyBasePremium(items: Item[]): number {
  return itemBasePremiums(items).reduce((sum, premium) => sum + premium, 0);
}

/** Surcharges that attach to the base premium of the affected item only. */
function itemSurcharges(items: Item[]): number {
  return itemBasePremiums(items).reduce((total, base, index) => {
    const item = items[index];
    let surcharge = 0;
    if (item.cursed) surcharge += base * CURSE_SURCHARGE;
    if ((item.enchantment ?? 0) >= HIGH_ENCHANTMENT_THRESHOLD) {
      surcharge += base * HIGH_ENCHANTMENT_SURCHARGE;
    }
    return total + surcharge;
  }, 0);
}

/**
 * Premium for one quote.
 *
 * @param previousContracts number of quotes already issued to this customer in
 *   the scenario; every contract after the first earns a discount.
 */
export function quotePremium(
  items: Item[],
  customer: Customer,
  previousContracts: number,
): number {
  const base = policyBasePremium(items);

  let premium = base + itemSurcharges(items);

  // Policy-wide modifiers all apply to the policy base premium.
  if (customer.yearsWithMHPCO >= LOYALTY_THRESHOLD) premium -= base * LOYALTY_DISCOUNT;
  premium += base * FIRST_INSURANCE_SURCHARGE;
  if (previousContracts > 0) premium -= base * FOLLOW_UP_DISCOUNT;

  // Rounded in the MHPCO's favour: premiums go up.
  return Math.ceil(premium + PROCESSING_FEE);
}
