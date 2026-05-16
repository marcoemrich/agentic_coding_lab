import type { Item } from "./types.js";

export interface ItemPricing {
  insuranceValue: number;
  basePremium: number;
}

const MAIN_PRICING: Record<string, ItemPricing> = {
  sword: { insuranceValue: 1000, basePremium: 100 },
  amulet: { insuranceValue: 600, basePremium: 60 },
  staff: { insuranceValue: 800, basePremium: 80 },
  potion: { insuranceValue: 400, basePremium: 40 },
};

const COMPONENT_TYPES = new Set(["rune", "moonstone"]);
const COMPONENT_INSURANCE = 250;
const COMPONENT_BASE = 25;
const COMPONENT_BUNDLE_SIZE = 3;
const COMPONENT_BUNDLE_BASE = 60;

export function isComponent(type: string): boolean {
  return COMPONENT_TYPES.has(type);
}

export function isMainItem(type: string): boolean {
  return type in MAIN_PRICING;
}

export function itemInsuranceValue(item: Item): number {
  if (isMainItem(item.type)) {
    return MAIN_PRICING[item.type].insuranceValue;
  }
  if (isComponent(item.type)) {
    return COMPONENT_INSURANCE;
  }
  return 0;
}

export function totalInsuranceSum(items: Item[]): number {
  return items.reduce((sum, item) => sum + itemInsuranceValue(item), 0);
}

/**
 * Compute the base premium for a list of items, applying the
 * component bundle discount where 3 alike components cost 60 G
 * instead of 75 G.
 *
 * Per-item modifiers (cursed, high enchantment) apply to each item's
 * base premium individually, and components grouped into a bundle
 * share the bundle's base premium proportionally — that is, the
 * bundle's 60 G is split across the 3 items so per-item modifiers
 * can still apply per item.
 *
 * Approach: compute each item's effective per-item base premium
 * (after bundle discounts), then apply per-item modifiers.
 */
export function computeItemPremiums(items: Item[]): number[] {
  // First, determine base premium per item, accounting for component bundles.
  const basePerItem: number[] = new Array(items.length).fill(0);

  // Track which items are components and their indices grouped by type.
  const componentIndicesByType: Map<string, number[]> = new Map();

  items.forEach((item, idx) => {
    if (isMainItem(item.type)) {
      basePerItem[idx] = MAIN_PRICING[item.type].basePremium;
    } else if (isComponent(item.type)) {
      const list = componentIndicesByType.get(item.type) ?? [];
      list.push(idx);
      componentIndicesByType.set(item.type, list);
    }
  });

  // For each component type, group into bundles of 3.
  for (const indices of componentIndicesByType.values()) {
    let i = 0;
    while (i + COMPONENT_BUNDLE_SIZE <= indices.length) {
      // bundle of 3: 60 G shared (20 G each)
      const perItem = COMPONENT_BUNDLE_BASE / COMPONENT_BUNDLE_SIZE;
      for (let j = 0; j < COMPONENT_BUNDLE_SIZE; j++) {
        basePerItem[indices[i + j]] = perItem;
      }
      i += COMPONENT_BUNDLE_SIZE;
    }
    // remaining components priced individually
    while (i < indices.length) {
      basePerItem[indices[i]] = COMPONENT_BASE;
      i++;
    }
  }

  // Apply per-item modifiers.
  return items.map((item, idx) => {
    let p = basePerItem[idx];
    if (item.cursed) {
      p *= 1.5;
    }
    if ((item.enchantment ?? 0) >= 5) {
      p *= 1.3;
    }
    return p;
  });
}

export interface PremiumContext {
  yearsWithMHPCO: number;
  contractIndex: number; // 0 = first contract
}

/**
 * Round in the MHPCO's favor — i.e., always round premium amounts up
 * to the next whole G so the insurer never loses fractional gold.
 */
export function roundFavor(amount: number): number {
  return Math.ceil(amount - 1e-9);
}

export function computePremium(items: Item[], ctx: PremiumContext): number {
  const perItemPremiums = computeItemPremiums(items);
  let total = perItemPremiums.reduce((s, p) => s + p, 0);

  // Loyalty discount: ≥2 years
  if (ctx.yearsWithMHPCO >= 2) {
    total *= 0.8;
  }

  // First insurance surcharge
  if (ctx.contractIndex === 0) {
    total *= 1.1;
  } else {
    // After-first discount
    total *= 0.85;
  }

  // Processing fee
  total += 5;

  return roundFavor(total);
}
