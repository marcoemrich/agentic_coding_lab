import { basePremiumForItemType } from './price-list.js';

const BLOCK_SIZE = 3;
const BLOCK_PREMIUM = 60;
function qualifiesForComponentBlock(type: string, count: number): boolean {
  return (type === 'rune' || type === 'moonstone') && count === BLOCK_SIZE;
}

function basePremiumForTypeCount(type: string, count: number): number {
  return qualifiesForComponentBlock(type, count) ? BLOCK_PREMIUM : count * basePremiumForItemType(type);
}

export function basePremiumForItems(items: readonly { type: string }[]): number {
  const counts = new Map<string, number>();
  for (const item of items) counts.set(item.type, (counts.get(item.type) ?? 0) + 1);
  return [...counts].reduce((sum, [type, count]) => sum + basePremiumForTypeCount(type, count), 0);
}

