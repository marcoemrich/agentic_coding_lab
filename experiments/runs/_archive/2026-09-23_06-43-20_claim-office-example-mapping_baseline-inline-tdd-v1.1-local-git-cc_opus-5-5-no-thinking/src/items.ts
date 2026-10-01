export interface Item {
  type: string;
  material?: string;
  enchantment?: number;
  cursed?: boolean;
}

interface PriceEntry {
  insuranceValue: number;
  basePremium: number;
  component: boolean;
}

const COMPONENT: PriceEntry = { insuranceValue: 250, basePremium: 25, component: true };

const PRICE_LIST: Record<string, PriceEntry> = {
  sword: { insuranceValue: 1000, basePremium: 100, component: false },
  amulet: { insuranceValue: 600, basePremium: 60, component: false },
  staff: { insuranceValue: 800, basePremium: 80, component: false },
  potion: { insuranceValue: 400, basePremium: 40, component: false },
  rune: COMPONENT,
  moonstone: COMPONENT,
};

export const COMPONENT_BLOCK_SIZE = 3;
export const COMPONENT_BLOCK_PREMIUM = 60;

export class UnknownItemTypeError extends Error {
  constructor(type: string) {
    super(`Unknown item type: ${type}`);
  }
}

export function priceOf(type: string): PriceEntry {
  if (!Object.hasOwn(PRICE_LIST, type)) throw new UnknownItemTypeError(type);
  return PRICE_LIST[type];
}

export function insuranceSum(items: Item[]): number {
  return items.reduce((sum, item) => sum + priceOf(item.type).insuranceValue, 0);
}
