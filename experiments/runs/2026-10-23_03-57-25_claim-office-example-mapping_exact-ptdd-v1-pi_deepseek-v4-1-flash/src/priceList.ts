export interface CatalogueEntry {
  insuranceValue: number;
  basePremium: number;
}

export const MAIN_ITEM_CATALOGUE: Record<string, CatalogueEntry> = {
  sword: { insuranceValue: 1000, basePremium: 100 },
  amulet: { insuranceValue: 600, basePremium: 60 },
  staff: { insuranceValue: 800, basePremium: 80 },
  potion: { insuranceValue: 400, basePremium: 40 },
};

export const COMPONENT_CATALOGUE: Record<string, CatalogueEntry> = {
  rune: { insuranceValue: 250, basePremium: 25 },
  moonstone: { insuranceValue: 250, basePremium: 25 },
};

export function isComponent(type: string): boolean {
  return type in COMPONENT_CATALOGUE;
}

export function isKnownItemType(type: string): boolean {
  return type in MAIN_ITEM_CATALOGUE || isComponent(type);
}

export function insuranceValueOf(type: string): number {
  return MAIN_ITEM_CATALOGUE[type]?.insuranceValue ?? COMPONENT_CATALOGUE[type]?.insuranceValue ?? 0;
}

export function basePremiumOf(type: string): number {
  return MAIN_ITEM_CATALOGUE[type]?.basePremium ?? COMPONENT_CATALOGUE[type]?.basePremium ?? 0;
}
