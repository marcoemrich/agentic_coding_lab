import type { ItemType } from './types.js';

interface ItemSpec {
  insuranceValue: number;
  basePremium: number;
}

const MAIN_ITEMS: Record<string, ItemSpec> = {
  sword:  { insuranceValue: 1000, basePremium: 100 },
  amulet: { insuranceValue: 600,  basePremium: 60  },
  staff:  { insuranceValue: 800,  basePremium: 80  },
  potion: { insuranceValue: 400,  basePremium: 40  },
};

const COMPONENT_TYPES = new Set(['rune', 'moonstone']);
const COMPONENT_VALUE = 250;
const COMPONENT_PREMIUM = 25;
const BLOCK_OF_THREE_PREMIUM = 60;

export function isKnownType(type: string): boolean {
  return type in MAIN_ITEMS || COMPONENT_TYPES.has(type);
}

export function isComponent(type: string): boolean {
  return COMPONENT_TYPES.has(type);
}

export function insuranceValue(type: string): number {
  if (type in MAIN_ITEMS) return MAIN_ITEMS[type].insuranceValue;
  if (COMPONENT_TYPES.has(type)) return COMPONENT_VALUE;
  throw new Error(`Unknown item type: ${type}`);
}

export function itemBasePremium(type: string): number {
  if (type in MAIN_ITEMS) return MAIN_ITEMS[type].basePremium;
  if (COMPONENT_TYPES.has(type)) return COMPONENT_PREMIUM;
  throw new Error(`Unknown item type: ${type}`);
}

export function componentBlockPremium(count: number, perItem: number = COMPONENT_PREMIUM): number {
  if (count === 3) return BLOCK_OF_THREE_PREMIUM;
  return count * perItem;
}
