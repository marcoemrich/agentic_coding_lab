import {
  BLOCK_PREMIUM,
  BLOCK_SIZE,
  Customer,
  Item,
  isComponent,
  priceOf,
} from './catalog.js';
import { roundUp } from './rounding.js';

const PROCESSING_FEE = 5;
const CURSE_SURCHARGE = 0.5;
const HIGH_ENCHANTMENT_SURCHARGE = 0.3;
const HIGH_ENCHANTMENT_THRESHOLD = 5;
const LOYALTY_DISCOUNT = 0.2;
const LOYALTY_YEARS = 2;
const FIRST_INSURANCE_SURCHARGE = 0.1;
const FOLLOW_UP_DISCOUNT = 0.15;

/**
 * Base premium of all components. A group of exactly BLOCK_SIZE alike
 * components is charged the block rate; any other count is charged per piece.
 * "Alike" means the same type, so runes and moonstones never share a block.
 * The block is all-or-nothing: 4 runes cost 100 G, not 60 + 25.
 */
function componentsBasePremium(items: Item[]): number {
  const countsByType = new Map<string, number>();
  for (const item of items) {
    countsByType.set(item.type, (countsByType.get(item.type) ?? 0) + 1);
  }

  let total = 0;
  for (const [type, count] of countsByType) {
    total +=
      count === BLOCK_SIZE
        ? BLOCK_PREMIUM
        : count * priceOf(type).basePremium;
  }
  return total;
}

/**
 * Sum of all item base premiums, with the block rate applied to components.
 * Item-specific surcharges and policy-wide modifiers are not included.
 */
export function policyBasePremium(items: Item[]): number {
  const components = items.filter((item) => isComponent(item.type));
  const mainItems = items.filter((item) => !isComponent(item.type));
  return (
    componentsBasePremium(components) +
    mainItems.reduce((sum, item) => sum + priceOf(item.type).basePremium, 0)
  );
}

/** Item-specific surcharges, applied to that item's own base premium. */
function itemSurcharges(item: Item): number {
  const base = priceOf(item.type).basePremium;
  let surcharge = 0;
  if (item.cursed) surcharge += base * CURSE_SURCHARGE;
  if ((item.enchantment ?? 0) >= HIGH_ENCHANTMENT_THRESHOLD) {
    surcharge += base * HIGH_ENCHANTMENT_SURCHARGE;
  }
  return surcharge;
}

/**
 * Total premium for a policy, rounded up (in the MHPCO's favor).
 *
 * @param contractIndex zero-based number of previous contracts; every contract
 *   after the first receives the follow-up discount.
 */
export function quotePremium(
  customer: Customer,
  contractIndex: number,
  items: Item[],
): number {
  // Validate every item up front so unknown types fail before any arithmetic.
  for (const item of items) priceOf(item.type);

  const policyBase = policyBasePremium(items);
  const surcharges = items.reduce((sum, item) => sum + itemSurcharges(item), 0);

  let total = policyBase + surcharges;

  // Policy-wide modifiers apply to the policy base premium.
  if (customer.yearsWithMHPCO >= LOYALTY_YEARS) {
    total -= policyBase * LOYALTY_DISCOUNT;
  }
  // Each item in a quote counts as a first insurance, regardless of history.
  if (items.length > 0) {
    total += policyBase * FIRST_INSURANCE_SURCHARGE;
  }
  if (contractIndex > 0) {
    total -= policyBase * FOLLOW_UP_DISCOUNT;
  }

  return roundUp(total + PROCESSING_FEE);
}
