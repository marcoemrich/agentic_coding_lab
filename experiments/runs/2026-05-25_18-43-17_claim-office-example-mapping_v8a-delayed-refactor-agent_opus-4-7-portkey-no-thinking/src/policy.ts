import { Item, Policy } from './types.js';
import { insuranceValueOf, isKnownType } from './catalogue.js';

const CAP_MULTIPLIER = 2;

function validateItems(items: Item[]): void {
  for (const item of items) {
    if (!isKnownType(item.type)) {
      throw new Error(`Unknown item type: ${item.type}`);
    }
  }
}

export function makePolicy(items: Item[]): Policy {
  validateItems(items);
  const insuranceSum = items.reduce(
    (sum, item) => sum + insuranceValueOf(item.type),
    0
  );
  const cap = insuranceSum * CAP_MULTIPLIER;
  return { items, insuranceSum, cap, remainingCap: cap };
}
