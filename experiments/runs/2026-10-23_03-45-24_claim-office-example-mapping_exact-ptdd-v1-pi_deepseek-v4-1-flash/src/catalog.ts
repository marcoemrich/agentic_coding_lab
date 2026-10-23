export interface CatalogEntry {
  value: number;
  premium: number;
}

const PRICE_LIST: Record<string, CatalogEntry> = {
  sword: { value: 1000, premium: 100 },
  amulet: { value: 600, premium: 60 },
  staff: { value: 800, premium: 80 },
  potion: { value: 400, premium: 40 },
  rune: { value: 250, premium: 25 },
  moonstone: { value: 250, premium: 25 },
};

export function catalogEntry(itemType: string): CatalogEntry {
  const entry = PRICE_LIST[itemType];
  if (entry === undefined) {
    throw new Error(`unknown item type: ${itemType}`);
  }
  return entry;
}
