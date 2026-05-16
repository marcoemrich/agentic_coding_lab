import type { Item } from "./types.js";

export interface PriceEntry {
  insuranceValue: number;
  basePremium: number;
}

export const MAIN_ITEM_PRICES: Record<string, PriceEntry> = {
  sword: { insuranceValue: 1000, basePremium: 100 },
  amulet: { insuranceValue: 600, basePremium: 60 },
  staff: { insuranceValue: 800, basePremium: 80 },
  potion: { insuranceValue: 400, basePremium: 40 },
};

export const COMPONENT_INSURANCE_VALUE = 250;
export const COMPONENT_BASE_PREMIUM = 25;
export const COMPONENT_BLOCK_BASE_PREMIUM = 60; // for a block of 3 alike components

export const PROCESSING_FEE = 5;

export function isMainItem(type: string): boolean {
  return type in MAIN_ITEM_PRICES;
}

export function isComponent(type: string): boolean {
  return !isMainItem(type);
}

/**
 * Computes insurance value of a single item (for sum insured).
 */
export function itemInsuranceValue(item: Item): number {
  if (isMainItem(item.type)) {
    return MAIN_ITEM_PRICES[item.type].insuranceValue;
  }
  return COMPONENT_INSURANCE_VALUE;
}

/**
 * Total insurance sum for a list of items.
 */
export function totalInsuranceSum(items: Item[]): number {
  return items.reduce((sum, item) => sum + itemInsuranceValue(item), 0);
}
