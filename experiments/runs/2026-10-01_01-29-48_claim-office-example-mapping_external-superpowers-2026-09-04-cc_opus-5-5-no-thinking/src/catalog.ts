export interface Item {
  type: string;
  material?: string;
  enchantment?: number;
  cursed?: boolean;
}

export interface PriceListEntry {
  kind: 'main' | 'component';
  insuranceValue: number;
  basePremium: number;
}

const PRICE_LIST: Record<string, PriceListEntry> = {
  sword: { kind: 'main', insuranceValue: 1000, basePremium: 100 },
  amulet: { kind: 'main', insuranceValue: 600, basePremium: 60 },
  staff: { kind: 'main', insuranceValue: 800, basePremium: 80 },
  potion: { kind: 'main', insuranceValue: 400, basePremium: 40 },
  rune: { kind: 'component', insuranceValue: 250, basePremium: 25 },
  moonstone: { kind: 'component', insuranceValue: 250, basePremium: 25 },
};

export function priceListEntry(type: string): PriceListEntry {
  if (!Object.hasOwn(PRICE_LIST, type)) throw new Error(`Unknown item type: ${type}`);
  return PRICE_LIST[type];
}
