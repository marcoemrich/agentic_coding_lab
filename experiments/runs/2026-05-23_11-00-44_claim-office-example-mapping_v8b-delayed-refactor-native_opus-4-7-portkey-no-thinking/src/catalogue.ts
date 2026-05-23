import { Item } from "./types.js";

interface MainItemSpec {
  insuranceValue: number;
  basePremium: number;
}

const MAIN_ITEMS: Record<string, MainItemSpec> = {
  sword: { insuranceValue: 1000, basePremium: 100 },
  amulet: { insuranceValue: 600, basePremium: 60 },
  staff: { insuranceValue: 800, basePremium: 80 },
  potion: { insuranceValue: 400, basePremium: 40 },
};

const COMPONENT_TYPES = new Set(["rune", "moonstone"]);

export const COMPONENT_INSURANCE_VALUE = 250;
export const COMPONENT_BASE_PREMIUM = 25;
export const BLOCK_SIZE = 3;
export const BLOCK_BASE_PREMIUM = 60;

export function isMainItem(type: string): boolean {
  return type in MAIN_ITEMS;
}

export function isComponent(type: string): boolean {
  return COMPONENT_TYPES.has(type);
}

export function isKnownType(type: string): boolean {
  return isMainItem(type) || isComponent(type);
}

export function assertKnownType(type: string): void {
  if (!isKnownType(type)) {
    throw new Error(`Unknown item type: ${type}`);
  }
}

export function insuranceValueOf(item: Item): number {
  if (isMainItem(item.type)) return MAIN_ITEMS[item.type].insuranceValue;
  if (isComponent(item.type)) return COMPONENT_INSURANCE_VALUE;
  throw new Error(`Unknown item type: ${item.type}`);
}

export function mainItemBasePremium(type: string): number {
  return MAIN_ITEMS[type].basePremium;
}
