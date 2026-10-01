import type { Item } from "./claim-office.js";

interface PriceListEntry {
  insuranceValue: number;
  basePremium: number;
}

const COMPONENT: PriceListEntry = { insuranceValue: 250, basePremium: 25 };
const COMPONENT_TYPES = ["rune", "moonstone"];
const BLOCK_SIZE = 3;
const BLOCK_BASE_PREMIUM = 60;

const PRICE_LIST: Record<string, PriceListEntry> = {
  sword: { insuranceValue: 1000, basePremium: 100 },
  amulet: { insuranceValue: 600, basePremium: 60 },
  staff: { insuranceValue: 800, basePremium: 80 },
  potion: { insuranceValue: 400, basePremium: 40 },
  rune: COMPONENT,
  moonstone: COMPONENT,
};

function isInsurableType(type: string): boolean {
  return Object.hasOwn(PRICE_LIST, type);
}

function priceListEntry(item: Item): PriceListEntry {
  if (!isInsurableType(item.type)) {
    throw new Error(`Unknown item type: ${item.type}`);
  }
  return PRICE_LIST[item.type];
}

export function itemBasePremium(item: Item): number {
  return priceListEntry(item).basePremium;
}

export function insuranceSum(items: Item[]): number {
  return items.reduce((sum, item) => sum + priceListEntry(item).insuranceValue, 0);
}

function componentsBasePremium(count: number): number {
  return count === BLOCK_SIZE ? BLOCK_BASE_PREMIUM : count * COMPONENT.basePremium;
}

export function policyBasePremium(items: Item[]): number {
  const mainItems = items.filter((item) => !COMPONENT_TYPES.includes(item.type));
  const mainItemsPremium = mainItems.reduce((sum, item) => sum + itemBasePremium(item), 0);
  const componentsPremium = COMPONENT_TYPES.reduce(
    (sum, type) => sum + componentsBasePremium(items.filter((item) => item.type === type).length),
    0,
  );
  return mainItemsPremium + componentsPremium;
}
