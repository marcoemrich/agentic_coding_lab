import { insuranceSum } from './catalogue.js';
import type { Item } from './item.js';

const CAP_MULTIPLIER = 2;

export function initialPolicyCap(items: Item[]): number {
  return insuranceSum(items) * CAP_MULTIPLIER;
}

export function settlePolicyClaim(remainingCap: number, requestedPayout: number) {
  const payout = Math.min(remainingCap, requestedPayout);
  return { payout, remainingCap: remainingCap - payout };
}
