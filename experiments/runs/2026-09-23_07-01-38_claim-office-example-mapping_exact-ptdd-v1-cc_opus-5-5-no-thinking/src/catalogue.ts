import type { Item } from "./claimOffice.js";

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

export const COMPONENT_TYPES = ["rune", "moonstone"];
export const COMPONENT: PriceListEntry = { insuranceValue: 250, basePremium: 25 };

export function isComponent(item: Item): boolean {
  return COMPONENT_TYPES.includes(item.type);
}

export function mainItemEntry(item: Item): PriceListEntry {
  const entry = MAIN_ITEMS[item.type];
  if (entry === undefined) {
    throw new Error(`Unknown item type: ${item.type}`);
  }
  return entry;
}

export function insuranceValue(item: Item): number {
  return isComponent(item) ? COMPONENT.insuranceValue : mainItemEntry(item).insuranceValue;
}
