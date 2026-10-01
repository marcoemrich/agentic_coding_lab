import type { Item } from "./claimOffice.js";

type PriceListEntry = { insuranceValue: number; basePremium: number };

const MAIN_ITEMS: Record<string, PriceListEntry> = {
  sword: { insuranceValue: 1000, basePremium: 100 },
  amulet: { insuranceValue: 600, basePremium: 60 },
  staff: { insuranceValue: 800, basePremium: 80 },
  potion: { insuranceValue: 400, basePremium: 40 },
};
const COMPONENT_TYPES = ["rune", "moonstone"];
const COMPONENT: PriceListEntry = { insuranceValue: 250, basePremium: 25 };
const BLOCK_SIZE = 3;
const BLOCK_BASE_PREMIUM = 60;

function isComponent(item: Item): boolean {
  return COMPONENT_TYPES.includes(item.type);
}

function priceListEntry(item: Item): PriceListEntry {
  const entry = isComponent(item) ? COMPONENT : MAIN_ITEMS[item.type];
  if (!entry) {
    throw new Error(`Unknown item type: ${item.type}`);
  }
  return entry;
}

function componentsBasePremium(count: number): number {
  return count === BLOCK_SIZE ? BLOCK_BASE_PREMIUM : count * COMPONENT.basePremium;
}

export function mainItemBasePremium(item: Item): number {
  return isComponent(item) ? 0 : priceListEntry(item).basePremium;
}

export function policyBasePremium(items: Item[]): number {
  const mainItemsPremium = items.reduce((sum, item) => sum + mainItemBasePremium(item), 0);
  const componentsPremium = COMPONENT_TYPES.reduce(
    (sum, type) => sum + componentsBasePremium(items.filter((item) => item.type === type).length),
    0,
  );
  return mainItemsPremium + componentsPremium;
}

export function insuranceSum(items: Item[]): number {
  return items.reduce((sum, item) => sum + priceListEntry(item).insuranceValue, 0);
}
