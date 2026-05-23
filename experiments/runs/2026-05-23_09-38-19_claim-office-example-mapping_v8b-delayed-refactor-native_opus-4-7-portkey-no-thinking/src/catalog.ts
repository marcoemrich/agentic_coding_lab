import { Item } from "./types.js";

export interface ItemSpec {
  insuranceValue: number;
  basePremium: number;
}

const MAIN_ITEM_SPECS: Record<string, ItemSpec> = {
  sword: { insuranceValue: 1000, basePremium: 100 },
  amulet: { insuranceValue: 600, basePremium: 60 },
  staff: { insuranceValue: 800, basePremium: 80 },
  potion: { insuranceValue: 400, basePremium: 40 },
};

const COMPONENT_SPEC: ItemSpec = { insuranceValue: 250, basePremium: 25 };
const COMPONENT_TYPES = new Set(["rune", "moonstone"]);

export const COMPONENT_BLOCK_SIZE = 3;
export const COMPONENT_BLOCK_PREMIUM = 60;

export function isComponent(item: Item): boolean {
  return COMPONENT_TYPES.has(item.type);
}

export function isMainItem(item: Item): boolean {
  return item.type in MAIN_ITEM_SPECS;
}

export function isKnownItem(item: Item): boolean {
  return isMainItem(item) || isComponent(item);
}

export function specOf(item: Item): ItemSpec {
  if (isMainItem(item)) return MAIN_ITEM_SPECS[item.type];
  if (isComponent(item)) return COMPONENT_SPEC;
  throw new Error(`Unknown item type: ${item.type}`);
}
