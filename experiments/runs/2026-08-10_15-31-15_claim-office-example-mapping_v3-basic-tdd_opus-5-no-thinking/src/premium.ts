import { BLOCK_PREMIUM, BLOCK_SIZE, isComponent, lookup } from './catalog.js';
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
 * Base premium of the components of one type. The block price is offered for
 * exactly BLOCK_SIZE alike components; any other count is priced per piece
 * (4 runes cost 100 G, not one block plus a single).
 */
function componentBasePremium(count: number, perPiece: number): number {
  return count === BLOCK_SIZE ? BLOCK_PREMIUM : count * perPiece;
}

/** Item base premiums, keyed so that alike components can be grouped into blocks. */
function basePremiums(items: Item[]): Map<string, number> {
  const counts = new Map<string, number>();
  const bases = new Map<string, number>();

  for (const item of items) {
    const entry = lookup(item.type);
    if (entry.component) {
      counts.set(item.type, (counts.get(item.type) ?? 0) + 1);
    }
  }

  for (const [type, count] of counts) {
    bases.set(type, componentBasePremium(count, lookup(type).basePremium));
  }
  return bases;
}

/** Surcharges that attach to a single item rather than to the whole policy. */
function itemSurcharges(items: Item[]): number {
  let total = 0;
  for (const item of items) {
    const base = lookup(item.type).basePremium;
    if (item.cursed) {
      total += base * CURSE_SURCHARGE;
    }
    if ((item.enchantment ?? 0) >= HIGH_ENCHANTMENT_THRESHOLD) {
      total += base * HIGH_ENCHANTMENT_SURCHARGE;
    }
  }
  return total;
}

/**
 * Total premium for a quote, rounded up to whole G (in the MHPCO's favor).
 *
 * Item-specific modifiers apply to the base premium of the affected item;
 * policy-wide modifiers apply to the policy base premium (the sum of all item
 * base premiums, block discounts included); the processing fee is added last.
 */
export function quotePremium(
  items: Item[],
  customer: Customer,
  previousContracts: number,
): number {
  const componentBases = basePremiums(items);

  let policyBase = 0;
  for (const item of items) {
    if (!isComponent(item.type)) {
      policyBase += lookup(item.type).basePremium;
    }
  }
  for (const base of componentBases.values()) {
    policyBase += base;
  }

  let total = policyBase + itemSurcharges(items);

  if (customer.yearsWithMHPCO >= LOYALTY_THRESHOLD) {
    total -= policyBase * LOYALTY_DISCOUNT;
  }
  // Every quote insures its items for the first time, regardless of history.
  total += policyBase * FIRST_INSURANCE_SURCHARGE;
  if (previousContracts > 0) {
    total -= policyBase * FOLLOW_UP_DISCOUNT;
  }

  return Math.ceil(total + PROCESSING_FEE);
}

/** Insurance sum of a policy: the unmodified insurance values of its items. */
export function insuranceSum(items: Item[]): number {
  return items.reduce((sum, item) => sum + lookup(item.type).insuranceValue, 0);
}
