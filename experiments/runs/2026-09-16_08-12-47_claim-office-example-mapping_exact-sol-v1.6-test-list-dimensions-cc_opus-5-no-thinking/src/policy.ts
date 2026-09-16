import type { Item } from "./item.js";
import { insuranceValueOf } from "./price-list.js";

/** The total payout per policy is capped at twice the insurance sum. */
const CAP_MULTIPLE = 2;

export interface Policy {
  readonly items: Item[];
  readonly insuranceSumInG: number;
  readonly capInG: number;
  /** Cap still available after the claims settled so far. */
  remainingCapInG: number;
}

export function createPolicy(items: Item[]): Policy {
  const insuranceSumInG = items.reduce((total, item) => total + insuranceValueOf(item.type), 0);
  const capInG = insuranceSumInG * CAP_MULTIPLE;
  return { items, insuranceSumInG, capInG, remainingCapInG: capInG };
}

/** Pays out as much of the desired amount as the policy's remaining cap allows. */
export function drawDownCap(policy: Policy, desiredPayoutInG: number): number {
  const payout = Math.max(0, Math.min(desiredPayoutInG, policy.remainingCapInG));
  policy.remainingCapInG -= payout;
  return payout;
}
