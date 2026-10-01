import type { QuoteItem } from "./item.js";
import { COMPONENT_PRICE, isComponentType, isMainItemType, priceOf } from "./priceList.js";

const BLOCK_SIZE = 3;
const BLOCK_BASE_PREMIUM = 60;

function isComponent(item: QuoteItem): boolean {
  return isComponentType(item.type);
}

function isMainItem(item: QuoteItem): boolean {
  return isMainItemType(item.type);
}

export function mainItemsOf(items: QuoteItem[]): QuoteItem[] {
  return items.filter(isMainItem);
}

export function mainItemBasePremiumOf(mainItem: QuoteItem): number {
  return priceOf(mainItem.type).basePremium;
}

function mainItemsBasePremiumOf(items: QuoteItem[]): number {
  return mainItemsOf(items).reduce((sum, mainItem) => sum + mainItemBasePremiumOf(mainItem), 0);
}

function alikenessOf(component: QuoteItem): string {
  return component.type;
}

function alikeComponentCountsOf(items: QuoteItem[]): number[] {
  const countsByAlikeness = new Map<string, number>();
  for (const alikeness of items.filter(isComponent).map(alikenessOf)) {
    countsByAlikeness.set(alikeness, (countsByAlikeness.get(alikeness) ?? 0) + 1);
  }
  return [...countsByAlikeness.values()];
}

function isBuildingBlock(alikeComponentCount: number): boolean {
  return alikeComponentCount === BLOCK_SIZE;
}

function alikeComponentsBasePremiumOf(count: number): number {
  return isBuildingBlock(count) ? BLOCK_BASE_PREMIUM : count * COMPONENT_PRICE.basePremium;
}

function componentsBasePremiumOf(items: QuoteItem[]): number {
  return alikeComponentCountsOf(items).reduce((sum, count) => sum + alikeComponentsBasePremiumOf(count), 0);
}

export function policyBasePremiumOf(items: QuoteItem[]): number {
  return mainItemsBasePremiumOf(items) + componentsBasePremiumOf(items);
}
