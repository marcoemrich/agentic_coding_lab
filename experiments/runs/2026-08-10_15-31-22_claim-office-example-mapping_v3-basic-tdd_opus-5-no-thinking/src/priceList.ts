import { ClaimOfficeError } from './types.js';

interface Price {
  insuranceValue: number;
  basePremium: number;
}

const MAIN_ITEMS: Record<string, Price> = {
  sword: { insuranceValue: 1000, basePremium: 100 },
  amulet: { insuranceValue: 600, basePremium: 60 },
  staff: { insuranceValue: 800, basePremium: 80 },
  potion: { insuranceValue: 400, basePremium: 40 },
};

const COMPONENTS = ['rune', 'moonstone'];

export const COMPONENT_PRICE: Price = { insuranceValue: 250, basePremium: 25 };

/** Special base premium for a building block of exactly 3 alike components. */
export const COMPONENT_BLOCK_PREMIUM = 60;
export const COMPONENT_BLOCK_SIZE = 3;

export const isComponent = (type: string): boolean => COMPONENTS.includes(type);

export function priceOf(type: string): Price {
  if (isComponent(type)) return COMPONENT_PRICE;

  const price = MAIN_ITEMS[type];
  if (!price) throw new ClaimOfficeError(`unknown item type: ${type}`);
  return price;
}
