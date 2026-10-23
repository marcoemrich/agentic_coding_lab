import { catalogEntry } from "./catalog.js";
import { claimPayoutForDamages, type Damage } from "./claims.js";
import type { Item } from "./pricing.js";

const CAP_MULTIPLIER = 2;

export interface PolicyState {
  items: Item[];
  remainingCap: number;
}

export interface ClaimResult {
  payout: number;
  remainingCap: number;
}

export function policyInsuranceSum(items: Item[]): number {
  return items.reduce((total, item) => total + catalogEntry(item.type).value, 0);
}

export function policyCap(items: Item[]): number {
  return policyInsuranceSum(items) * CAP_MULTIPLIER;
}

export function processClaim(policy: PolicyState, damages: Damage[]): ClaimResult {
  const requested = claimPayoutForDamages(policy.items, damages);
  const payout = Math.min(requested, policy.remainingCap);
  return { payout, remainingCap: policy.remainingCap - payout };
}
