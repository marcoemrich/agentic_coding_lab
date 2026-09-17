import { calculateInsuranceSum, type InsuredItem } from "./insurance-valuation.js";

const POLICY_PAYOUT_CAP_MULTIPLIER = 2;

export function calculateInitialPolicyCap(items: InsuredItem[]): number {
  return calculateInsuranceSum(items) * POLICY_PAYOUT_CAP_MULTIPLIER;
}

export function applyPayoutToPolicyCap(
  requestedPayout: number,
  remainingCap: number,
): { payout: number; remainingCap: number } {
  const payout = Math.min(requestedPayout, remainingCap);
  return { payout, remainingCap: remainingCap - payout };
}
