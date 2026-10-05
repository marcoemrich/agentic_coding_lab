import type { Item } from './item.js';
export type Policy = { items: Item[]; remainingCap: number };
const componentValue = 250;
const insuranceValues: Record<string, number> = { sword: 1000, amulet: 600, staff: 800, potion: 400, rune: componentValue, moonstone: componentValue };
const capMultiplier = 2;
function insuranceSum(items: Item[]): number {
  return items.reduce((sum, item) => sum + insuranceValues[item.type], 0);
}
export function settlePayout(policy: Policy, desired: number) {
  const payout = Math.min(policy.remainingCap, desired);
  policy.remainingCap -= payout;
  return { payout, remainingCap: policy.remainingCap };
}
export function createPolicy(items: Item[]): Policy {
  return { items, remainingCap: insuranceSum(items) * capMultiplier };
}
