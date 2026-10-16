import { percentOf, roundPayoutInMhpcoFavor } from "./amounts.js";
import type { Item } from "./premium.js";
import { insuranceValueOf } from "./priceList.js";

export type Damage = { itemType: string; amount: number };
export type ClaimResult = { payout: number; remainingCap: number };

const CAP_MULTIPLIER = 2;
const DEDUCTIBLE = 100;
const HIGH_ENCHANTMENT_CLAUSE_LEVEL = 8;
const HIGH_ENCHANTMENT_REIMBURSEMENT_PERCENT = 50;

export type Policy = { items: Item[]; remainingCap: number };

export function openPolicy(items: Item[]): Policy {
  const insuranceSum = items.reduce((sum, item) => sum + insuranceValueOf(item.type), 0);
  return { items, remainingCap: CAP_MULTIPLIER * insuranceSum };
}

const isHighlyEnchantedForClaim = (item: Item): boolean =>
  (item.enchantment ?? 0) >= HIGH_ENCHANTMENT_CLAUSE_LEVEL;

// Dragon material is fully reimbursed, but the high-enchantment clause wins.
function reimbursement(item: Item, amount: number): number {
  if (isHighlyEnchantedForClaim(item)) {
    return percentOf(amount, HIGH_ENCHANTMENT_REIMBURSEMENT_PERCENT);
  }
  return amount;
}

function assertValidDamageAmount(damage: Damage): void {
  if (damage.amount < 0) throw new Error(`Invalid damage amount: ${damage.amount}`);
}

// Each damage entry refers to a separate insured item of its type.
function takeDamagedItem(undamagedItems: Item[], damage: Damage): Item {
  const index = undamagedItems.findIndex((insured) => insured.type === damage.itemType);
  if (index < 0) throw new Error(`Damaged item not covered by policy: ${damage.itemType}`);
  return undamagedItems.splice(index, 1)[0];
}

// The deductible applies once per damage event.
function payoutForDamageEvent(item: Item, damage: Damage): number {
  return reimbursement(item, damage.amount) - DEDUCTIBLE;
}

function desiredPayout(policy: Policy, damages: Damage[]): number {
  const undamagedItems = [...policy.items];
  return damages.reduce((sum, damage) => {
    assertValidDamageAmount(damage);
    return sum + payoutForDamageEvent(takeDamagedItem(undamagedItems, damage), damage);
  }, 0);
}

// The total payout per policy is capped at twice the insurance sum.
export function claim(policy: Policy, damages: Damage[]): ClaimResult {
  const payout = Math.min(roundPayoutInMhpcoFavor(desiredPayout(policy, damages)), policy.remainingCap);
  policy.remainingCap -= payout;
  return { payout, remainingCap: policy.remainingCap };
}
