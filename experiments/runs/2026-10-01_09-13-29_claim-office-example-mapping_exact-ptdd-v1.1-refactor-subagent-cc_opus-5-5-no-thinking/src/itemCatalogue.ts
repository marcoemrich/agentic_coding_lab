export interface InsuredItem {
  type: string;
  material?: string;
  enchantment?: number;
  cursed?: boolean;
}

// One line of the MHPCO price list, in whole G.
export interface PriceListEntry {
  insuranceValue: number;
  basePremium: number;
}

// Components are the small items (runes, moonstones) priced and insured per piece.
const COMPONENT_TYPES = ["rune", "moonstone"];
const COMPONENT_PRICE: PriceListEntry = { insuranceValue: 250, basePremium: 25 };
const MAIN_ITEM_PRICES: Record<string, PriceListEntry> = {
  sword: { insuranceValue: 1000, basePremium: 100 },
  amulet: { insuranceValue: 600, basePremium: 60 },
  staff: { insuranceValue: 800, basePremium: 80 },
  potion: { insuranceValue: 400, basePremium: 40 },
};

export function isComponent(type: string): boolean {
  return COMPONENT_TYPES.includes(type);
}

export function priceListEntryFor(type: string): PriceListEntry {
  if (isComponent(type)) {
    return COMPONENT_PRICE;
  }
  if (!(type in MAIN_ITEM_PRICES)) {
    throw new Error(`Unknown item type: ${type}`);
  }
  return MAIN_ITEM_PRICES[type];
}
