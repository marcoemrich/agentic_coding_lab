import { itemSpec } from './items.js';
import { Item } from './premium.js';

const CAP_FACTOR = 2;

/** The sum of the items' unmodified insurance values. */
export function insuranceSum(items: Item[]): number {
  return items.reduce((sum, i) => sum + (itemSpec(i.type)?.insuranceValue ?? 0), 0);
}

/** The total payout per policy is capped at twice the insurance sum. */
export function cap(items: Item[]): number {
  return insuranceSum(items) * CAP_FACTOR;
}
