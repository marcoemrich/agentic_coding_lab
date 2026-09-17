import { itemInsuranceValue } from "./item-catalogue.js";

const POLICY_PAYOUT_CAP_MULTIPLIER = 2;

function policyInsuranceSum(items: Array<{ type: string }>): number {
  return items.reduce((sum, item) => sum + itemInsuranceValue(item.type), 0);
}

export function initialPolicyPayoutCap(items: Array<{ type: string }>): number {
  return policyInsuranceSum(items) * POLICY_PAYOUT_CAP_MULTIPLIER;
}

export function payoutAllowedByRemainingPolicyCap(
  desiredPayout: number,
  remainingCap: number,
): number {
  return Math.min(desiredPayout, remainingCap);
}
