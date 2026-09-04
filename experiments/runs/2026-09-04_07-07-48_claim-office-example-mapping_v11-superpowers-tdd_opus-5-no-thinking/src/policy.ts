import {
  COMPONENT_INSURANCE_VALUE,
  MAIN_ITEM_INSURANCE_VALUE,
  isComponent,
  type Item,
} from './premium.js';

export function itemInsuranceValue(item: Item): number {
  return isComponent(item)
    ? COMPONENT_INSURANCE_VALUE
    : MAIN_ITEM_INSURANCE_VALUE[item.type];
}

export function insuranceSum(items: Item[]): number {
  return items.reduce((sum, item) => sum + itemInsuranceValue(item), 0);
}

export interface Policy {
  items: Item[];
  remainingCap: number;
}

const CAP_MULTIPLIER = 2;

export function createPolicy(items: Item[]): Policy {
  return { items, remainingCap: insuranceSum(items) * CAP_MULTIPLIER };
}
