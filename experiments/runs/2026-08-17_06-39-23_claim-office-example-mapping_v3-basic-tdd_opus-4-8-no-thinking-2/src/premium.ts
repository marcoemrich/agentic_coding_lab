import type { Item, Customer } from './types.js';
import {
  isMainItem,
  isComponent,
  isKnownItemType,
  mainItemEntry,
  COMPONENT_BASE_PREMIUM,
  COMPONENT_BLOCK_SIZE,
  COMPONENT_BLOCK_PREMIUM,
} from './catalog.js';

export class UnknownItemError extends Error {
  constructor(type: string) {
    super(`Unknown item type: ${type}`);
    this.name = 'UnknownItemError';
  }
}

const HIGH_ENCHANTMENT_THRESHOLD = 5;
const CURSE_SURCHARGE = 0.5;
const HIGH_ENCHANTMENT_SURCHARGE = 0.3;
const LOYALTY_DISCOUNT = 0.2;
const LOYALTY_YEARS_THRESHOLD = 2;
const FIRST_INSURANCE_SURCHARGE = 0.1;
const FOLLOWUP_DISCOUNT = 0.15;
const PROCESSING_FEE = 5;

// Base premium of a single item ignoring blocks (used for main items and as
// the per-component base). Components are handled in aggregate for blocks.
function itemBasePremium(item: Item): number {
  if (isMainItem(item.type)) {
    return mainItemEntry(item.type).basePremium;
  }
  if (isComponent(item.type)) {
    return COMPONENT_BASE_PREMIUM;
  }
  throw new UnknownItemError(item.type);
}

// Sum of base premiums across the policy, applying the "block of exactly 3
// alike components" special price per component type.
export function policyBasePremium(items: Item[]): number {
  let total = 0;
  const componentCounts = new Map<string, number>();

  for (const item of items) {
    if (isMainItem(item.type)) {
      total += mainItemEntry(item.type).basePremium;
    } else if (isComponent(item.type)) {
      componentCounts.set(item.type, (componentCounts.get(item.type) ?? 0) + 1);
    } else {
      throw new UnknownItemError(item.type);
    }
  }

  for (const count of componentCounts.values()) {
    if (count === COMPONENT_BLOCK_SIZE) {
      total += COMPONENT_BLOCK_PREMIUM;
    } else {
      total += count * COMPONENT_BASE_PREMIUM;
    }
  }

  return total;
}

function isHighlyEnchanted(item: Item): boolean {
  return (item.enchantment ?? 0) >= HIGH_ENCHANTMENT_THRESHOLD;
}

// Sum of item-specific surcharges (curse, high enchantment), each computed on
// the affected item's own base premium.
function itemSurcharges(items: Item[]): number {
  let total = 0;
  for (const item of items) {
    if (!isKnownItemType(item.type)) {
      throw new UnknownItemError(item.type);
    }
    const base = itemBasePremium(item);
    if (item.cursed) {
      total += base * CURSE_SURCHARGE;
    }
    if (isHighlyEnchanted(item)) {
      total += base * HIGH_ENCHANTMENT_SURCHARGE;
    }
  }
  return total;
}

// Round to whole G in the MHPCO's favour: premiums round up.
function roundPremium(amount: number): number {
  return Math.ceil(amount);
}

/**
 * Compute the total premium for a quote.
 *
 * @param items the items to insure
 * @param customer the customer (for loyalty)
 * @param contractIndex zero-based index of this quote among the customer's
 *   quotes in the scenario (0 = first ever contract)
 */
export function quotePremium(
  items: Item[],
  customer: Customer,
  contractIndex: number,
): number {
  const policyBase = policyBasePremium(items);
  const surcharges = itemSurcharges(items);

  let total = policyBase + surcharges;

  // Policy-wide modifiers, all computed on the policy base premium.
  if (customer.yearsWithMHPCO >= LOYALTY_YEARS_THRESHOLD) {
    total -= policyBase * LOYALTY_DISCOUNT;
  }
  // First-insurance surcharge always applies: each item in a quote is treated
  // as a first insurance regardless of customer history.
  total += policyBase * FIRST_INSURANCE_SURCHARGE;
  if (contractIndex > 0) {
    total -= policyBase * FOLLOWUP_DISCOUNT;
  }

  total += PROCESSING_FEE;

  return roundPremium(total);
}
