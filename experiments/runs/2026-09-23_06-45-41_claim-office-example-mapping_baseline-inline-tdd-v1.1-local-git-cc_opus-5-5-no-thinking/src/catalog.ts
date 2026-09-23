export interface Item {
  type: string;
  material?: string;
  enchantment?: number;
  cursed?: boolean;
}

interface CatalogEntry {
  value: number;
  premium: number;
  component: boolean;
}

const CATALOG: Record<string, CatalogEntry> = {
  sword: { value: 1000, premium: 100, component: false },
  amulet: { value: 600, premium: 60, component: false },
  staff: { value: 800, premium: 80, component: false },
  potion: { value: 400, premium: 40, component: false },
  rune: { value: 250, premium: 25, component: true },
  moonstone: { value: 250, premium: 25, component: true },
};

export const COMPONENT_BLOCK_SIZE = 3;
export const COMPONENT_BLOCK_PREMIUM = 60;

export class ValidationError extends Error {}

export function lookup(type: string): CatalogEntry {
  const entry = Object.hasOwn(CATALOG, type) ? CATALOG[type] : undefined;
  if (!entry) throw new ValidationError(`Unknown item type: ${type}`);
  return entry;
}

export function insuranceSum(items: Item[]): number {
  return items.reduce((sum, item) => sum + lookup(item.type).value, 0);
}

/** Guards final rounding against floating-point noise in fractional intermediate amounts. */
export const ROUNDING_EPSILON = 1e-9;
