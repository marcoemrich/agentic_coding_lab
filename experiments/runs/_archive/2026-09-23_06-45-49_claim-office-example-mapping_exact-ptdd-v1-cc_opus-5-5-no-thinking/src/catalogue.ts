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
export const COMPONENT_PRICE: PriceListEntry = { insuranceValue: 250, basePremium: 25 };

export function isComponent(item: Item): boolean {
  return COMPONENT_TYPES.includes(item.type);
}

export function isKnownItemType(type: string): boolean {
  return type in MAIN_ITEM_PRICE_LIST || COMPONENT_TYPES.includes(type);
}

function priceListEntry(item: Item): PriceListEntry {
  if (isComponent(item)) {
    return COMPONENT_PRICE;
  }
  if (!isKnownItemType(item.type)) {
    throw new Error(`Unknown item type: ${item.type}`);
  }
  return MAIN_ITEM_PRICE_LIST[item.type];
}

export function mainItemBasePremium(item: Item): number {
  return priceListEntry(item).basePremium;
}

export function insuranceValue(item: Item): number {
  return priceListEntry(item).insuranceValue;
}
