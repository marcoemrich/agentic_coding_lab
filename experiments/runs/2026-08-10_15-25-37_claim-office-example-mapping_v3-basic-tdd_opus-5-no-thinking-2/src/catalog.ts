import { ClaimOfficeError, type Item } from './types.js';

interface PriceEntry {
  insuranceValue: number;
  basePremium: number;
  component: boolean;
}

const PRICE_LIST: Record<string, PriceEntry> = {
  sword: { insuranceValue: 1000, basePremium: 100, component: false },
  amulet: { insuranceValue: 600, basePremium: 60, component: false },
  staff: { insuranceValue: 800, basePremium: 80, component: false },
  potion: { insuranceValue: 400, basePremium: 40, component: false },
  rune: { insuranceValue: 250, basePremium: 25, component: true },
  moonstone: { insuranceValue: 250, basePremium: 25, component: true },
};

/** Base premium charged for a building block of exactly 3 alike components. */
export const BLOCK_PREMIUM = 60;
export const BLOCK_SIZE = 3;

export function priceOf(type: string): PriceEntry {
  const entry = PRICE_LIST[type];
  if (!entry) {
    throw new ClaimOfficeError(`unknown item type: ${type}`);
  }
  return entry;
}

export function isComponent(type: string): boolean {
  return priceOf(type).component;
}

export function insuranceValueOf(item: Item): number {
  return priceOf(item.type).insuranceValue;
}

export function basePremiumOf(item: Item): number {
  return priceOf(item.type).basePremium;
}
