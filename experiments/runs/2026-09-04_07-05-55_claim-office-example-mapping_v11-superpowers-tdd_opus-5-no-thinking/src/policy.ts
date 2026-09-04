import type { Item } from './quote.js';

export const INSURANCE_VALUES: Record<string, number> = {
  sword: 1000,
  amulet: 600,
  staff: 800,
  potion: 400,
  rune: 250,
  moonstone: 250,
};

const CAP_FACTOR = 2;

export interface Policy {
  items: Item[];
  insuranceSum: number;
  remainingCap: number;
}

export function createPolicy(items: Item[]): Policy {
  const insuranceSum = items.reduce((sum, item) => sum + INSURANCE_VALUES[item.type], 0);
  return { items, insuranceSum, remainingCap: insuranceSum * CAP_FACTOR };
}
