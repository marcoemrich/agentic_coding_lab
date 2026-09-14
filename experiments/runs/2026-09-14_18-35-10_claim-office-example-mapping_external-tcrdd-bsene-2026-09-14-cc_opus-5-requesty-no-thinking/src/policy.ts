import { lookUp, type Item } from './catalogue';

export function insuranceSum(items: Item[]): number {
  return items.reduce((sum, item) => sum + lookUp(item.type).insuranceValue, 0);
}

export type Policy = {
  items: Item[];
  remainingCap: number;
};

const CAP_FACTOR = 2;

export function createPolicy(items: Item[]): Policy {
  return { items, remainingCap: CAP_FACTOR * insuranceSum(items) };
}
