import type { Item } from './premium.js';

export type Policy = { items: Item[]; remainingCap: number };
const insuranceValues: Record<string, number> = { sword: 1000, amulet: 600, staff: 800, potion: 400, rune: 250, moonstone: 250 };
const capMultiple = 2;

export function settlePayout(policy: Policy, desiredPayout: number) {
  const payout = Math.floor(Math.min(desiredPayout, policy.remainingCap));
  policy.remainingCap -= payout;
  return { payout, remainingCap: policy.remainingCap };
}

export function createPolicy(items: Item[]): Policy {
  const insuranceSum = items.reduce((total, item) => total + insuranceValues[item.type], 0);
  return { items, remainingCap: capMultiple * insuranceSum };
}
