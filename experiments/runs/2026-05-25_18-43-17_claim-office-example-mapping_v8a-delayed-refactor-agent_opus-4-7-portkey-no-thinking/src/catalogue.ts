export const MAIN_ITEM_TYPES = ['sword', 'amulet', 'staff', 'potion'] as const;
export const COMPONENT_TYPES = ['rune', 'moonstone'] as const;
export const KNOWN_TYPES = [...MAIN_ITEM_TYPES, ...COMPONENT_TYPES] as const;

export interface ItemSpec {
  insuranceValue: number;
  basePremium: number;
}

const MAIN_ITEMS: Record<string, ItemSpec> = {
  sword: { insuranceValue: 1000, basePremium: 100 },
  amulet: { insuranceValue: 600, basePremium: 60 },
  staff: { insuranceValue: 800, basePremium: 80 },
  potion: { insuranceValue: 400, basePremium: 40 },
};

const COMPONENT_ITEM: ItemSpec = { insuranceValue: 250, basePremium: 25 };
export const COMPONENT_BLOCK_PREMIUM = 60;
export const COMPONENT_BLOCK_SIZE = 3;

export function isKnownType(type: string): boolean {
  return (KNOWN_TYPES as readonly string[]).includes(type);
}

export function isComponentType(type: string): boolean {
  return (COMPONENT_TYPES as readonly string[]).includes(type);
}

export function getItemSpec(type: string): ItemSpec {
  if (MAIN_ITEMS[type]) return MAIN_ITEMS[type];
  if (isComponentType(type)) return COMPONENT_ITEM;
  throw new Error(`Unknown item type: ${type}`);
}

export function insuranceValueOf(type: string): number {
  return getItemSpec(type).insuranceValue;
}
