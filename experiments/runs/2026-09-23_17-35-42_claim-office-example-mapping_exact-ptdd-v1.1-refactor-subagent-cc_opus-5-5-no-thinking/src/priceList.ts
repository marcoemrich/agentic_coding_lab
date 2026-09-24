/** MHPCO price list: insurance value and base premium of every insurable item type. */

export interface ItemPrice {
  insuranceValue: number;
  basePremium: number;
}

const MAIN_ITEM_PRICES: Record<string, ItemPrice> = {
  sword: { insuranceValue: 1000, basePremium: 100 },
  amulet: { insuranceValue: 600, basePremium: 60 },
  staff: { insuranceValue: 800, basePremium: 80 },
  potion: { insuranceValue: 400, basePremium: 40 },
};

/** Components are priced and insured per piece; a block of alike components has a special base premium. */
const COMPONENT_PRICE: ItemPrice = { insuranceValue: 250, basePremium: 25 };
export const COMPONENT_BLOCK_SIZE = 3;
export const COMPONENT_BLOCK_BASE_PREMIUM = 60;
const COMPONENT_TYPES = new Set(["rune", "moonstone"]);

/** Components (runes, moonstones, ...) are priced and insured per piece rather than as main items. */
export function isComponent(type: string): boolean {
  return COMPONENT_TYPES.has(type);
}

/**
 * The price-list entry of an item type: components share one entry, main items have their own.
 * Item types missing from the price list are not insurable and are rejected.
 */
export function priceOf(type: string): ItemPrice {
  if (isComponent(type)) return COMPONENT_PRICE;
  const price = MAIN_ITEM_PRICES[type] as ItemPrice | undefined;
  if (price === undefined) throw new Error(`Unknown item type '${type}': not on the MHPCO price list`);
  return price;
}
