import type { Item } from "./types.js";

export interface ItemPriceInfo {
  insuranceValue: number;
  basePremium: number;
  isComponent: boolean;
}

const MAIN_ITEMS: Record<string, { insuranceValue: number; basePremium: number }> = {
  sword: { insuranceValue: 1000, basePremium: 100 },
  amulet: { insuranceValue: 600, basePremium: 60 },
  staff: { insuranceValue: 800, basePremium: 80 },
  potion: { insuranceValue: 400, basePremium: 40 },
};

export function isMainItem(type: string): boolean {
  return type in MAIN_ITEMS;
}

export function getMainItemInfo(type: string): { insuranceValue: number; basePremium: number } | undefined {
  return MAIN_ITEMS[type];
}

export const COMPONENT_INSURANCE_VALUE = 250;
export const COMPONENT_SINGLE_BASE_PREMIUM = 25;
export const COMPONENT_BUNDLE_BASE_PREMIUM = 60;
export const PROCESSING_FEE = 5;
export const DEDUCTIBLE = 100;

/**
 * Apply per-item modifiers (cursed, high enchantment) to a base premium.
 */
export function applyItemModifiers(basePremium: number, item: Item): number {
  let premium = basePremium;
  if (item.cursed) {
    premium *= 1.5;
  }
  if ((item.enchantment ?? 0) >= 5) {
    premium *= 1.3;
  }
  return premium;
}
