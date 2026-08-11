import { ClaimOfficeError } from './types.js';

export interface PriceListEntry {
  insuranceValue: number;
  basePremium: number;
  /** Components are priced in blocks of 3; main items are not. */
  isComponent: boolean;
}

/** The MHPCO price list: insurance value and base premium per main item. */
const MAIN_ITEMS: Record<string, { insuranceValue: number; basePremium: number }> = {
  sword: { insuranceValue: 1000, basePremium: 100 },
  amulet: { insuranceValue: 600, basePremium: 60 },
  staff: { insuranceValue: 800, basePremium: 80 },
  potion: { insuranceValue: 400, basePremium: 40 },
};

const COMPONENTS = ['rune', 'moonstone'];

export const COMPONENT_INSURANCE_VALUE = 250;
export const COMPONENT_BASE_PREMIUM = 25;
/** A block of exactly 3 alike components is offered at a special rate. */
export const BLOCK_SIZE = 3;
export const BLOCK_BASE_PREMIUM = 60;

export function lookUp(type: string): PriceListEntry {
  const mainItem = MAIN_ITEMS[type];
  if (mainItem) {
    return { ...mainItem, isComponent: false };
  }
  if (COMPONENTS.includes(type)) {
    return {
      insuranceValue: COMPONENT_INSURANCE_VALUE,
      basePremium: COMPONENT_BASE_PREMIUM,
      isComponent: true,
    };
  }
  throw new ClaimOfficeError(`unknown item type: ${type}`);
}
