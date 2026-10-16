export interface PriceListEntry {
  insuranceValue: number;
  basePremium: number;
}

export const MAIN_ITEMS: Record<string, PriceListEntry> = {
  sword: { insuranceValue: 1000, basePremium: 100 },
  amulet: { insuranceValue: 600, basePremium: 60 },
  staff: { insuranceValue: 800, basePremium: 80 },
  potion: { insuranceValue: 400, basePremium: 40 },
};

export const COMPONENT_TYPES = ["rune", "moonstone"];
export const COMPONENT: PriceListEntry = { insuranceValue: 250, basePremium: 25 };

export function priceListEntry(type: string): PriceListEntry {
  const entry = COMPONENT_TYPES.includes(type) ? COMPONENT : MAIN_ITEMS[type];
  if (entry === undefined) {
    throw new Error(`Unknown item type: ${type}`);
  }
  return entry;
}
