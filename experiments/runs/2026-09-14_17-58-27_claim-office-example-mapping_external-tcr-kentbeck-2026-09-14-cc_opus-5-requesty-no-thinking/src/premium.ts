import { specFor } from './catalog.js';

export interface Item {
  type: string;
  material?: string;
  enchantment?: number;
  cursed?: boolean;
}

const BLOCK_SIZE = 3;
const BLOCK_PREMIUM = 60;

const CURSE_SURCHARGE = 0.5;
const HIGH_ENCHANTMENT_SURCHARGE = 0.3;
const HIGH_ENCHANTMENT_THRESHOLD = 5;

export function itemSurcharges(item: Item): number {
  const base = itemBasePremium(item);
  let surcharge = 0;
  if (item.cursed) {
    surcharge += base * CURSE_SURCHARGE;
  }
  if ((item.enchantment ?? 0) >= HIGH_ENCHANTMENT_THRESHOLD) {
    surcharge += base * HIGH_ENCHANTMENT_SURCHARGE;
  }
  return surcharge;
}

export function itemBasePremium(item: Item): number {
  const spec = specFor(item.type);
  if (!spec) {
    throw new Error(`unknown item type: ${item.type}`);
  }
  return spec.basePremium;
}

export function policyBasePremium(items: Item[]): number {
  let total = 0;
  const componentCounts = new Map<string, number>();
  for (const item of items) {
    const spec = specFor(item.type);
    if (!spec) {
      throw new Error(`unknown item type: ${item.type}`);
    }
    if (spec.component) {
      componentCounts.set(item.type, (componentCounts.get(item.type) ?? 0) + 1);
    } else {
      total += spec.basePremium;
    }
  }
  for (const [type, count] of componentCounts) {
    const spec = specFor(type)!;
    total += count === BLOCK_SIZE ? BLOCK_PREMIUM : count * spec.basePremium;
  }
  return total;
}
