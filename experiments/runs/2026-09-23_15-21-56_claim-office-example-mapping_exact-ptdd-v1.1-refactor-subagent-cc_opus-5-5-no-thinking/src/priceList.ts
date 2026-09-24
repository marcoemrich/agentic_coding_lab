export type PriceListEntry = { insuranceValue: number; basePremium: number };

const MAIN_ITEM_PRICES: Record<string, PriceListEntry> = {
  sword: { insuranceValue: 1000, basePremium: 100 },
  amulet: { insuranceValue: 600, basePremium: 60 },
  staff: { insuranceValue: 800, basePremium: 80 },
  potion: { insuranceValue: 400, basePremium: 40 },
};
export const COMPONENT_TYPES = ["rune", "moonstone"];
export const COMPONENT_PRICE: PriceListEntry = { insuranceValue: 250, basePremium: 25 };
export const BUILDING_BLOCK_OFFER = { componentCount: 3, basePremium: 60 };

export function priceListEntry(itemType: string): PriceListEntry {
  const entry = COMPONENT_TYPES.includes(itemType) ? COMPONENT_PRICE : MAIN_ITEM_PRICES[itemType];
  if (entry === undefined) {
    throw new Error(`Unknown item type: ${itemType}`);
  }
  return entry;
}
