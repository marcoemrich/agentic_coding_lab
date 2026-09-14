import { isComponent, lookup } from './catalog.js';

export interface Item {
  type: string;
  material?: string;
  enchantment?: number;
  cursed?: boolean;
}

const BLOCK_SIZE = 3;
const BLOCK_PREMIUM = 60;

export class UnknownItemError extends Error {
  constructor(type: string) {
    super(`unknown item type: ${type}`);
  }
}

function specOf(item: Item) {
  const spec = lookup(item.type);
  if (!spec) throw new UnknownItemError(item.type);
  return spec;
}

export function insuranceSum(items: Item[]): number {
  return items.reduce((sum, item) => sum + specOf(item).insuranceValue, 0);
}

/** Base premium of a single item, ignoring component block discounts. */
export function itemBasePremium(item: Item): number {
  return specOf(item).basePremium;
}

/** Base premium of the whole policy, applying the block of 3 alike components. */
export function policyBasePremium(items: Item[]): number {
  let total = 0;
  const componentCounts = new Map<string, number>();
  for (const item of items) {
    const spec = specOf(item);
    if (isComponent(item.type)) {
      componentCounts.set(item.type, (componentCounts.get(item.type) ?? 0) + 1);
    } else {
      total += spec.basePremium;
    }
  }
  for (const [type, count] of componentCounts) {
    const spec = lookup(type)!;
    total += count === BLOCK_SIZE ? BLOCK_PREMIUM : count * spec.basePremium;
  }
  return total;
}
