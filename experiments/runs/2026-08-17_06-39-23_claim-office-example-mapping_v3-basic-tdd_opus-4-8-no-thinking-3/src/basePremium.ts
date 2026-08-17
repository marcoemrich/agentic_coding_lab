import { catalogEntry, isComponent, COMPONENT_PREMIUM } from './catalog';

export interface QuoteItem {
  type: string;
  material?: string;
  enchantment?: number;
  cursed?: boolean;
}

const BLOCK_SIZE = 3;
const BLOCK_PREMIUM = 60;

function componentGroupPremium(count: number): number {
  if (count === BLOCK_SIZE) {
    return BLOCK_PREMIUM;
  }
  return count * COMPONENT_PREMIUM;
}

export function basePremium(items: QuoteItem[]): number {
  const componentCounts = new Map<string, number>();
  let total = 0;

  for (const item of items) {
    if (isComponent(item.type)) {
      componentCounts.set(item.type, (componentCounts.get(item.type) ?? 0) + 1);
    } else {
      total += catalogEntry(item.type).premium;
    }
  }

  for (const count of componentCounts.values()) {
    total += componentGroupPremium(count);
  }

  return total;
}
