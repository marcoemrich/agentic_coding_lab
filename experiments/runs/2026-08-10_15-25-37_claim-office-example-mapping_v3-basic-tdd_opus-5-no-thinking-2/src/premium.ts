import { BLOCK_PREMIUM, BLOCK_SIZE, basePremiumOf, isComponent } from './catalog.js';
import type { Item } from './types.js';

function countByType(items: Item[]): Map<string, number> {
  const counts = new Map<string, number>();
  for (const item of items) {
    counts.set(item.type, (counts.get(item.type) ?? 0) + 1);
  }
  return counts;
}

/**
 * Base premium of a whole policy: the sum of the items' base premiums, with
 * a special rate for each building block of exactly 3 alike components.
 */
export function policyBasePremium(items: Item[]): number {
  const counts = countByType(items);
  let total = 0;
  for (const [type, count] of counts) {
    const isBlock = isComponent(type) && count === BLOCK_SIZE;
    total += isBlock ? BLOCK_PREMIUM : count * basePremiumOf({ type });
  }
  return total;
}
