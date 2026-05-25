import { Damage, Item, Policy } from "./types.js";

const DEDUCTIBLE = 100;
const HIGH_ENCH_PAYOUT_THRESHOLD = 8;
const HIGH_ENCH_PAYOUT_RATE = 0.5;

function reimbursableFor(item: Item, damageAmount: number): number {
  const enchantment = item.enchantment ?? 0;
  if (enchantment >= HIGH_ENCH_PAYOUT_THRESHOLD) {
    return damageAmount * HIGH_ENCH_PAYOUT_RATE;
  }
  return damageAmount;
}

export function createPolicy(items: Item[], insuranceSum: number): Policy {
  const cap = insuranceSum * 2;
  return {
    items: items.slice(),
    insuranceSum,
    cap,
    remainingCap: cap,
  };
}

export function processClaim(
  policy: Policy,
  damages: Damage[],
): { payout: number; remainingCap: number } {
  // Validate: every damage must match an unused policy item of the same type.
  // Each policy item can be referenced at most once per claim.
  const matched: Item[] = [];
  const availableItems = policy.items.slice();
  for (const damage of damages) {
    if (damage.amount < 0) {
      throw new Error(`Negative damage amount: ${damage.amount}`);
    }
    const idx = availableItems.findIndex((it) => it.type === damage.itemType);
    if (idx === -1) {
      throw new Error(
        `Damage references item type "${damage.itemType}" not (or no longer) in policy`,
      );
    }
    matched.push(availableItems[idx]);
    availableItems.splice(idx, 1);
  }

  // Compute the gross payout (before cap). Per spec: high-enchantment halves
  // the damage and wins over dragon material when both apply; dragon-only is
  // fully reimbursed. Deductible is applied per damaged item, last.
  let totalPayout = 0;
  for (let i = 0; i < damages.length; i++) {
    const reimbursable = reimbursableFor(matched[i], damages[i].amount);
    totalPayout += Math.max(0, reimbursable - DEDUCTIBLE);
  }

  // Round payout down (MHPCO's favor).
  let payout = Math.floor(totalPayout);
  // Apply cap.
  if (payout > policy.remainingCap) {
    payout = policy.remainingCap;
  }
  policy.remainingCap -= payout;
  return { payout, remainingCap: policy.remainingCap };
}
