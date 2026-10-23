import { insuranceValueOf } from "./price-list.js";
import type { QuoteItem } from "./premium.js";
import { type Damage, payoutForDamage } from "./reimbursement.js";

export interface ClaimSettlement {
  payout: number;
  remainingCap: number;
}

export interface Policy {
  items: QuoteItem[];
  remainingCap: number;
}

const CAP_MULTIPLE = 2;

function insuranceSum(policyItems: QuoteItem[]): number {
  return policyItems.reduce((sum, item) => sum + insuranceValueOf(item.type), 0);
}

function takeNextInsuredItem(undamagedItems: QuoteItem[], itemType: string): QuoteItem {
  const position = undamagedItems.findIndex((item) => item.type === itemType);
  if (position === -1) {
    throw new Error(`Damaged item is not covered by the policy: ${itemType}`);
  }
  return undamagedItems.splice(position, 1)[0];
}

function totalReimbursement(policyItems: QuoteItem[], damages: Damage[]): number {
  const undamagedItems = [...policyItems];
  return damages.reduce((sum, damage) => {
    const damagedItem = takeNextInsuredItem(undamagedItems, damage.itemType);
    return sum + payoutForDamage(damagedItem, damage);
  }, 0);
}

function rejectNegativeAmounts(damages: Damage[]): void {
  for (const damage of damages) {
    if (damage.amount < 0) {
      throw new Error(`Damage amount must not be negative: ${damage.amount}`);
    }
  }
}

export function openPolicy(items: QuoteItem[]): Policy {
  return { items, remainingCap: CAP_MULTIPLE * insuranceSum(items) };
}

export function fileClaim(policy: Policy, damages: Damage[]): ClaimSettlement {
  rejectNegativeAmounts(damages);
  const payout = Math.min(Math.floor(totalReimbursement(policy.items, damages)), policy.remainingCap);
  policy.remainingCap -= payout;
  return { payout, remainingCap: policy.remainingCap };
}
