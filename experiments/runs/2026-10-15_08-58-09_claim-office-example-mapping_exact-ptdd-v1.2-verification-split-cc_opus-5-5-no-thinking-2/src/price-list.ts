export type InsuredItem = {
  type: string;
  material?: string;
  enchantment?: number;
  cursed?: boolean;
};

export type Price = { insuranceValue: number; basePremium: number };

// The MHPCO price list for main items.
export const MAIN_ITEM_PRICES: Record<string, Price> = {
  sword: { insuranceValue: 1000, basePremium: 100 },
  amulet: { insuranceValue: 600, basePremium: 60 },
  staff: { insuranceValue: 800, basePremium: 80 },
  potion: { insuranceValue: 400, basePremium: 40 },
};

// Components such as runes and moonstones share one price.
const COMPONENT_TYPES = ["rune", "moonstone"];
export const COMPONENT_PRICE: Price = { insuranceValue: 250, basePremium: 25 };

export function isComponent(type: string): boolean {
  return COMPONENT_TYPES.includes(type);
}

export function priceOf(type: string): Price {
  const price = isComponent(type) ? COMPONENT_PRICE : MAIN_ITEM_PRICES[type];
  if (price === undefined) {
    throw new Error(`unknown item type: ${type}`);
  }
  return price;
}
