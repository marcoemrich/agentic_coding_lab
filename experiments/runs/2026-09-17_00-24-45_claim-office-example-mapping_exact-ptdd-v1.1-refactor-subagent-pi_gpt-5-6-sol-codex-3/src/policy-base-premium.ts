import { itemBasePremium } from "./item-catalogue.js";

const EXACT_BLOCK_SIZE = 3;
const COMPONENT_BLOCK_BASE_PREMIUM_G = 60;
const COMPONENT_TYPES = ["rune", "moonstone"];

function componentBlockDiscountForType(
  items: Array<{ type: string }> | undefined,
  componentType: string,
): number {
  const count = items?.filter((item) => item.type === componentType).length ?? 0;
  return count === EXACT_BLOCK_SIZE
    ? EXACT_BLOCK_SIZE * itemBasePremium(componentType) - COMPONENT_BLOCK_BASE_PREMIUM_G
    : 0;
}

function componentBlockDiscount(items: Array<{ type: string }> | undefined): number {
  return COMPONENT_TYPES.reduce(
    (discount, type) => discount + componentBlockDiscountForType(items, type),
    0,
  );
}

export function basePremiumForItems(items: Array<{ type: string }> | undefined): number {
  const listedPremium = items?.reduce((sum, item) => sum + itemBasePremium(item.type), 0) ?? 0;
  return listedPremium - componentBlockDiscount(items);
}
