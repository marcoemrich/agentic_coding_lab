import { type Item, itemInsuranceValue } from "./price-list.js";

export interface Policy {
  items: Item[];
  remainingCap: number;
}

function insuranceSum(items: Item[]): number {
  return items.reduce((sum, item) => sum + itemInsuranceValue(item), 0);
}

const CAP_FACTOR = 2;

function payoutCap(items: Item[]): number {
  return CAP_FACTOR * insuranceSum(items);
}

export function issuePolicy(items: Item[]): Policy {
  return { items, remainingCap: payoutCap(items) };
}
