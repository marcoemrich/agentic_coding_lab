export interface MainItemPrice {
  insuranceValue: number;
  basePremium: number;
}

export const MAIN_ITEM_PRICES: Record<string, MainItemPrice> = {
  sword: { insuranceValue: 1000, basePremium: 100 },
  amulet: { insuranceValue: 600, basePremium: 60 },
  staff: { insuranceValue: 800, basePremium: 80 },
  potion: { insuranceValue: 400, basePremium: 40 },
};

export const COMPONENT_TYPES = ["rune", "moonstone"];
export const COMPONENT_INSURANCE_VALUE = 250;
export const COMPONENT_BASE_PREMIUM = 25;
export const COMPONENT_BLOCK_SIZE = 3;
export const COMPONENT_BLOCK_BASE_PREMIUM = 60;

export function isMainItemType(type: string): boolean {
  return Object.hasOwn(MAIN_ITEM_PRICES, type);
}

export function isKnownItemType(type: string): boolean {
  return isMainItemType(type) || COMPONENT_TYPES.includes(type);
}
