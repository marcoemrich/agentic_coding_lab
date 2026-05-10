export type MainItemType = 'sword' | 'amulet' | 'staff' | 'potion';
export type ComponentItemType = 'rune' | 'moonstone';
export type ItemType = MainItemType | ComponentItemType;

export const MAIN_ITEM_TYPES = new Set<string>(['sword', 'amulet', 'staff', 'potion']);
export const COMPONENT_ITEM_TYPES = new Set<string>(['rune', 'moonstone']);
export const ALL_ITEM_TYPES = new Set<string>([...MAIN_ITEM_TYPES, ...COMPONENT_ITEM_TYPES]);

export interface MainItemPricing {
  insuranceValue: number;
  basePremium: number;
}

const MAIN_ITEM_PRICING: Record<MainItemType, MainItemPricing> = {
  sword: { insuranceValue: 1000, basePremium: 100 },
  amulet: { insuranceValue: 600, basePremium: 60 },
  staff: { insuranceValue: 800, basePremium: 80 },
  potion: { insuranceValue: 400, basePremium: 40 },
};

export const COMPONENT_INSURANCE_VALUE = 250;
export const COMPONENT_BASE_PREMIUM = 25;
export const COMPONENT_BLOCK_PREMIUM = 60; // for exactly 3 alike components

export function getMainItemPricing(type: string): MainItemPricing {
  if (!MAIN_ITEM_TYPES.has(type)) {
    throw new Error(`Unknown main item type: ${type}`);
  }
  return MAIN_ITEM_PRICING[type as MainItemType];
}

export function getInsuranceValue(type: string): number {
  if (MAIN_ITEM_TYPES.has(type)) {
    return getMainItemPricing(type).insuranceValue;
  }
  if (COMPONENT_ITEM_TYPES.has(type)) {
    return COMPONENT_INSURANCE_VALUE;
  }
  throw new Error(`Unknown item type: ${type}`);
}

export function validateItemType(type: string): void {
  if (!ALL_ITEM_TYPES.has(type)) {
    throw new Error(`Unknown item type: ${type}`);
  }
}
