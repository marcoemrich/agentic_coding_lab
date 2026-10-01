import type { Item } from "./item.js";
import { priceOf } from "./price-list.js";

const CAP_MULTIPLE_OF_INSURANCE_SUM = 2;

export function insuranceSum(items: Item[]): number {
  return items.reduce(
    (total, item) => total + priceOf(item.type).insuranceValue,
    0,
  );
}

export function payoutCap(items: Item[]): number {
  return insuranceSum(items) * CAP_MULTIPLE_OF_INSURANCE_SUM;
}
