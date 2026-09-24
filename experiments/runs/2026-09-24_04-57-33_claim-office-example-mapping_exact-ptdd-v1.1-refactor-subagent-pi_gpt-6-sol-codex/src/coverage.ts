import { insuranceValue, type Item } from './item-prices.js';

const CAP_MULTIPLIER = 2;

function insuranceSum(items: Item[]): number {
  return items.reduce((sum, item) => sum + insuranceValue(item), 0);
}

export function insuranceCap(items: Item[]): number {
  return CAP_MULTIPLIER * insuranceSum(items);
}
