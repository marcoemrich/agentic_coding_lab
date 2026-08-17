// MHPCO price list and item classification.

export type MainItemType = 'sword' | 'amulet' | 'staff' | 'potion';
export type ComponentType = 'rune' | 'moonstone';
export type KnownItemType = MainItemType | ComponentType;

export interface CatalogEntry {
  insuranceValue: number;
  basePremium: number;
}

// Main items with their fixed insurance value and base premium.
const MAIN_ITEMS: Record<MainItemType, CatalogEntry> = {
  sword: { insuranceValue: 1000, basePremium: 100 },
  amulet: { insuranceValue: 600, basePremium: 60 },
  staff: { insuranceValue: 800, basePremium: 80 },
  potion: { insuranceValue: 400, basePremium: 40 },
};

const COMPONENT_TYPES: ComponentType[] = ['rune', 'moonstone'];

// Component pricing.
export const COMPONENT_INSURANCE_VALUE = 250;
export const COMPONENT_BASE_PREMIUM = 25;
export const COMPONENT_BLOCK_SIZE = 3;
export const COMPONENT_BLOCK_PREMIUM = 60;

export function isMainItem(type: string): type is MainItemType {
  return Object.prototype.hasOwnProperty.call(MAIN_ITEMS, type);
}

export function isComponent(type: string): type is ComponentType {
  return (COMPONENT_TYPES as string[]).includes(type);
}

export function isKnownItemType(type: string): type is KnownItemType {
  return isMainItem(type) || isComponent(type);
}

export function mainItemEntry(type: MainItemType): CatalogEntry {
  return MAIN_ITEMS[type];
}
