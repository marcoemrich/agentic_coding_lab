export type Item = {
  type: string;
  material?: string;
  enchantment?: number;
  cursed?: boolean;
};

type CatalogueEntry = {
  insuranceValue: number;
  basePremium: number;
  component: boolean;
};

const CATALOGUE: Record<string, CatalogueEntry> = {
  sword: { insuranceValue: 1000, basePremium: 100, component: false },
  amulet: { insuranceValue: 600, basePremium: 60, component: false },
  staff: { insuranceValue: 800, basePremium: 80, component: false },
  potion: { insuranceValue: 400, basePremium: 40, component: false },
  rune: { insuranceValue: 250, basePremium: 25, component: true },
  moonstone: { insuranceValue: 250, basePremium: 25, component: true },
};

export const COMPONENT_TYPES = Object.keys(CATALOGUE).filter((type) => CATALOGUE[type].component);

export function lookUp(type: string): CatalogueEntry {
  const entry = CATALOGUE[type];
  if (entry === undefined) {
    throw new Error(`unknown item type: ${type}`);
  }
  return entry;
}
