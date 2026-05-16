import type { Item, Customer } from "./types.js";

const MAIN_ITEMS: Record<string, { insurance: number; base: number }> = {
  sword: { insurance: 1000, base: 100 },
  amulet: { insurance: 600, base: 60 },
  staff: { insurance: 800, base: 80 },
  potion: { insurance: 400, base: 40 },
};

const COMPONENT_INSURANCE = 250;
const COMPONENT_BASE = 25;
const COMPONENT_BUNDLE_BASE = 60; // 3 alike components
const PROCESSING_FEE = 5;

export function isMainItem(type: string): boolean {
  return Object.prototype.hasOwnProperty.call(MAIN_ITEMS, type);
}

export function insuranceValue(item: Item): number {
  if (isMainItem(item.type)) {
    return MAIN_ITEMS[item.type].insurance;
  }
  return COMPONENT_INSURANCE;
}

export function totalInsuranceSum(items: Item[]): number {
  return items.reduce((acc, it) => acc + insuranceValue(it), 0);
}

/**
 * Compute the base premium for an item, including per-item risk surcharges
 * (cursed +50%, enchantment >=5 +30%). For components, base premium is
 * computed at the group level (3-alike bundle), so this function only handles
 * main items per-item.
 */
function mainItemPremium(item: Item): number {
  const base = MAIN_ITEMS[item.type].base;
  let mult = 1;
  if (item.cursed) mult += 0.5;
  if ((item.enchantment ?? 0) >= 5) mult += 0.3;
  return base * mult;
}

/**
 * Compute the base premium for a single component item including its
 * per-item surcharges. Used for leftover components after bundling.
 */
function componentItemPremium(item: Item): number {
  let mult = 1;
  if (item.cursed) mult += 0.5;
  if ((item.enchantment ?? 0) >= 5) mult += 0.3;
  return COMPONENT_BASE * mult;
}

/**
 * For a group of 3 alike components forming a bundle, the bundle base is 60.
 * Surcharges apply per-component: each component contributes its surcharge
 * fraction of its individual base (25). I.e., the bundle has a 60 G base
 * AND each component still adds its own surcharge (computed against the
 * regular 25 G base).
 * Simpler interpretation: the bundle replaces 3*25=75 with 60; surcharges
 * applied to each component still use the 25 G individual base.
 */
function componentBundlePremium(group: Item[]): number {
  let total = COMPONENT_BUNDLE_BASE;
  for (const item of group) {
    let surchargeMult = 0;
    if (item.cursed) surchargeMult += 0.5;
    if ((item.enchantment ?? 0) >= 5) surchargeMult += 0.3;
    total += COMPONENT_BASE * surchargeMult;
  }
  return total;
}

/**
 * Group components by type, then compute total component base premium
 * applying bundle pricing for each group of 3.
 */
function componentsPremium(components: Item[]): number {
  const byType = new Map<string, Item[]>();
  for (const c of components) {
    const list = byType.get(c.type) ?? [];
    list.push(c);
    byType.set(c.type, list);
  }
  let total = 0;
  for (const list of byType.values()) {
    let i = 0;
    while (i + 3 <= list.length) {
      total += componentBundlePremium(list.slice(i, i + 3));
      i += 3;
    }
    while (i < list.length) {
      total += componentItemPremium(list[i]);
      i += 1;
    }
  }
  return total;
}

export interface PremiumContext {
  customer: Customer;
  contractIndex: number; // 0 for first contract, 1 for second, ...
}

/**
 * Compute the premium for a list of items, applying all modifiers and
 * rounding up to whole G.
 */
export function computePremium(items: Item[], ctx: PremiumContext): number {
  const mainItems = items.filter((i) => isMainItem(i.type));
  const components = items.filter((i) => !isMainItem(i.type));

  let basePremium = 0;
  for (const item of mainItems) basePremium += mainItemPremium(item);
  basePremium += componentsPremium(components);

  let mult = 1;
  // Loyalty discount
  if (ctx.customer.yearsWithMHPCO >= 2) mult -= 0.2;
  // First contract surcharge / subsequent contract discount
  if (ctx.contractIndex === 0) {
    mult += 0.1;
  } else {
    mult -= 0.15;
  }

  let premium = basePremium * mult;
  premium += PROCESSING_FEE;

  // Round up in favor of MHPCO. Round to a high precision first to avoid
  // floating-point artefacts (e.g. 110.00000000000001).
  const rounded = Math.round(premium * 1e6) / 1e6;
  return Math.ceil(rounded);
}
