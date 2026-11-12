import { insuranceSum, type Item } from "./price-list.js";

export type Policy = { items: Item[]; remainingCap: number };

const CAP_FACTOR = 2;

export function issuePolicy(items: Item[]): Policy {
  return { items, remainingCap: CAP_FACTOR * insuranceSum(items) };
}
