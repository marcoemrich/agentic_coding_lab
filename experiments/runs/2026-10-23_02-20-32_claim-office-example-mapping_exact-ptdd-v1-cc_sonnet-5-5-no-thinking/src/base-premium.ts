import {
  MAIN_ITEM_PRICES,
  COMPONENT_BASE_PREMIUM,
  COMPONENT_BLOCK_BASE_PREMIUM,
  COMPONENT_BLOCK_SIZE,
  isMainItemType,
} from "./price-list.js";
import type { Item } from "./item.js";

function alikeComponentsPremium(count: number): number {
  return count === COMPONENT_BLOCK_SIZE
    ? COMPONENT_BLOCK_BASE_PREMIUM
    : count * COMPONENT_BASE_PREMIUM;
}

function isMainItem(item: Item): boolean {
  return isMainItemType(item.type);
}

function countByType(items: Item[]): number[] {
  const counts = new Map<string, number>();
  for (const item of items) {
    counts.set(item.type, (counts.get(item.type) ?? 0) + 1);
  }
  return [...counts.values()];
}

export function basePremium(items: Item[]): number {
  const mainItems = items.filter(isMainItem);
  const components = items.filter((item) => !isMainItem(item));
  const mainItemsPremium = mainItems.reduce(
    (sum, item) => sum + MAIN_ITEM_PRICES[item.type].basePremium,
    0,
  );
  const componentsPremium = countByType(components).reduce(
    (sum, count) => sum + alikeComponentsPremium(count),
    0,
  );
  return mainItemsPremium + componentsPremium;
}
