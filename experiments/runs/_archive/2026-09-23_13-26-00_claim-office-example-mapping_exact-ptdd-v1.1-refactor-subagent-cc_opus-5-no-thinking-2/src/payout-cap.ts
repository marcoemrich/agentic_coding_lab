import { policyInsuranceSum, type Item } from "./item-pricing.js";

const CAP_MULTIPLE_OF_INSURANCE_SUM = 2;

/**
 * The MHPCO's promise-ceiling rule: the office will ever pay out at most twice
 * a policy's insurance sum, and it treats that ceiling as a finite balance —
 * every payout draws the balance down, and once it is exhausted the office pays
 * nothing more. Establishing the ceiling and drawing on it are the same office
 * decision about how far its promise reaches, so they are stated together here.
 */
export function payoutCapOf(items: Item[]): number {
  return policyInsuranceSum(items) * CAP_MULTIPLE_OF_INSURANCE_SUM;
}

/** What the cap still affords of a desired payout, and what is left afterwards. */
export function drawFromCap(
  remainingCap: number,
  desiredPayout: number,
): { payout: number; remainingCap: number } {
  const affordable = Math.min(desiredPayout, remainingCap);
  return { payout: affordable, remainingCap: remainingCap - affordable };
}
