import { insuranceValueOf } from "./item-price-rules.js";
import type { Item } from "./policy.js";

/** The policy's insurance sum is the sum of its items' insurance values. */
export function insuranceSum(items: readonly Item[]): number {
  return items.reduce((sum, item) => sum + insuranceValueOf(item), 0);
}

/** The total payout per policy is capped at twice the insurance sum. */
const PAYOUT_CAP_MULTIPLE = 2;

export function payoutCap(items: readonly Item[]): number {
  return insuranceSum(items) * PAYOUT_CAP_MULTIPLE;
}
