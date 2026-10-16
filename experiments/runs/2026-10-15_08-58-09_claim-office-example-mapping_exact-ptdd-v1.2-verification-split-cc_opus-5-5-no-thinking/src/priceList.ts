interface MainItemPrice {
  insuranceValue: number;
  basePremium: number;
}

const MAIN_ITEMS: Record<string, MainItemPrice> = {
  sword: { insuranceValue: 1000, basePremium: 100 },
  amulet: { insuranceValue: 600, basePremium: 60 },
  staff: { insuranceValue: 800, basePremium: 80 },
  potion: { insuranceValue: 400, basePremium: 40 },
};

export const COMPONENT_TYPES = ["rune", "moonstone"];
const COMPONENT_INSURANCE_VALUE = 250;
const COMPONENT_BASE_PREMIUM = 25;
const BLOCK_SIZE = 3;
const BLOCK_BASE_PREMIUM = 60;

export function assertKnownItemType(type: string): void {
  if (!isComponent(type) && !(type in MAIN_ITEMS)) {
    throw new Error(`Unknown item type: ${type}`);
  }
}

export function isComponent(type: string): boolean {
  return COMPONENT_TYPES.includes(type);
}

export function mainItemBasePremium(type: string): number {
  return MAIN_ITEMS[type].basePremium;
}

export function insuranceValue(type: string): number {
  return isComponent(type) ? COMPONENT_INSURANCE_VALUE : MAIN_ITEMS[type].insuranceValue;
}

export function alikeComponentsBasePremium(count: number): number {
  return count === BLOCK_SIZE ? BLOCK_BASE_PREMIUM : count * COMPONENT_BASE_PREMIUM;
}
