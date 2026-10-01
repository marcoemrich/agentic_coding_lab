export interface Item {
  type: string;
  material?: string;
  enchantment?: number;
  cursed?: boolean;
}

export interface PriceListEntry {
  insuranceValue: number;
  basePremium: number;
  component: boolean;
}

const PRICE_LIST: Record<string, PriceListEntry> = {
  sword: { insuranceValue: 1000, basePremium: 100, component: false },
  amulet: { insuranceValue: 600, basePremium: 60, component: false },
  staff: { insuranceValue: 800, basePremium: 80, component: false },
  potion: { insuranceValue: 400, basePremium: 40, component: false },
  rune: { insuranceValue: 250, basePremium: 25, component: true },
  moonstone: { insuranceValue: 250, basePremium: 25, component: true },
};

export function priceListEntry(type: string): PriceListEntry {
  const entry = PRICE_LIST[type];
  if (!entry) {
    throw new Error(`Unknown item type: ${type}`);
  }
  return entry;
}
