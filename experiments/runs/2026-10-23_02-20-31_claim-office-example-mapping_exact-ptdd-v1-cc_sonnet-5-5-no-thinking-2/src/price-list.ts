export interface PriceListEntry {
  insuranceValue: number;
  basePremium: number;
  isComponent: boolean;
}

const COMPONENT: PriceListEntry = { insuranceValue: 250, basePremium: 25, isComponent: true };

const PRICE_LIST = new Map<string, PriceListEntry>([
  ["sword", { insuranceValue: 1000, basePremium: 100, isComponent: false }],
  ["amulet", { insuranceValue: 600, basePremium: 60, isComponent: false }],
  ["staff", { insuranceValue: 800, basePremium: 80, isComponent: false }],
  ["potion", { insuranceValue: 400, basePremium: 40, isComponent: false }],
  ["rune", COMPONENT],
  ["moonstone", COMPONENT],
]);

export const priceListEntryOf = (itemType: string): PriceListEntry => {
  const entry = PRICE_LIST.get(itemType);
  if (entry === undefined) {
    throw new Error(`Unknown item type: ${itemType}`);
  }
  return entry;
};
