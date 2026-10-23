// MHPCO price list: insurance value and base premium per item type, in G.
// Components (rune, moonstone) share one 250 G / 25 G entry.
export interface PriceListEntry {
  insuranceValue: number;
  basePremium: number;
  component?: boolean;
}

export const PRICE_LIST: Record<string, PriceListEntry> = {
  sword: { insuranceValue: 1000, basePremium: 100 },
  amulet: { insuranceValue: 600, basePremium: 60 },
  staff: { insuranceValue: 800, basePremium: 80 },
  potion: { insuranceValue: 400, basePremium: 40 },
  rune: { insuranceValue: 250, basePremium: 25, component: true },
  moonstone: { insuranceValue: 250, basePremium: 25, component: true },
};

export function priceListEntry(type: string): PriceListEntry | undefined {
  return PRICE_LIST[type];
}

export function isComponent(type: string): boolean {
  return priceListEntry(type)?.component === true;
}

export function itemBasePremium(type: string): number {
  return priceListEntry(type)?.basePremium ?? 0;
}

export function itemInsuranceValue(type: string): number {
  return priceListEntry(type)?.insuranceValue ?? 0;
}
