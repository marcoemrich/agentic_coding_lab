import { type Item, isComponent } from './quote.js';

const INSURANCE_VALUES: Record<string, number> = {
  sword: 1000,
  amulet: 600,
  staff: 800,
  potion: 400,
};

const COMPONENT_INSURANCE_VALUE = 250;

export function insuranceValue(type: string): number {
  return isComponent(type) ? COMPONENT_INSURANCE_VALUE : INSURANCE_VALUES[type];
}

/** The sum of the items' unmodified insurance values. */
export function insuranceSum(items: Item[]): number {
  return items.reduce((sum, item) => sum + insuranceValue(item.type), 0);
}
