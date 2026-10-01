import { isComponent, type Item } from './premium.js';

const MAIN_ITEM_VALUES: Record<string, number> = {
  sword: 1000,
  amulet: 600,
  staff: 800,
  potion: 400,
};

const COMPONENT_VALUE = 250;

/** Insurance value of a single item; premium modifiers never affect it. */
export function itemValue(item: Item): number {
  if (isComponent(item.type)) return COMPONENT_VALUE;
  const value = MAIN_ITEM_VALUES[item.type];
  if (value === undefined) throw new Error(`Unknown item type: ${item.type}`);
  return value;
}

export function insuranceSum(items: Item[]): number {
  return items.reduce((sum, item) => sum + itemValue(item), 0);
}
