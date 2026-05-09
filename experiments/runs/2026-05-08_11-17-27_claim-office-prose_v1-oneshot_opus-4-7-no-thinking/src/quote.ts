import type { Customer, Item, Policy } from "./types.js";
import {
  COMPONENT_BASE,
  COMPONENT_BUNDLE_BASE,
  COMPONENT_BUNDLE_SIZE,
  COMPONENT_INSURED,
  PROCESSING_FEE,
  applyItemModifiers,
  isMainItem,
  itemBasePremium,
  itemInsuredValue,
} from "./pricing.js";

export interface QuoteContext {
  customer: Customer;
  /** Number of contracts the customer already has (before this one). */
  priorContracts: number;
}

/** Compute the unrounded base premium contribution (with item-level modifiers) of a list of items. */
export function itemsBasePremium(items: Item[]): number {
  let total = 0;

  // Main items: each contributes (base × itemModifiers).
  for (const item of items) {
    if (isMainItem(item)) {
      total += applyItemModifiers(item, itemBasePremium(item));
    }
  }

  // Components: group by type; form bundles of 3 alike where possible.
  const components = items.filter((i) => !isMainItem(i));
  const byType = new Map<string, Item[]>();
  for (const c of components) {
    const arr = byType.get(c.type) ?? [];
    arr.push(c);
    byType.set(c.type, arr);
  }

  for (const arr of byType.values()) {
    const fullBundles = Math.floor(arr.length / COMPONENT_BUNDLE_SIZE);
    const leftover = arr.length % COMPONENT_BUNDLE_SIZE;

    // For bundles, base premium per item = 60/3 = 20; per-item modifier still applies.
    const perItemBundleBase = COMPONENT_BUNDLE_BASE / COMPONENT_BUNDLE_SIZE;
    const bundledItems = arr.slice(0, fullBundles * COMPONENT_BUNDLE_SIZE);
    for (const item of bundledItems) {
      total += applyItemModifiers(item, perItemBundleBase);
    }

    const leftoverItems = arr.slice(fullBundles * COMPONENT_BUNDLE_SIZE);
    for (const item of leftoverItems) {
      total += applyItemModifiers(item, COMPONENT_BASE);
    }
    void leftover;
  }

  return total;
}

export function totalInsuredValue(items: Item[]): number {
  // Components bundle insurance value: a bundle of 3 alike components is still
  // 3 components — the bundle special applies only to base premium.
  let sum = 0;
  for (const item of items) {
    sum += itemInsuredValue(item);
  }
  return sum;
}

/** Round in MHPCO's favor: ceiling. */
export function roundFavor(amount: number): number {
  // Avoid floating-point fuzz: tiny epsilon below an integer should round to that integer.
  const rounded = Math.round(amount * 1e8) / 1e8;
  return Math.ceil(rounded);
}

export function computePremium(items: Item[], ctx: QuoteContext): number {
  const itemsBase = itemsBasePremium(items);

  let premium = itemsBase;

  // Loyalty discount: ≥2 years
  if (ctx.customer.yearsWithMHPCO >= 2) {
    premium *= 0.8;
  }

  // First insurance assessment surcharge OR repeat-contract discount
  if (ctx.priorContracts === 0) {
    premium *= 1.1;
  } else {
    premium *= 0.85;
  }

  premium += PROCESSING_FEE;

  return roundFavor(premium);
}

export function buildPolicy(items: Item[]): Policy {
  const insuranceSum = totalInsuredValue(items);
  return {
    items,
    insuranceSum,
    remainingCap: 2 * insuranceSum,
  };
}
