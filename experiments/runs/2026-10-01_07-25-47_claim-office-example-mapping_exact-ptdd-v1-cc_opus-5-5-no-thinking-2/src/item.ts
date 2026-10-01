export interface ItemInput {
  type: string;
  material?: string;
  enchantment?: number;
  cursed?: boolean;
}

interface PriceListEntry {
  insuranceValue: number;
  basePremium: number;
}

const COMPONENT_PRICE: PriceListEntry = { insuranceValue: 250, basePremium: 25 };

const MAIN_ITEM_PRICES: Record<string, PriceListEntry> = {
  sword: { insuranceValue: 1000, basePremium: 100 },
  amulet: { insuranceValue: 600, basePremium: 60 },
  staff: { insuranceValue: 800, basePremium: 80 },
  potion: { insuranceValue: 400, basePremium: 40 },
};

export const COMPONENT_TYPES = ["rune", "moonstone"];

export function isComponent(item: ItemInput): boolean {
  return COMPONENT_TYPES.includes(item.type);
}

export function priceOf(item: ItemInput): PriceListEntry {
  const price = isComponent(item) ? COMPONENT_PRICE : MAIN_ITEM_PRICES[item.type];
  if (!price) {
    throw new Error(`Unknown item type: ${item.type}`);
  }
  return price;
}

export const COMPONENT_BASE_PREMIUM = COMPONENT_PRICE.basePremium;
