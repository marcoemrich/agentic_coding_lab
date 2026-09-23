import { Item, itemInsuranceValue } from './premium.js';

const CAP_FACTOR = 2;

/** The sum of the unmodified insurance values of all covered items. */
export function insuranceSum(items: Item[]): number {
  return items.reduce((sum, item) => sum + itemInsuranceValue(item), 0);
}

export function cap(items: Item[]): number {
  return CAP_FACTOR * insuranceSum(items);
}
