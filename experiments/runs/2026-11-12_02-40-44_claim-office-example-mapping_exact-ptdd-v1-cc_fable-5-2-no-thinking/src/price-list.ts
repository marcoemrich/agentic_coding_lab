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

const MAIN_ITEMS: Record<string, PriceListEntry> = {
  sword: { insuranceValue: 1000, basePremium: 100 },
  amulet: { insuranceValue: 600, basePremium: 60 },
  staff: { insuranceValue: 800, basePremium: 80 },
  potion: { insuranceValue: 400, basePremium: 40 },
};

const COMPONENT_TYPES = new Set(["rune", "moonstone"]);
const COMPONENT: PriceListEntry = { insuranceValue: 250, basePremium: 25 };

export function isComponent(item: Item): boolean {
  return COMPONENT_TYPES.has(item.type);
}

function priceListEntry(item: Item): PriceListEntry {
  if (isComponent(item)) {
    return COMPONENT;
  }
  if (!Object.hasOwn(MAIN_ITEMS, item.type)) {
    throw new Error(`Unknown item type: ${item.type}`);
  }
  return MAIN_ITEMS[item.type];
}

export function itemBasePremium(item: Item): number {
  return priceListEntry(item).basePremium;
}

export function itemInsuranceValue(item: Item): number {
  return priceListEntry(item).insuranceValue;
}
