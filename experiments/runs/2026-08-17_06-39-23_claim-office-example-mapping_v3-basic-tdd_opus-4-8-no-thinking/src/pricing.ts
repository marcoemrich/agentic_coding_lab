import type { ItemType } from './types.js';

export interface ItemPricing {
  insuranceValue: number;
  basePremium: number;
}

export const MAIN_ITEM_PRICING: Record<string, ItemPricing> = {
  sword: { insuranceValue: 1000, basePremium: 100 },
  amulet: { insuranceValue: 600, basePremium: 60 },
  staff: { insuranceValue: 800, basePremium: 80 },
  potion: { insuranceValue: 400, basePremium: 40 },
};

export const COMPONENT_TYPES: ReadonlySet<string> = new Set(['rune', 'moonstone']);

export const COMPONENT_INSURANCE_VALUE = 250;
export const COMPONENT_BASE_PREMIUM = 25;
export const BLOCK_SIZE = 3;
export const BLOCK_BASE_PREMIUM = 60;

export const PROCESSING_FEE = 5;
export const DEDUCTIBLE = 100;
export const CAP_MULTIPLIER = 2;

export const CURSE_SURCHARGE = 0.5;
export const HIGH_ENCHANTMENT_SURCHARGE = 0.3;
export const HIGH_ENCHANTMENT_THRESHOLD = 5;
export const LOYALTY_DISCOUNT = 0.2;
export const LOYALTY_YEARS_THRESHOLD = 2;
export const FIRST_INSURANCE_SURCHARGE = 0.1;
export const FOLLOWUP_DISCOUNT = 0.15;

export function isKnownItemType(type: string): boolean {
  return type in MAIN_ITEM_PRICING || COMPONENT_TYPES.has(type);
}

export function isComponent(type: string): boolean {
  return COMPONENT_TYPES.has(type);
}

export function isMainItem(type: string): boolean {
  return type in MAIN_ITEM_PRICING;
}

export function insuranceValueOf(type: string): number {
  if (isComponent(type)) return COMPONENT_INSURANCE_VALUE;
  return MAIN_ITEM_PRICING[type].insuranceValue;
}
