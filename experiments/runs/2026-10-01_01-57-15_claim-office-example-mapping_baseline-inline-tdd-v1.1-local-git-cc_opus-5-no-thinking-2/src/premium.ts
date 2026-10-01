import { itemSpec } from './items.js';

export interface Item {
  type: string;
  material?: string;
  enchantment?: number;
  cursed?: boolean;
}

const BLOCK_SIZE = 3;
const BLOCK_PREMIUM = 60;

/** Component types of which the policy holds exactly enough for a building block. */
function blockedComponentTypes(items: Item[]): Set<string> {
  const counts = new Map<string, number>();
  for (const item of items) {
    if (itemSpec(item.type)?.kind === 'component') {
      counts.set(item.type, (counts.get(item.type) ?? 0) + 1);
    }
  }
  return new Set([...counts].filter(([, count]) => count === BLOCK_SIZE).map(([type]) => type));
}

/**
 * The base premium attributable to each individual item, with a block discount
 * spread evenly across the components forming the block. Item-specific
 * surcharges are computed against these amounts. Unknown types are skipped.
 */
export function itemBasePremiums(items: Item[]): { item: Item; basePremium: number }[] {
  const blocked = blockedComponentTypes(items);
  return items.flatMap((item) => {
    const spec = itemSpec(item.type);
    if (!spec) return [];
    const basePremium = blocked.has(item.type) ? BLOCK_PREMIUM / BLOCK_SIZE : spec.basePremium;
    return [{ item, basePremium }];
  });
}

/** Base premium of the whole policy: the sum of all item base premiums. */
export function policyBasePremium(items: Item[]): number {
  return itemBasePremiums(items).reduce((sum, { basePremium }) => sum + basePremium, 0);
}
