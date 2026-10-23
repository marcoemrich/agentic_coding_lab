/** MHPCO item catalog: insurance values and base premiums per type. */

/** Components are insured per piece at 250 G / 25 G base premium. */
const COMPONENT_TYPES = new Set(["rune", "moonstone"]);
const COMPONENT_INSURANCE_VALUE_G = 250;
const COMPONENT_BASE_PREMIUM_G = 25;

/** A building block of exactly 3 alike components costs 60 G base. */
const BLOCK_SIZE = 3;
const BLOCK_BASE_PREMIUM_G = 60;

interface CatalogEntry {
  insuranceValueG: number;
  basePremiumG: number;
}

/** MHPCO price list for main items. */
const MAIN_ITEMS: Record<string, CatalogEntry> = {
  sword: { insuranceValueG: 1000, basePremiumG: 100 },
  amulet: { insuranceValueG: 600, basePremiumG: 60 },
  staff: { insuranceValueG: 800, basePremiumG: 80 },
  potion: { insuranceValueG: 400, basePremiumG: 40 },
};

/** Components (rune, moonstone) share one catalog entry. */
const COMPONENT_ENTRY: CatalogEntry = {
  insuranceValueG: COMPONENT_INSURANCE_VALUE_G,
  basePremiumG: COMPONENT_BASE_PREMIUM_G,
};

function catalogEntry(type: string): CatalogEntry {
  if (COMPONENT_TYPES.has(type)) {
    return COMPONENT_ENTRY;
  }
  return MAIN_ITEMS[type];
}

/** True if the type appears in the MHPCO catalog. */
export function isKnownType(type: string): boolean {
  return COMPONENT_TYPES.has(type) || type in MAIN_ITEMS;
}

/** True for components such as runes and moonstones. */
export function isComponent(type: string): boolean {
  return COMPONENT_TYPES.has(type);
}

/** Insurance value of one item, in G. */
export function insuranceValueG(type: string): number {
  return catalogEntry(type).insuranceValueG;
}

/** Base premium of one item, in G. */
export function basePremiumG(type: string): number {
  return catalogEntry(type).basePremiumG;
}

/** Base premium of `count` alike components, honoring the block offer. */
export function componentBlockPremiumG(count: number): number {
  if (count === BLOCK_SIZE) {
    return BLOCK_BASE_PREMIUM_G;
  }
  return count * COMPONENT_BASE_PREMIUM_G;
}
