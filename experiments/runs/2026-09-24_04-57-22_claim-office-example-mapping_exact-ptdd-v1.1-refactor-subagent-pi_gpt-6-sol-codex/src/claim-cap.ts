import { policyInsuranceSum } from './insurance-sum.js';

const CAP_MULTIPLIER = 2;

type Item = { type: string };

export function policyPayoutCap(items: Item[]): number {
  return policyInsuranceSum(items) * CAP_MULTIPLIER;
}

function roundPayoutInMHPCOsFavor(amount: number): number {
  return Math.floor(amount);
}

export function capClaimPayout(desiredPayout: number, remainingCap: number) {
  const payout = roundPayoutInMHPCOsFavor(Math.min(remainingCap, desiredPayout));
  return { payout, remainingCap: remainingCap - payout };
}
