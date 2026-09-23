export type ItemType = 'sword' | 'amulet' | 'staff' | 'potion' | 'rune' | 'moonstone';

export interface CatalogEntry {
  insuranceValue: number;
  basePremium: number;
  component: boolean;
}

const CATALOG: Record<ItemType, CatalogEntry> = {
  sword: { insuranceValue: 1000, basePremium: 100, component: false },
  amulet: { insuranceValue: 600, basePremium: 60, component: false },
  staff: { insuranceValue: 800, basePremium: 80, component: false },
  potion: { insuranceValue: 400, basePremium: 40, component: false },
  rune: { insuranceValue: 250, basePremium: 25, component: true },
  moonstone: { insuranceValue: 250, basePremium: 25, component: true },
};

export class UnknownItemTypeError extends Error {
  constructor(type: string) {
    super(`Unknown item type: ${type}`);
    this.name = 'UnknownItemTypeError';
  }
}

export function lookup(type: string): CatalogEntry {
  const entry = CATALOG[type as ItemType];
  if (!entry) throw new UnknownItemTypeError(type);
  return entry;
}
