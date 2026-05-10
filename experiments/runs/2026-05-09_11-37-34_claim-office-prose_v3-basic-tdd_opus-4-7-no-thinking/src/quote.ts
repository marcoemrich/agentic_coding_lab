import type { Customer, Item } from './types.js';
import {
  isComponent,
  getMainItemPricing,
  getComponentBasePremium,
  getComponentBundleBasePremium,
  getComponentBundleSize,
} from './items.js';

const CURSED_SURCHARGE = 0.5;
const HIGH_ENCHANTMENT_THRESHOLD = 5;
const HIGH_ENCHANTMENT_SURCHARGE = 0.3;
const LOYALTY_YEARS_THRESHOLD = 2;
const LOYALTY_DISCOUNT = 0.2;
const FIRST_INSURANCE_SURCHARGE = 0.1;
const SUBSEQUENT_DISCOUNT = 0.15;
const PROCESSING_FEE = 5;

/**
 * Compute the per-item premium with cursed and high-enchantment surcharges
 * applied multiplicatively.
 */
function applyItemModifiers(base: number, item: Item): number {
  let amount = base;
  if (item.cursed) amount *= 1 + CURSED_SURCHARGE;
  if (item.enchantment >= HIGH_ENCHANTMENT_THRESHOLD) {
    amount *= 1 + HIGH_ENCHANTMENT_SURCHARGE;
  }
  return amount;
}

/**
 * Group component items by type and compute their base premium contribution.
 * 3 alike components form a bundle priced at COMPONENT_BUNDLE_BASE_PREMIUM.
 * Remaining components beyond bundles are priced individually.
 *
 * Returns the sum of (base, modifiers per item) contributions.
 *
 * Note: For bundle pricing, the cursed/enchantment surcharges are applied to
 * the bundle's base premium per-bundle, using the items in the bundle. We
 * apply the highest-risk modifier set among the items in the bundle? The spec
 * is ambiguous; we apply modifiers per-item-equivalent: the bundle's base is
 * spread evenly (60/3=20 per item-slot), and we apply each item's modifiers
 * to its share.
 */
function componentContribution(items: Item[]): number {
  // Group by type
  const byType = new Map<string, Item[]>();
  for (const item of items) {
    const list = byType.get(item.type) ?? [];
    list.push(item);
    byType.set(item.type, list);
  }
  let total = 0;
  const bundleSize = getComponentBundleSize();
  const bundleBase = getComponentBundleBasePremium();
  const singleBase = getComponentBasePremium();
  for (const [, group] of byType) {
    const numBundles = Math.floor(group.length / bundleSize);
    const remainder = group.length % bundleSize;
    let idx = 0;
    for (let b = 0; b < numBundles; b++) {
      // Bundle of bundleSize items priced at bundleBase total.
      // Apply per-item modifiers proportionally.
      const perSlot = bundleBase / bundleSize;
      for (let s = 0; s < bundleSize; s++) {
        total += applyItemModifiers(perSlot, group[idx]);
        idx++;
      }
    }
    for (let r = 0; r < remainder; r++) {
      total += applyItemModifiers(singleBase, group[idx]);
      idx++;
    }
  }
  return total;
}

/**
 * Compute the premium for a list of items for a given customer.
 *
 * @param contractIndex 0-based index of this contract among the customer's
 *                      contracts in the current scenario. The first contract
 *                      (index 0) carries the initial assessment surcharge;
 *                      subsequent contracts get the loyalty-style discount.
 */
export function computeQuote(
  customer: Customer,
  items: Item[],
  contractIndex: number,
): number {
  // Sum base premium contributions, applying per-item cursed/enchantment
  // surcharges.
  let base = 0;
  // Main items
  for (const item of items) {
    if (isComponent(item)) continue;
    const pricing = getMainItemPricing(item.type);
    if (!pricing) continue;
    base += applyItemModifiers(pricing.basePremium, item);
  }
  // Components (with bundle pricing)
  const components = items.filter(isComponent);
  base += componentContribution(components);

  // Customer-level modifiers (multiplicative)
  let amount = base;
  if (customer.yearsWithMHPCO >= LOYALTY_YEARS_THRESHOLD) {
    amount *= 1 - LOYALTY_DISCOUNT;
  }
  if (contractIndex === 0) {
    amount *= 1 + FIRST_INSURANCE_SURCHARGE;
  } else {
    amount *= 1 - SUBSEQUENT_DISCOUNT;
  }
  amount += PROCESSING_FEE;

  // Round up in MHPCO's favor
  return Math.ceil(amount - 1e-9);
}
