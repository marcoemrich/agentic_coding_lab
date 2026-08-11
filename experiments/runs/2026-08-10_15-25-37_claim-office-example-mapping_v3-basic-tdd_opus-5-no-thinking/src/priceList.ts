import { ClaimOfficeError } from './types.js';

export interface PriceListEntry {
  insuranceValue: number;
  basePremium: number;
  /** Components can be combined into building blocks; main items cannot. */
  isComponent: boolean;
}

const PRICE_LIST: Record<string, PriceListEntry> = {
  sword: { insuranceValue: 1000, basePremium: 100, isComponent: false },
  amulet: { insuranceValue: 600, basePremium: 60, isComponent: false },
  staff: { insuranceValue: 800, basePremium: 80, isComponent: false },
  potion: { insuranceValue: 400, basePremium: 40, isComponent: false },
  rune: { insuranceValue: 250, basePremium: 25, isComponent: true },
  moonstone: { insuranceValue: 250, basePremium: 25, isComponent: true },
};

/** Base premium for a building block of exactly 3 alike components. */
export const BLOCK_SIZE = 3;
export const BLOCK_PREMIUM = 60;

export function lookUp(type: string): PriceListEntry {
  const entry = PRICE_LIST[type];
  if (!entry) {
    throw new ClaimOfficeError(`unknown item type: ${type}`);
  }
  return entry;
}
