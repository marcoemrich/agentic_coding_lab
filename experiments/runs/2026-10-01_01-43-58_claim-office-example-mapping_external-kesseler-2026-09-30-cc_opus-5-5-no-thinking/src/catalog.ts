export interface CatalogEntry {
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

export function catalogEntry(type: string): CatalogEntry {
  if (!Object.hasOwn(CATALOG, type)) {
    throw new Error(`Unknown item type: ${type}`);
  }
  return CATALOG[type];
}
