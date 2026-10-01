import { insuranceValueOf, type Item } from "./price-list.js";

// What a policy is worth to the office and how much it may ever pay out on
// it. These figures follow from the price list alone; what a claimant may
// report against the policy is the damage report's concern.

// The MHPCO caps the total payout per policy at twice the insurance sum.
const PAYOUT_CAP_MULTIPLE = 2;

export function insuranceSumOf(items: Item[]): number {
  return items.reduce((sum, item) => sum + insuranceValueOf(item), 0);
}

export function capOf(items: Item[]): number {
  return insuranceSumOf(items) * PAYOUT_CAP_MULTIPLE;
}
