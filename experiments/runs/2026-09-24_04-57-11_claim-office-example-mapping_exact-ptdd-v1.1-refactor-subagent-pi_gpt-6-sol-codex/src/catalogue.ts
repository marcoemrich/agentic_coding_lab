export type Item = { type: string; material?: string; enchantment?: number; cursed?: boolean };

const prices: Record<string, { value: number; premium: number }> = {
  sword: { value: 1000, premium: 100 },
  amulet: { value: 600, premium: 60 },
  staff: { value: 800, premium: 80 },
  potion: { value: 400, premium: 40 },
  rune: { value: 250, premium: 25 },
  moonstone: { value: 250, premium: 25 },
};

export function price(type: string) {
  const entry = prices[type];
  if (!entry) throw new Error(`Unknown item type: ${type}`);
  return entry;
}

export function insuranceSum(items: Item[]): number {
  return items.reduce((sum, item) => sum + price(item.type).value, 0);
}
