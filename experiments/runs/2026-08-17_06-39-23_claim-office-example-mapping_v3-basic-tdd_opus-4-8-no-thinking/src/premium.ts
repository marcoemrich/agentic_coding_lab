import type { Customer, Item } from './types.js';
import {
  BLOCK_BASE_PREMIUM,
  BLOCK_SIZE,
  COMPONENT_BASE_PREMIUM,
  CURSE_SURCHARGE,
  FIRST_INSURANCE_SURCHARGE,
  FOLLOWUP_DISCOUNT,
  HIGH_ENCHANTMENT_SURCHARGE,
  HIGH_ENCHANTMENT_THRESHOLD,
  LOYALTY_DISCOUNT,
  LOYALTY_YEARS_THRESHOLD,
  MAIN_ITEM_PRICING,
  PROCESSING_FEE,
  isComponent,
  isKnownItemType,
  isMainItem,
} from './pricing.js';

export class UnknownItemTypeError extends Error {
  constructor(type: string) {
    super(`Unknown item type: ${type}`);
    this.name = 'UnknownItemTypeError';
  }
}

/** Round a premium up to the whole G (in the MHPCO's favor). */
export function roundPremium(amount: number): number {
  return Math.ceil(amount);
}

/**
 * Base premium contributed by the components in the item list.
 * A block of exactly BLOCK_SIZE alike (same type) components is priced at
 * BLOCK_BASE_PREMIUM; the remainder is priced per component.
 */
function componentsBasePremium(items: Item[]): number {
  const counts = new Map<string, number>();
  for (const item of items) {
    if (isComponent(item.type)) {
      counts.set(item.type, (counts.get(item.type) ?? 0) + 1);
    }
  }

  let total = 0;
  for (const count of counts.values()) {
    // The block price applies only when a type appears exactly BLOCK_SIZE
    // times; any other count is priced per component.
    if (count === BLOCK_SIZE) {
      total += BLOCK_BASE_PREMIUM;
    } else {
      total += count * COMPONENT_BASE_PREMIUM;
    }
  }
  return total;
}

/** Base premium of a single main item (excluding item-specific surcharges). */
function mainItemBasePremium(item: Item): number {
  return MAIN_ITEM_PRICING[item.type].basePremium;
}

/** Item-specific surcharges (cursed, high enchantment) for one main item. */
function itemSurcharges(item: Item): number {
  const base = mainItemBasePremium(item);
  let surcharge = 0;
  if (item.cursed) {
    surcharge += base * CURSE_SURCHARGE;
  }
  if (
    item.enchantment !== undefined &&
    item.enchantment >= HIGH_ENCHANTMENT_THRESHOLD
  ) {
    surcharge += base * HIGH_ENCHANTMENT_SURCHARGE;
  }
  return surcharge;
}

/**
 * Compute the total premium for a list of items.
 *
 * - Policy base premium = sum of all item base premiums (with component blocks).
 * - Item-specific surcharges (cursed, high enchantment) are added, computed on
 *   the affected item's base premium.
 * - Policy-wide modifiers (loyalty, first insurance, follow-up contract) are
 *   computed as a percentage of the policy base premium.
 * - The processing fee is added at the very end.
 * - The final premium is rounded up (in the MHPCO's favor).
 *
 * `contractIndex` is the zero-based index of this quote among the customer's
 * quotes in the scenario (0 = first contract).
 */
export function computePremium(
  items: Item[],
  customer: Customer,
  contractIndex = 0,
): number {
  assertKnownTypes(items);

  const policyBase = policyBasePremium(items);
  const total =
    policyBase +
    totalItemSurcharges(items) +
    policyModifiers(policyBase, customer, contractIndex) +
    PROCESSING_FEE;

  return roundPremium(total);
}

function assertKnownTypes(items: Item[]): void {
  for (const item of items) {
    if (!isKnownItemType(item.type)) {
      throw new UnknownItemTypeError(item.type);
    }
  }
}

/** Sum of all item base premiums (components priced with block rule). */
function policyBasePremium(items: Item[]): number {
  let base = componentsBasePremium(items);
  for (const item of items) {
    if (isMainItem(item.type)) {
      base += mainItemBasePremium(item);
    }
  }
  return base;
}

/** Sum of item-specific surcharges (cursed, high enchantment). */
function totalItemSurcharges(items: Item[]): number {
  let surcharge = 0;
  for (const item of items) {
    if (isMainItem(item.type)) {
      surcharge += itemSurcharges(item);
    }
  }
  return surcharge;
}

/**
 * Net policy-wide modifier amount (percentages of the policy base premium):
 * loyalty discount, first-insurance surcharge, follow-up contract discount.
 */
function policyModifiers(
  policyBase: number,
  customer: Customer,
  contractIndex: number,
): number {
  let net = 0;
  if (customer.yearsWithMHPCO >= LOYALTY_YEARS_THRESHOLD) {
    net -= policyBase * LOYALTY_DISCOUNT;
  }
  // First insurance surcharge: each quote's items are treated as first
  // insurance regardless of customer history.
  net += policyBase * FIRST_INSURANCE_SURCHARGE;
  // Follow-up contract discount: applies to every contract after the first.
  if (contractIndex > 0) {
    net -= policyBase * FOLLOWUP_DISCOUNT;
  }
  return net;
}
