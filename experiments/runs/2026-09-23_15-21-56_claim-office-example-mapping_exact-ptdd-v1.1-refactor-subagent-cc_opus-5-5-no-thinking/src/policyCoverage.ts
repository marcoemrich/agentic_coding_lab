import type { Item } from "./magicalItem.js";
import { priceListEntry } from "./priceList.js";

const CAP_MULTIPLIER = 2;

export type Policy = { items: Item[]; remainingCap: number };

function insuranceSum(items: Item[]): number {
  return items.reduce((sum, item) => sum + priceListEntry(item.type).insuranceValue, 0);
}

function coverageCap(items: Item[]): number {
  return insuranceSum(items) * CAP_MULTIPLIER;
}

export function insureItems(items: Item[]): Policy {
  return { items, remainingCap: coverageCap(items) };
}

export function drawFromCap(policy: Policy, desiredPayout: number): number {
  const payout = Math.min(desiredPayout, policy.remainingCap);
  policy.remainingCap -= payout;
  return payout;
}
