import { Item } from './types.js';

interface PriceEntry {
  insuranceValue: number;
  basePremium: number;
}

const MAIN_ITEM_PRICES: Record<string, PriceEntry> = {
  sword: { insuranceValue: 1000, basePremium: 100 },
  amulet: { insuranceValue: 600, basePremium: 60 },
  staff: { insuranceValue: 800, basePremium: 80 },
  potion: { insuranceValue: 400, basePremium: 40 },
};

const COMPONENT_TYPES = new Set(['rune', 'moonstone']);
const COMPONENT_INSURANCE = 250;
const COMPONENT_BASE_PREMIUM = 25;
const COMPONENT_BUNDLE_SIZE = 3;
const COMPONENT_BUNDLE_PREMIUM = 60;

export function isComponent(item: Item): boolean {
  return COMPONENT_TYPES.has(item.type);
}

export function insuranceValueOf(item: Item): number {
  if (isComponent(item)) return COMPONENT_INSURANCE;
  const entry = MAIN_ITEM_PRICES[item.type];
  if (!entry) throw new Error(`Unknown item type: ${item.type}`);
  return entry.insuranceValue;
}

/**
 * Compute the total insurance sum (sum of insurance values for all items).
 */
export function totalInsuranceSum(items: Item[]): number {
  return items.reduce((acc, item) => acc + insuranceValueOf(item), 0);
}

/**
 * Compute the base premium for the list of items.
 * Main items use their flat base premium.
 * Components are 25 G each, but every group of 3 alike components
 * gets the bundle discount of 60 G (instead of 75 G).
 */
export function basePremiumOf(items: Item[]): number {
  let total = 0;
  // Group components by type for bundle pricing.
  const componentCounts: Record<string, Item[]> = {};

  for (const item of items) {
    if (isComponent(item)) {
      if (!componentCounts[item.type]) componentCounts[item.type] = [];
      componentCounts[item.type].push(item);
    } else {
      const entry = MAIN_ITEM_PRICES[item.type];
      if (!entry) throw new Error(`Unknown item type: ${item.type}`);
      total += itemPremiumWithModifiers(item, entry.basePremium);
    }
  }

  // For each component type, apply bundle pricing.
  for (const type of Object.keys(componentCounts)) {
    const group = componentCounts[type];
    // Bundles: for each set of 3 alike components, pay 60 G total bundle base
    // and apply per-item modifiers proportionally to the bundle.
    // Strategy: split into bundles of size 3 then leftover singles.
    let i = 0;
    while (i + COMPONENT_BUNDLE_SIZE <= group.length) {
      const bundle = group.slice(i, i + COMPONENT_BUNDLE_SIZE);
      // The bundle's base is 60 G total. Apply modifiers per-item by
      // distributing the bundle base equally and then applying surcharges
      // per item, summing the resulting per-item premiums.
      const perItemBase = COMPONENT_BUNDLE_PREMIUM / COMPONENT_BUNDLE_SIZE;
      for (const c of bundle) {
        total += itemPremiumWithModifiers(c, perItemBase);
      }
      i += COMPONENT_BUNDLE_SIZE;
    }
    // Leftover singles.
    for (; i < group.length; i++) {
      total += itemPremiumWithModifiers(group[i], COMPONENT_BASE_PREMIUM);
    }
  }

  return total;
}

/**
 * Apply per-item risk surcharges (cursed, high enchantment).
 */
function itemPremiumWithModifiers(item: Item, base: number): number {
  let p = base;
  if (item.cursed) p *= 1.5;
  if ((item.enchantment ?? 0) >= 5) p *= 1.3;
  return p;
}

/**
 * Round up (in MHPCO's favor) to whole G.
 */
function roundUp(x: number): number {
  // Avoid floating-point pitfalls by adding a tiny epsilon downward only at
  // exact integers. Math.ceil handles general case.
  // Use a small epsilon to avoid rounding 100.0000000001 up to 101.
  const eps = 1e-9;
  return Math.ceil(x - eps);
}

export interface QuoteContext {
  yearsWithMHPCO: number;
  contractIndex: number; // 0 = first contract, 1 = second, ...
}

export function computePremium(items: Item[], ctx: QuoteContext): number {
  let premium = basePremiumOf(items);

  // Customer-level modifiers (multiplicative).
  if (ctx.yearsWithMHPCO >= 2) {
    premium *= 0.8; // 20% loyalty discount
  }
  if (ctx.contractIndex === 0) {
    premium *= 1.1; // 10% first-insurance surcharge
  } else {
    premium *= 0.85; // 15% discount on each subsequent contract
  }

  // 5 G processing fee
  premium += 5;

  return roundUp(premium);
}
