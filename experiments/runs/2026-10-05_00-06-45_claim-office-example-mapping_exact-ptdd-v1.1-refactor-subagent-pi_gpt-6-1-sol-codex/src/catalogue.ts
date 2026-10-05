import type { Item } from './item.js';

const prices: Record<string, { basePremium: number; insuranceValue: number }> = {
  sword: { basePremium: 100, insuranceValue: 1000 },
  amulet: { basePremium: 60, insuranceValue: 600 },
  staff: { basePremium: 80, insuranceValue: 800 },
  potion: { basePremium: 40, insuranceValue: 400 },
  rune: { basePremium: 25, insuranceValue: 250 },
  moonstone: { basePremium: 25, insuranceValue: 250 },
};

export function priceForItemType(type: string) {
  const price = prices[type];
  if (!Object.hasOwn(prices, type)) {
    throw new Error(`Unknown item type: ${type}`);
  }
  return price;
}

export function insuranceSum(items: Item[]): number {
  return items.reduce((sum, item) => sum + priceForItemType(item.type).insuranceValue, 0);
}
