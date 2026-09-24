import type { InsuredItem } from "./insured-item";
import { unitInsuranceValue } from "./price-list";

// A policy's payout cap: the total payout per policy is capped at twice the insurance sum.
const CAP_FACTOR = 2;

export interface Policy {
  items: InsuredItem[];
  remainingCap: number;
}

// The insurance sum uses each item's price-list insurance value; premium-only rules such as curse surcharges
// or the building-block discount do not change it.
function insuranceSum(items: InsuredItem[]): number {
  return items.reduce((sum, item) => sum + unitInsuranceValue(item.type), 0);
}

export function openPolicy(items: InsuredItem[]): Policy {
  return { items, remainingCap: CAP_FACTOR * insuranceSum(items) };
}

// Pays out at most what is left of the policy's cap and deducts the payout from it.
export function drawFromCap(policy: Policy, payout: number): number {
  const cappedPayout = Math.min(payout, policy.remainingCap);
  policy.remainingCap -= cappedPayout;
  return cappedPayout;
}
