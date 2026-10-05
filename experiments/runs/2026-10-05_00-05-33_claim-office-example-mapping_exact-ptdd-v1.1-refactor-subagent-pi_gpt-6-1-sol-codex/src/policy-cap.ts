import { insuranceValueForItemType } from './price-list.js';
import { roundFinalPayout } from './payout-rounding.js';

const CAP_MULTIPLIER = 2;

function insuranceSumForItems(items: readonly { type: string }[]): number {
  return items.reduce((sum, item) => sum + insuranceValueForItemType(item.type), 0);
}

export function initialCapForItems(items: readonly { type: string }[]): number {
  return CAP_MULTIPLIER * insuranceSumForItems(items);
}

export function settlePayoutAgainstCap(requestedPayout: number, remainingCap: number) {
  const payout = roundFinalPayout(Math.min(remainingCap, requestedPayout));
  return { payout, remainingCap: remainingCap - payout };
}
