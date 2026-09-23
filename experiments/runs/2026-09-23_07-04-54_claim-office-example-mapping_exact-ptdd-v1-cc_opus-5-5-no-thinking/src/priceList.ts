import type { InsuredItem } from "./types.js";

type PriceListEntry = { insuranceValue: number; basePremium: number };

const MAIN_ITEMS: Record<string, PriceListEntry> = {
  sword: { insuranceValue: 1000, basePremium: 100 },
  amulet: { insuranceValue: 600, basePremium: 60 },
  staff: { insuranceValue: 800, basePremium: 80 },
  potion: { insuranceValue: 400, basePremium: 40 },
};
const COMPONENT_TYPES = new Set(["rune", "moonstone"]);
const COMPONENT_INSURANCE_VALUE = 250;
export const COMPONENT_BASE_PREMIUM = 25;

function mainItemEntry(type: string): PriceListEntry {
  const entry = MAIN_ITEMS[type];
  if (!entry) throw new Error(`Unknown item type: ${type}`);
  return entry;
}

export const isComponent = (item: InsuredItem): boolean => COMPONENT_TYPES.has(item.type);

export const mainItemBasePremium = (item: InsuredItem): number => mainItemEntry(item.type).basePremium;

export function insuranceValue(item: InsuredItem): number {
  return isComponent(item) ? COMPONENT_INSURANCE_VALUE : mainItemEntry(item.type).insuranceValue;
}
