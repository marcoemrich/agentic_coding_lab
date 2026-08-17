import { isComponent, itemBasePremium, ItemType } from './catalog';

const BLOCK_SIZE = 3;
const BLOCK_PREMIUM = 60;

interface HasType {
  type: string;
}

function componentGroupPremium(type: ItemType, count: number): number {
  if (count === BLOCK_SIZE) {
    return BLOCK_PREMIUM;
  }
  return count * itemBasePremium(type);
}

function countByType(items: HasType[]): Map<string, number> {
  const counts = new Map<string, number>();
  for (const { type } of items) {
    counts.set(type, (counts.get(type) ?? 0) + 1);
  }
  return counts;
}

export function policyBasePremium(items: HasType[]): number {
  let total = 0;
  for (const [type, count] of countByType(items)) {
    if (isComponent(type)) {
      total += componentGroupPremium(type, count);
    } else {
      total += count * itemBasePremium(type as ItemType);
    }
  }
  return total;
}
