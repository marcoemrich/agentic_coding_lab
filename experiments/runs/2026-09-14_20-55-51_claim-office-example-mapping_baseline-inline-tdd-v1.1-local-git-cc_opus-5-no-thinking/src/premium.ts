import { specFor, isComponent, BLOCK_SIZE, BLOCK_PREMIUM, PROCESSING_FEE } from './domain.js';

export interface QuoteItem {
  type: string;
  material?: string;
  enchantment?: number;
  cursed?: boolean;
}

export interface Customer {
  yearsWithMHPCO: number;
}

export const CURSE_SURCHARGE = 0.5;
export const HIGH_ENCHANTMENT_SURCHARGE = 0.3;
export const HIGH_ENCHANTMENT_THRESHOLD = 5;
export const LOYALTY_DISCOUNT = 0.2;
export const LOYALTY_YEARS = 2;
export const FIRST_INSURANCE_SURCHARGE = 0.1;
export const FOLLOW_UP_DISCOUNT = 0.15;

/**
 * Base premium of a single item, ignoring component blocks. Blocks are a
 * property of a group of alike components, so they are resolved in
 * `componentBasePremium` rather than per item.
 */
function itemBasePremium(item: QuoteItem): number {
  return specFor(item.type).basePremium;
}

/**
 * A building block of exactly BLOCK_SIZE alike components is offered at a
 * flat BLOCK_PREMIUM. Counts that are not an exact multiple of the block
 * size are billed per component, since the block requires exactly 3.
 */
function componentBasePremium(type: string, count: number): number {
  const perItem = specFor(type).basePremium;
  if (count > 0 && count % BLOCK_SIZE === 0) {
    return (count / BLOCK_SIZE) * BLOCK_PREMIUM;
  }
  return count * perItem;
}

/**
 * Item-specific surcharges (cursed, high enchantment) apply to the base
 * premium of the affected item only, never to the policy total.
 */
function itemSurcharges(item: QuoteItem): number {
  const base = itemBasePremium(item);
  let surcharge = 0;
  if (item.cursed) surcharge += base * CURSE_SURCHARGE;
  if ((item.enchantment ?? 0) >= HIGH_ENCHANTMENT_THRESHOLD) {
    surcharge += base * HIGH_ENCHANTMENT_SURCHARGE;
  }
  return surcharge;
}

export function policyBasePremium(items: QuoteItem[]): number {
  const componentCounts = new Map<string, number>();
  let total = 0;
  for (const item of items) {
    if (isComponent(item.type)) {
      componentCounts.set(item.type, (componentCounts.get(item.type) ?? 0) + 1);
    } else {
      total += itemBasePremium(item);
    }
  }
  for (const [type, count] of componentCounts) {
    total += componentBasePremium(type, count);
  }
  return total;
}

export function insuranceSum(items: QuoteItem[]): number {
  return items.reduce((sum, item) => sum + specFor(item.type).insuranceValue, 0);
}

/** Rounded in the MHPCO's favor: premiums always round up. */
export function computePremium(
  items: QuoteItem[],
  customer: Customer,
  isFollowUpContract: boolean,
): number {
  const base = policyBasePremium(items);
  let total = base;

  for (const item of items) {
    total += itemSurcharges(item);
  }

  if (customer.yearsWithMHPCO >= LOYALTY_YEARS) total -= base * LOYALTY_DISCOUNT;
  // Every item in a quote counts as a first insurance, regardless of how long
  // the customer has been with the MHPCO.
  total += base * FIRST_INSURANCE_SURCHARGE;
  if (isFollowUpContract) total -= base * FOLLOW_UP_DISCOUNT;

  return Math.ceil(total + PROCESSING_FEE);
}
