import { Item, MainItemType } from './types.js';

// MHPCO price list: insurance value + base premium per main item type.
const MAIN_ITEM_PRICES: Record<MainItemType, { insurance: number; base: number }> = {
  sword: { insurance: 1000, base: 100 },
  amulet: { insurance: 600, base: 60 },
  staff: { insurance: 800, base: 80 },
  potion: { insurance: 400, base: 40 },
};

const COMPONENT_INSURANCE = 250;
const COMPONENT_BASE = 25;
const COMPONENT_BUNDLE_SIZE = 3;
const COMPONENT_BUNDLE_BASE = 60;

export function isMainItem(type: string): type is MainItemType {
  return type in MAIN_ITEM_PRICES;
}

export function isComponent(item: Item): boolean {
  return !isMainItem(item.type);
}

export function insuranceValue(item: Item): number {
  if (isMainItem(item.type)) {
    return MAIN_ITEM_PRICES[item.type].insurance;
  }
  return COMPONENT_INSURANCE;
}

export function totalInsuranceSum(items: Item[]): number {
  return items.reduce((acc, it) => acc + insuranceValue(it), 0);
}

/**
 * Compute the base premium contribution of a single main item before per-item modifiers.
 */
function mainItemBase(type: MainItemType): number {
  return MAIN_ITEM_PRICES[type].base;
}

/**
 * Per-item risk surcharge multiplier.
 *  - cursed: +50%
 *  - enchantment >= 5: +30%
 * Both surcharges stack additively on top of the base (e.g. 1 + 0.5 + 0.3 = 1.8).
 */
function perItemMultiplier(item: Item): number {
  let multiplier = 1;
  if (item.cursed) multiplier += 0.5;
  if ((item.enchantment ?? 0) >= 5) multiplier += 0.3;
  return multiplier;
}

/**
 * Compute the surcharged base premium for the main items in the input,
 * applying per-item cursed/enchantment risk surcharges.
 */
function mainItemsPremium(items: Item[]): number {
  let total = 0;
  for (const it of items) {
    if (!isMainItem(it.type)) continue;
    const base = mainItemBase(it.type);
    total += base * perItemMultiplier(it);
  }
  return total;
}

/**
 * Compute the surcharged base premium for components, applying the
 * "bundle of 3 alike" discount where 3 components of the same type
 * are priced at 60 G total instead of 3 * 25 = 75 G.
 *
 * Per-item cursed/enchantment surcharges are applied proportionally
 * to each component's share of the bundle base.
 */
function componentsPremium(items: Item[]): number {
  // Group components by type so we can apply bundling per type.
  const groups: Record<string, Item[]> = {};
  for (const it of items) {
    if (isMainItem(it.type)) continue;
    (groups[it.type] ??= []).push(it);
  }

  let total = 0;
  for (const group of Object.values(groups)) {
    // Apply bundles of 3 first, then singletons for the remainder.
    const fullBundles = Math.floor(group.length / COMPONENT_BUNDLE_SIZE);
    const remainder = group.length % COMPONENT_BUNDLE_SIZE;

    // Walk the group in order. Each bundle of 3 uses the bundle base,
    // split equally across the items so their individual surcharges apply.
    let i = 0;
    for (let b = 0; b < fullBundles; b++) {
      const bundle = group.slice(i, i + COMPONENT_BUNDLE_SIZE);
      const perShare = COMPONENT_BUNDLE_BASE / COMPONENT_BUNDLE_SIZE;
      for (const it of bundle) {
        total += perShare * perItemMultiplier(it);
      }
      i += COMPONENT_BUNDLE_SIZE;
    }
    for (let r = 0; r < remainder; r++) {
      const it = group[i + r];
      total += COMPONENT_BASE * perItemMultiplier(it);
    }
  }
  return total;
}

export interface PremiumContext {
  yearsWithMHPCO: number;
  // Zero-based index of this quote among the customer's quotes in this scenario.
  // 0 = first contract.
  contractIndex: number;
}

const PROCESSING_FEE = 5;

/**
 * Compute the final premium for a list of items, in whole G, rounded up
 * (in the MHPCO's favor).
 */
export function computePremium(items: Item[], ctx: PremiumContext): number {
  const itemsPremium = mainItemsPremium(items) + componentsPremium(items);

  // Contract-level multipliers stack additively on top of the items premium.
  let multiplier = 1;
  if (ctx.yearsWithMHPCO >= 2) multiplier -= 0.2;        // loyalty discount
  if (ctx.contractIndex === 0) multiplier += 0.1;        // first insurance surcharge
  if (ctx.contractIndex > 0) multiplier -= 0.15;         // discount on subsequent contracts

  const withModifiers = itemsPremium * multiplier;
  const withFee = withModifiers + PROCESSING_FEE;

  // Round in MHPCO's favor: ceil to whole G. Snap away floating-point noise
  // (e.g. 110.00000000000001) before ceiling so that exact values aren't
  // pushed up by a phantom fraction.
  const cleaned = Math.round(withFee * 1e8) / 1e8;
  return Math.ceil(cleaned);
}
