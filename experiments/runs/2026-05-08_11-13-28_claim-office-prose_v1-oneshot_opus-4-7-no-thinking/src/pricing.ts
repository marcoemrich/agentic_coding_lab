import type { Item } from './types.js';

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
const COMPONENT_BUNDLE_BASE_PREMIUM = 60;

export function isComponent(type: string): boolean {
  return COMPONENT_TYPES.has(type);
}

export function insuranceValueOf(item: Item): number {
  if (isComponent(item.type)) return COMPONENT_INSURANCE;
  const entry = MAIN_ITEM_PRICES[item.type];
  if (!entry) throw new Error(`Unknown item type: ${item.type}`);
  return entry.insuranceValue;
}

export function totalInsuranceSum(items: Item[]): number {
  return items.reduce((acc, it) => acc + insuranceValueOf(it), 0);
}

/**
 * Compute item-level premium with item-level surcharges (cursed, enchantment).
 * Returns per-item cost (still float).
 */
function itemSurchargeMultiplier(item: Item): number {
  let mult = 1;
  if (item.cursed) mult += 0.5;
  if ((item.enchantment ?? 0) >= 5) mult += 0.3;
  return mult;
}

/**
 * Compute base premium across items. Components of like type are grouped into
 * building blocks of 3 to receive the special bundle base premium.
 * Per-item surcharges (cursed, high enchantment) apply per individual item;
 * for components grouped into a bundle, surcharges apply by averaging the
 * surcharge across the 3 components composing the bundle (i.e. the bundle's
 * base premium is multiplied by each component's surcharge factor share).
 */
export function basePremiumWithItemSurcharges(items: Item[]): number {
  let total = 0;

  // Separate components from main items
  const componentsByType: Record<string, Item[]> = {};
  for (const item of items) {
    if (isComponent(item.type)) {
      (componentsByType[item.type] ??= []).push(item);
    } else {
      const entry = MAIN_ITEM_PRICES[item.type];
      if (!entry) throw new Error(`Unknown item type: ${item.type}`);
      total += entry.basePremium * itemSurchargeMultiplier(item);
    }
  }

  // Process each component type: form bundles of 3, then leftovers
  for (const list of Object.values(componentsByType)) {
    let i = 0;
    while (i + 3 <= list.length) {
      // Form a bundle of 3
      const bundle = list.slice(i, i + 3);
      // Average the surcharge multiplier across the 3 items
      const avgMult =
        bundle.reduce((a, it) => a + itemSurchargeMultiplier(it), 0) / 3;
      total += COMPONENT_BUNDLE_BASE_PREMIUM * avgMult;
      i += 3;
    }
    while (i < list.length) {
      total += COMPONENT_BASE_PREMIUM * itemSurchargeMultiplier(list[i]);
      i++;
    }
  }

  return total;
}

export interface QuoteContext {
  yearsWithMHPCO: number;
  /** Number of contracts already issued before this one (0 for the first). */
  priorContracts: number;
}

const PROCESSING_FEE = 5;

/** Round up to whole G in MHPCO's favor. */
function roundFavor(amount: number): number {
  return Math.ceil(amount - 1e-9);
}

export function computePremium(
  items: Item[],
  ctx: QuoteContext
): number {
  let premium = basePremiumWithItemSurcharges(items);

  // Loyalty discount
  if (ctx.yearsWithMHPCO >= 2) {
    premium *= 0.8;
  }

  // First insurance vs subsequent contract
  if (ctx.priorContracts === 0) {
    premium *= 1.1; // initial assessment surcharge
  } else {
    premium *= 0.85; // 15% discount on subsequent contracts
  }

  // Processing fee
  premium += PROCESSING_FEE;

  return roundFavor(premium);
}
