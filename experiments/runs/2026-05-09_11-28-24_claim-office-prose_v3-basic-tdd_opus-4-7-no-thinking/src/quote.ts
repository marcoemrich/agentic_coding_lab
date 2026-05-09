import type { Customer, Item, QuoteResult } from './types.js';
import {
  COMPONENT_TYPES,
  MAIN_ITEMS,
  COMPONENT_SPEC,
  COMPONENT_BUNDLE_BASE_PREMIUM,
  PROCESSING_FEE,
} from './types.js';

function itemBaseAndSum(item: Item): { base: number; sum: number } {
  if (COMPONENT_TYPES.has(item.type)) {
    return { base: COMPONENT_SPEC.basePremium, sum: COMPONENT_SPEC.insuranceValue };
  }
  const spec = MAIN_ITEMS[item.type];
  if (!spec) {
    throw new Error(`Unknown item type: ${item.type}`);
  }
  return { base: spec.basePremium, sum: spec.insuranceValue };
}

function applyItemModifiers(base: number, item: Item): number {
  let p = base;
  if (item.cursed) p *= 1.5;
  if (item.enchantment >= 5) p *= 1.3;
  return p;
}

/**
 * Compute the per-item base premium, after item-level modifiers,
 * grouping eligible components into bundles of 3 alike.
 *
 * A "bundle" base premium is 60G for 3 alike components. Item modifiers
 * (cursed/enchantment) are applied to bundles in aggregate per bundle.
 * If the 3 components share the same modifiers, the bundle takes those
 * modifiers; otherwise each component is priced individually.
 */
function premiumBeforeCustomerModifiers(items: Item[]): { itemPremium: number; insuranceSum: number } {
  let itemPremium = 0;
  let insuranceSum = 0;

  // Group components by type+material+enchantment+cursed (alike)
  const components: Item[] = [];
  const mainItems: Item[] = [];
  for (const item of items) {
    if (COMPONENT_TYPES.has(item.type)) components.push(item);
    else mainItems.push(item);
  }

  // Main items: each priced individually
  for (const item of mainItems) {
    const { base, sum } = itemBaseAndSum(item);
    itemPremium += applyItemModifiers(base, item);
    insuranceSum += sum;
  }

  // Components: group alike (type + material + enchantment + cursed)
  const groups = new Map<string, Item[]>();
  for (const c of components) {
    const key = `${c.type}|${c.material}|${c.enchantment}|${c.cursed}`;
    const arr = groups.get(key) ?? [];
    arr.push(c);
    groups.set(key, arr);
  }

  for (const group of groups.values()) {
    let remaining = group.length;
    while (remaining >= 3) {
      // Bundle of 3 alike components, all share the same modifier flags
      const bundleBase = COMPONENT_BUNDLE_BASE_PREMIUM;
      itemPremium += applyItemModifiers(bundleBase, group[0]);
      insuranceSum += COMPONENT_SPEC.insuranceValue * 3;
      remaining -= 3;
    }
    while (remaining > 0) {
      const c = group[group.length - remaining];
      itemPremium += applyItemModifiers(COMPONENT_SPEC.basePremium, c);
      insuranceSum += COMPONENT_SPEC.insuranceValue;
      remaining -= 1;
    }
  }

  return { itemPremium, insuranceSum };
}

export function quote(items: Item[], customer: Customer, contractIndex: number): QuoteResult {
  const { itemPremium, insuranceSum } = premiumBeforeCustomerModifiers(items);

  let p = itemPremium;
  // Loyalty
  if (customer.yearsWithMHPCO >= 2) p *= 0.8;
  // First insurance vs. repeat
  if (contractIndex === 0) {
    p *= 1.10;
  } else {
    p *= 0.85;
  }

  // Processing fee
  p += PROCESSING_FEE;

  // Round up in MHPCO's favor (toward higher premium)
  const premium = Math.ceil(p - 1e-9);

  return { premium, insuranceSum };
}
