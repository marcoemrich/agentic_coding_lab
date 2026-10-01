import type { QuoteItem } from "./item.js";
import { priceOf } from "./priceList.js";

export interface Policy {
  insuredItems: QuoteItem[];
  remainingCap: number;
}

const CAP_MULTIPLIER = 2;

function insuranceValueOf(item: QuoteItem): number {
  return priceOf(item.type).insuranceValue;
}

function insuranceSumOf(items: QuoteItem[]): number {
  return items.reduce((sum, item) => sum + insuranceValueOf(item), 0);
}

export function policyFor(items: QuoteItem[]): Policy {
  return { insuredItems: items, remainingCap: insuranceSumOf(items) * CAP_MULTIPLIER };
}

export function insuredItemsFor(policy: Policy, damagedItemTypes: string[]): QuoteItem[] {
  const unmatchedInsuredItems = [...policy.insuredItems];
  return damagedItemTypes.map((itemType) => {
    const index = unmatchedInsuredItems.findIndex((item) => item.type === itemType);
    if (index < 0) {
      throw new Error(`Damaged item is not covered by the policy: ${itemType}`);
    }
    return unmatchedInsuredItems.splice(index, 1)[0];
  });
}

export function drawFromCap(policy: Policy, payout: number): number {
  policy.remainingCap -= payout;
  return policy.remainingCap;
}
