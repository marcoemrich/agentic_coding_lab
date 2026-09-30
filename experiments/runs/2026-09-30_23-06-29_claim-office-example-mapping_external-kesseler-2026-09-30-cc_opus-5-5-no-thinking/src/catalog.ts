type CatalogEntry = { insuranceValue: number; basePremium: number; isComponent: boolean };

const COMPONENT: CatalogEntry = { insuranceValue: 250, basePremium: 25, isComponent: true };

const PRICE_LIST: Record<string, CatalogEntry> = {
  sword: { insuranceValue: 1000, basePremium: 100, isComponent: false },
  amulet: { insuranceValue: 600, basePremium: 60, isComponent: false },
  staff: { insuranceValue: 800, basePremium: 80, isComponent: false },
  potion: { insuranceValue: 400, basePremium: 40, isComponent: false },
  rune: COMPONENT,
  moonstone: COMPONENT,
};

export function catalogEntry(type: string): CatalogEntry | undefined {
  return Object.hasOwn(PRICE_LIST, type) ? PRICE_LIST[type] : undefined;
}
