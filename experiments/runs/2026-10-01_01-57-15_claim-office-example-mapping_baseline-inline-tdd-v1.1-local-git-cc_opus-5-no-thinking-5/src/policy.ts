import { isComponent, isKnownType, type Item } from './premium.js';

const MAIN_ITEM_VALUES: Record<string, number> = {
  sword: 1000,
  amulet: 600,
  staff: 800,
  potion: 400,
};

const COMPONENT_VALUE = 250;
const CAP_FACTOR = 2;

export function itemInsuranceValue(item: Item): number {
  if (!isKnownType(item.type)) {
    throw new Error(`unknown item type: ${item.type}`);
  }
  return isComponent(item.type) ? COMPONENT_VALUE : MAIN_ITEM_VALUES[item.type];
}

export function insuranceSum(items: Item[]): number {
  return items.reduce((sum, item) => sum + itemInsuranceValue(item), 0);
}

export function payoutCap(items: Item[]): number {
  return insuranceSum(items) * CAP_FACTOR;
}
