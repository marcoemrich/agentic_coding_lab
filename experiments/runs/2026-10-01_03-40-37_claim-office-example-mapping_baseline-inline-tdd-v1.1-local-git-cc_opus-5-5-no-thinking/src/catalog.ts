export interface Item {
  type: string;
  material?: string;
  enchantment?: number;
  cursed?: boolean;
}

export interface Customer {
  yearsWithMHPCO: number;
}

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

export const COMPONENT_BLOCK_SIZE = 3;
export const COMPONENT_BLOCK_PREMIUM = 60;

export class ValidationError extends Error {}

export function priceOf(type: string): PriceEntry {
  if (!Object.hasOwn(PRICE_LIST, type)) {
    throw new ValidationError(`Unknown item type: ${type}`);
  }
  return PRICE_LIST[type];
}
