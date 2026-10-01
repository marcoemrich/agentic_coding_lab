export interface Item {
  type: string;
  material?: string;
  enchantment?: number;
  cursed?: boolean;
}

interface CatalogEntry {
  insuranceValue: number;
  basePremium: number;
  component: boolean;
}

const CATALOG: Record<string, CatalogEntry> = {
  sword: { insuranceValue: 1000, basePremium: 100, component: false },
  amulet: { insuranceValue: 600, basePremium: 60, component: false },
  staff: { insuranceValue: 800, basePremium: 80, component: false },
  potion: { insuranceValue: 400, basePremium: 40, component: false },
  rune: { insuranceValue: 250, basePremium: 25, component: true },
  moonstone: { insuranceValue: 250, basePremium: 25, component: true },
};

export class ClaimOfficeError extends Error {}

export function catalogEntry(type: string): CatalogEntry {
  if (!Object.hasOwn(CATALOG, type)) throw new ClaimOfficeError(`Unknown item type: ${type}`);
  return CATALOG[type];
}

export function isComponent(type: string): boolean {
  return catalogEntry(type).component;
}

export function insuranceSum(items: Item[]): number {
  return items.reduce((sum, item) => sum + catalogEntry(item.type).insuranceValue, 0);
}
