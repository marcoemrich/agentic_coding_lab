export const COMPONENT_VALUE = 250;
export const COMPONENT_PREMIUM = 25;

export interface CatalogEntry {
  value: number;
  premium: number;
}

const MAIN_ITEMS: Record<string, CatalogEntry> = {
  sword: { value: 1000, premium: 100 },
  amulet: { value: 600, premium: 60 },
  staff: { value: 800, premium: 80 },
  potion: { value: 400, premium: 40 },
};

const COMPONENTS = new Set(['rune', 'moonstone']);

export function isMainItem(type: string): boolean {
  return type in MAIN_ITEMS;
}

export function isComponent(type: string): boolean {
  return COMPONENTS.has(type);
}

export function catalogEntry(type: string): CatalogEntry {
  if (isMainItem(type)) {
    return MAIN_ITEMS[type];
  }
  if (isComponent(type)) {
    return { value: COMPONENT_VALUE, premium: COMPONENT_PREMIUM };
  }
  throw new Error(`Unknown item type: ${type}`);
}
