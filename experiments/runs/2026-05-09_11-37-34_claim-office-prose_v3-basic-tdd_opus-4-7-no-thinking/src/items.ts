import type { Item } from './types.js';

export interface ItemPricing {
  insuranceValue: number;
  basePremium: number;
}

const MAIN_ITEMS: Record<string, ItemPricing> = {
  sword: { insuranceValue: 1000, basePremium: 100 },
  amulet: { insuranceValue: 600, basePremium: 60 },
  staff: { insuranceValue: 800, basePremium: 80 },
  potion: { insuranceValue: 400, basePremium: 40 },
};

const COMPONENT_TYPES = new Set(['rune', 'moonstone']);
const COMPONENT_INSURANCE_VALUE = 250;
const COMPONENT_BASE_PREMIUM = 25;
const COMPONENT_BUNDLE_BASE_PREMIUM = 60;
const COMPONENT_BUNDLE_SIZE = 3;

export function isComponent(item: Item): boolean {
  return COMPONENT_TYPES.has(item.type);
}

export function getMainItemPricing(type: string): ItemPricing | undefined {
  return MAIN_ITEMS[type];
}

export function getComponentInsuranceValue(): number {
  return COMPONENT_INSURANCE_VALUE;
}

export function getComponentBasePremium(): number {
  return COMPONENT_BASE_PREMIUM;
}

export function getComponentBundleBasePremium(): number {
  return COMPONENT_BUNDLE_BASE_PREMIUM;
}

export function getComponentBundleSize(): number {
  return COMPONENT_BUNDLE_SIZE;
}

/**
 * Compute total insurance sum for a list of items.
 * Components are valued individually at COMPONENT_INSURANCE_VALUE.
 */
export function computeInsuranceSum(items: Item[]): number {
  let sum = 0;
  for (const item of items) {
    if (isComponent(item)) {
      sum += COMPONENT_INSURANCE_VALUE;
    } else {
      const pricing = getMainItemPricing(item.type);
      if (pricing) sum += pricing.insuranceValue;
    }
  }
  return sum;
}
