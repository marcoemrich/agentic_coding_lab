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
const COMPONENT: PriceListEntry = { insuranceValue: 250, basePremium: 25 };
const COMPONENT_TYPES = ["rune", "moonstone"];

export function isComponent(type: string): boolean {
  return COMPONENT_TYPES.includes(type);
}

function priceListEntry(type: string): PriceListEntry {
  if (isComponent(type)) return COMPONENT;
  if (!Object.hasOwn(MAIN_ITEMS, type)) throw new Error(`Unknown item type: ${type}`);
  return MAIN_ITEMS[type];
}

export function basePremium(type: string): number {
  return priceListEntry(type).basePremium;
}

export function insuranceValue(type: string): number {
  return priceListEntry(type).insuranceValue;
}
