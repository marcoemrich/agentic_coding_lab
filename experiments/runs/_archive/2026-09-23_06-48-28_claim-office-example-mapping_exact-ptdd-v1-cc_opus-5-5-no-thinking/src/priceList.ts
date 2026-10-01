import type { Item } from "./item.js";

const COMPONENT_INSURANCE_VALUE = 250;
const COMPONENT_BASE_PREMIUM = 25;
const BLOCK_SIZE = 3;
const BLOCK_BASE_PREMIUM = 60;

interface ItemPrice {
  insuranceValue: number;
  basePremium: number;
}

const MAIN_ITEM_PRICES: Record<string, ItemPrice> = {
  sword: { insuranceValue: 1000, basePremium: 100 },
  amulet: { insuranceValue: 600, basePremium: 60 },
  staff: { insuranceValue: 800, basePremium: 80 },
  potion: { insuranceValue: 400, basePremium: 40 },
};
const COMPONENT_TYPES = ["rune", "moonstone"];

function isComponent(item: Item): boolean {
  return COMPONENT_TYPES.includes(item.type);
}

function mainItemPrice(item: Item): ItemPrice {
  const price = MAIN_ITEM_PRICES[item.type];
  if (!price) {
    throw new Error(`Unknown item type: ${item.type}`);
  }
  return price;
}

function itemInsuranceValue(item: Item): number {
  return isComponent(item) ? COMPONENT_INSURANCE_VALUE : mainItemPrice(item).insuranceValue;
}

export function insuranceSum(items: Item[]): number {
  return items.reduce((sum, item) => sum + itemInsuranceValue(item), 0);
}

export function itemBasePremium(item: Item): number {
  return isComponent(item) ? COMPONENT_BASE_PREMIUM : mainItemPrice(item).basePremium;
}

function componentsBasePremium(count: number): number {
  return count === BLOCK_SIZE ? BLOCK_BASE_PREMIUM : count * COMPONENT_BASE_PREMIUM;
}

export function policyBasePremium(items: Item[]): number {
  const mainItems = items.filter((item) => !isComponent(item));
  const mainItemsBase = mainItems.reduce((sum, item) => sum + itemBasePremium(item), 0);
  const componentsBase = COMPONENT_TYPES.reduce(
    (sum, type) => sum + componentsBasePremium(items.filter((item) => item.type === type).length),
    0,
  );
  return mainItemsBase + componentsBase;
}
