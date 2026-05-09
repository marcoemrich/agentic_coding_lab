import type { Item } from './types.js';

export interface ItemPrice {
  insuranceValue: number;
  basePremium: number;
}

const MAIN_ITEMS: Record<string, ItemPrice> = {
  sword: { insuranceValue: 1000, basePremium: 100 },
  amulet: { insuranceValue: 600, basePremium: 60 },
  staff: { insuranceValue: 800, basePremium: 80 },
  potion: { insuranceValue: 400, basePremium: 40 },
};

const COMPONENT_TYPES = new Set(['rune', 'moonstone']);
const COMPONENT_INSURANCE = 250;
const COMPONENT_BASE = 25;
const BUNDLE_OF_THREE_BASE = 60;

export function isComponent(item: Item): boolean {
  return COMPONENT_TYPES.has(item.type);
}

export function isMainItem(item: Item): boolean {
  return item.type in MAIN_ITEMS;
}

/**
 * Compute insurance sum for a list of items (sum of insurance values).
 */
export function computeInsuranceSum(items: Item[]): number {
  let sum = 0;
  for (const item of items) {
    if (isMainItem(item)) {
      sum += MAIN_ITEMS[item.type].insuranceValue;
    } else if (isComponent(item)) {
      sum += COMPONENT_INSURANCE;
    }
  }
  return sum;
}

/**
 * Apply per-item risk surcharges to a base premium.
 * - Cursed: +50%
 * - Enchantment >= 5: +30%
 */
function applyItemSurcharges(basePremium: number, item: Item): number {
  let p = basePremium;
  if (item.cursed) {
    p = p * 1.5;
  }
  if ((item.enchantment ?? 0) >= 5) {
    p = p * 1.3;
  }
  return p;
}

/**
 * Compute the base premium for items, accounting for the
 * "3 alike components -> 60G" bundle rule.
 *
 * Bundles only apply to components grouped by type. Each group of 3
 * alike components costs 60G; remaining components are 25G each.
 *
 * Surcharges (cursed, high enchantment) are applied per item, and
 * are applied to the per-item base premium share. For bundled
 * components the per-item share is 20G (60G/3).
 */
export function computeItemsPremium(items: Item[]): number {
  let total = 0;

  // Main items: straightforward base + surcharges
  for (const item of items) {
    if (isMainItem(item)) {
      const base = MAIN_ITEMS[item.type].basePremium;
      total += applyItemSurcharges(base, item);
    }
  }

  // Components: group by type, apply bundle rule
  const componentsByType: Record<string, Item[]> = {};
  for (const item of items) {
    if (isComponent(item)) {
      (componentsByType[item.type] ??= []).push(item);
    }
  }

  for (const group of Object.values(componentsByType)) {
    let i = 0;
    // Process bundles of 3
    while (i + 3 <= group.length) {
      const bundle = group.slice(i, i + 3);
      // The bundle base premium is 60G total; per-item share is 20G
      // so that surcharges per item still apply proportionally.
      for (const item of bundle) {
        total += applyItemSurcharges(BUNDLE_OF_THREE_BASE / 3, item);
      }
      i += 3;
    }
    // Remaining components at full 25G
    for (; i < group.length; i++) {
      total += applyItemSurcharges(COMPONENT_BASE, group[i]);
    }
  }

  return total;
}

export interface QuoteContext {
  yearsWithMHPCO: number;
  contractsAlreadyIssued: number; // number of prior quotes for this customer
}

const PROCESSING_FEE = 5;

/**
 * Round in MHPCO's favor — i.e., round UP to the next whole G.
 */
export function roundUp(x: number): number {
  // Use a small epsilon to avoid floating-point upward jitter for
  // values that are mathematically integers but stored as e.g. 99.99999999.
  const eps = 1e-9;
  const r = Math.ceil(x - eps);
  // Avoid returning -0
  return r === 0 ? 0 : r;
}

/**
 * Compute the final premium given items and customer context.
 */
export function computePremium(items: Item[], ctx: QuoteContext): number {
  let premium = computeItemsPremium(items);

  // Customer-level modifiers
  if (ctx.yearsWithMHPCO >= 2) {
    premium *= 0.8; // 20% loyalty discount
  }

  if (ctx.contractsAlreadyIssued === 0) {
    // First insurance: +10% initial assessment surcharge
    premium *= 1.1;
  } else {
    // Each contract after the first: -15% discount
    premium *= 0.85;
  }

  premium += PROCESSING_FEE;

  return roundUp(premium);
}
