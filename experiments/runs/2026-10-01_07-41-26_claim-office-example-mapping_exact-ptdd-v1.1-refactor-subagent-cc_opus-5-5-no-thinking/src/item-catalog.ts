export interface Item {
  type: string;
  material?: string;
  enchantment?: number;
  cursed?: boolean;
}

interface PriceListEntry {
  insuranceValue: number;
  basePremium: number;
}

const MAIN_ITEM_PRICE_LIST: Record<string, PriceListEntry> = {
  sword: { insuranceValue: 1000, basePremium: 100 },
  amulet: { insuranceValue: 600, basePremium: 60 },
  staff: { insuranceValue: 800, basePremium: 80 },
  potion: { insuranceValue: 400, basePremium: 40 },
};
const COMPONENT_TYPES = ["rune", "moonstone"];
export const COMPONENT_PRICE_LIST_ENTRY: PriceListEntry = {
  insuranceValue: 250,
  basePremium: 25,
};

export function isComponent(item: Item): boolean {
  return COMPONENT_TYPES.includes(item.type);
}

function priceListEntryOf(item: Item): PriceListEntry {
  if (isComponent(item)) {
    return COMPONENT_PRICE_LIST_ENTRY;
  }
  const entry = MAIN_ITEM_PRICE_LIST[item.type];
  if (entry === undefined) {
    throw new Error(`Unknown item type: ${item.type}`);
  }
  return entry;
}

export function basePremiumOf(item: Item): number {
  return priceListEntryOf(item).basePremium;
}

export function insuranceValueOf(item: Item): number {
  return priceListEntryOf(item).insuranceValue;
}

export function enchantmentLevelOf(item: Item): number {
  return item.enchantment ?? 0;
}
