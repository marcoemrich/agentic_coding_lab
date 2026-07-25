import { countByType } from "./collections.js";

export interface Item {
  type: string;
}

const BASE_PREMIUM_PER_ITEM = 25;
const BLOCK_SIZE = 3;
const BLOCK_PRICE = 60;

export const MAIN_ITEM_BASE_PREMIUM_BY_TYPE: Record<string, number> = {
  sword: 100,
  amulet: 60,
  staff: 80,
  potion: 40,
};

const isMainItem = (item: Item): boolean => item.type in MAIN_ITEM_BASE_PREMIUM_BY_TYPE;

export const policyBasePremium = (items: Item[]): number => {
  const mainItemsTotal = items
    .filter(isMainItem)
    .reduce((sum, item) => sum + MAIN_ITEM_BASE_PREMIUM_BY_TYPE[item.type], 0);

  const componentCountsByType = countByType(
    items.filter((item) => !isMainItem(item)),
    (item) => item.type
  );
  let componentsTotal = 0;
  for (const count of componentCountsByType.values()) {
    componentsTotal += count === BLOCK_SIZE ? BLOCK_PRICE : count * BASE_PREMIUM_PER_ITEM;
  }

  return mainItemsTotal + componentsTotal;
};

const INSURANCE_VALUE_BY_TYPE: Record<string, number> = {
  sword: 1000,
  amulet: 600,
  rune: 250,
};
const UNINSURED_ITEM_VALUE = 0;

export const insuranceSum = (items: Item[]): number => {
  return items.reduce(
    (sum, item) => sum + (INSURANCE_VALUE_BY_TYPE[item.type] ?? UNINSURED_ITEM_VALUE),
    0
  );
};
