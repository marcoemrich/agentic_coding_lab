import type { Item } from "./types.js";

export const MAIN_ITEM_TYPES = ["sword", "amulet", "staff", "potion"] as const;

export interface PriceInfo {
  insuranceValue: number;
  basePremium: number;
}

const MAIN_PRICES: Record<string, PriceInfo> = {
  sword: { insuranceValue: 1000, basePremium: 100 },
  amulet: { insuranceValue: 600, basePremium: 60 },
  staff: { insuranceValue: 800, basePremium: 80 },
  potion: { insuranceValue: 400, basePremium: 40 },
};

const COMPONENT_INSURANCE = 250;
const COMPONENT_BASE = 25;
const COMPONENT_BUNDLE_BASE = 60;
const COMPONENT_BUNDLE_SIZE = 3;

export function isMainItem(item: Item): boolean {
  return item.type in MAIN_PRICES;
}

export function getMainPrice(type: string): PriceInfo | undefined {
  return MAIN_PRICES[type];
}

export function insuranceValueFor(item: Item): number {
  if (isMainItem(item)) return MAIN_PRICES[item.type].insuranceValue;
  return COMPONENT_INSURANCE;
}

/**
 * Apply per-item risk surcharges (cursed +50%, enchantment ≥ 5 +30%) to a base
 * amount, returning the surcharged amount (still a non-integer float).
 */
export function applyItemRiskSurcharges(base: number, item: Item): number {
  let amount = base;
  if (item.cursed) amount *= 1.5;
  if ((item.enchantment ?? 0) >= 5) amount *= 1.3;
  return amount;
}

/**
 * Compute the per-item base premium contribution to the policy, applying
 * component bundling (3 alike components → 60 G base) and the per-item risk
 * surcharges. Returns the surcharged premium contribution per individual item
 * occurrence (so the caller can sum them).
 */
export function itemPremiumContributions(items: Item[]): number {
  // Group components by type for bundling.
  const components: Item[] = [];
  const mains: Item[] = [];
  for (const it of items) {
    if (isMainItem(it)) mains.push(it);
    else components.push(it);
  }

  let total = 0;

  for (const it of mains) {
    const base = MAIN_PRICES[it.type].basePremium;
    total += applyItemRiskSurcharges(base, it);
  }

  // Group components by type
  const byType = new Map<string, Item[]>();
  for (const c of components) {
    const arr = byType.get(c.type) ?? [];
    arr.push(c);
    byType.set(c.type, arr);
  }

  for (const [, arr] of byType) {
    // Form as many bundles of 3 as possible.
    let i = 0;
    while (i + COMPONENT_BUNDLE_SIZE <= arr.length) {
      const bundle = arr.slice(i, i + COMPONENT_BUNDLE_SIZE);
      // For a bundle, we have a single base premium of 60 G that covers the 3
      // components. Risk surcharges should still apply per item. We split the
      // bundle base evenly across its 3 items so per-item surcharges can be
      // applied individually.
      const perItemBase = COMPONENT_BUNDLE_BASE / COMPONENT_BUNDLE_SIZE;
      for (const it of bundle) {
        total += applyItemRiskSurcharges(perItemBase, it);
      }
      i += COMPONENT_BUNDLE_SIZE;
    }
    // Remaining components priced individually at 25 G.
    for (; i < arr.length; i++) {
      total += applyItemRiskSurcharges(COMPONENT_BASE, arr[i]);
    }
  }

  return total;
}

export function totalInsuranceSum(items: Item[]): number {
  let sum = 0;
  for (const it of items) sum += insuranceValueFor(it);
  return sum;
}
