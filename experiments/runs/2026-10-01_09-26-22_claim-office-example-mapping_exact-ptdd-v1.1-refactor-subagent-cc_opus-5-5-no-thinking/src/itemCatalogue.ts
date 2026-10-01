import type { Item } from "./claimOffice";

interface MainItemTerms {
  insuranceValue: number;
  basePremium: number;
}

const MAIN_ITEM_TERMS: Record<string, MainItemTerms> = {
  sword: { insuranceValue: 1000, basePremium: 100 },
  amulet: { insuranceValue: 600, basePremium: 60 },
  staff: { insuranceValue: 800, basePremium: 80 },
  potion: { insuranceValue: 400, basePremium: 40 },
};

const COMPONENT_TYPES = new Set(["rune", "moonstone"]);
const COMPONENT_INSURANCE_VALUE = 250;
export const COMPONENT_BASE_PREMIUM = 25;

export function isComponent(item: Item): boolean {
  return COMPONENT_TYPES.has(item.type);
}

function isKnownItemType(type: string): boolean {
  return COMPONENT_TYPES.has(type) || type in MAIN_ITEM_TERMS;
}

export function assertKnownItems(items: Item[]): void {
  const unknownItem = items.find((item) => !isKnownItemType(item.type));
  if (unknownItem) {
    throw new Error(`Unknown item type: ${unknownItem.type}`);
  }
}

export function insuranceValue(item: Item): number {
  return isComponent(item) ? COMPONENT_INSURANCE_VALUE : MAIN_ITEM_TERMS[item.type].insuranceValue;
}

export function mainItemBasePremium(item: Item): number {
  return MAIN_ITEM_TERMS[item.type].basePremium;
}
