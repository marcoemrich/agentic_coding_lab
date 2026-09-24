export type Item = { type: string; material?: string; enchantment?: number; cursed?: boolean };

const PRICE_LIST: Record<string, { base: number; value: number }> = {
  sword: { base: 100, value: 1000 },
  amulet: { base: 60, value: 600 },
  staff: { base: 80, value: 800 },
  potion: { base: 40, value: 400 },
  rune: { base: 25, value: 250 },
  moonstone: { base: 25, value: 250 },
};

export function itemPrice(item: Item) {
  const entry = PRICE_LIST[item.type];
  if (!entry) throw new Error(`Unknown insured item type: ${item.type}`);
  return entry;
}

export function insuranceValue(item: Item): number {
  return itemPrice(item).value;
}
