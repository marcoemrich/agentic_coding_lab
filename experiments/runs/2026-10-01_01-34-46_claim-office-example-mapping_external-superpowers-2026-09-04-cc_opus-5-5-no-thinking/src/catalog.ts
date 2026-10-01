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

const COMPONENT_TYPES = new Set(['rune', 'moonstone']);
export const COMPONENT: PriceListEntry = { insuranceValue: 250, basePremium: 25 };

export function isMainItem(type: string): boolean {
  return Object.hasOwn(MAIN_ITEMS, type);
}

export function isKnownType(type: string): boolean {
  return isMainItem(type) || COMPONENT_TYPES.has(type);
}

export function assertKnownType(type: string): void {
  if (!isKnownType(type)) throw new Error(`Unknown item type: ${type}`);
}

export function mainItemBasePremium(type: string): number {
  return MAIN_ITEMS[type].basePremium;
}

export function insuranceValue(type: string): number {
  return isMainItem(type) ? MAIN_ITEMS[type].insuranceValue : COMPONENT.insuranceValue;
}
