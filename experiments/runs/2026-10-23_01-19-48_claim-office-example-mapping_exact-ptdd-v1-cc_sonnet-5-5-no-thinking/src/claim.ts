import { type Item, insuranceSumOf } from "./price-list.js";

export type Damage = { itemType: string; amount: number };

const DEDUCTIBLE = 100;
const CAP_MULTIPLIER = 2;
const PERCENT = 100;
const HIGH_ENCHANTMENT_LEVEL = 8;
const HIGH_ENCHANTMENT_REIMBURSEMENT_PERCENT = 50;

function reimbursedAmount(item: Item, damage: Damage): number {
  if ((item.enchantment ?? 0) >= HIGH_ENCHANTMENT_LEVEL) {
    return (damage.amount * HIGH_ENCHANTMENT_REIMBURSEMENT_PERCENT) / PERCENT;
  }
  return damage.amount;
}

function payoutForDamage(item: Item, damage: Damage): number {
  return Math.max(reimbursedAmount(item, damage) - DEDUCTIBLE, 0);
}

type DamagedItem = { item: Item; damage: Damage };

function assertValidDamage(damage: Damage): void {
  if (damage.amount < 0) {
    throw new Error(`Damage amount must not be negative: ${damage.amount}`);
  }
}

function takeCoveringItem(unclaimed: Item[], damage: Damage): Item {
  const index = unclaimed.findIndex((candidate) => candidate.type === damage.itemType);
  if (index === -1) {
    throw new Error(`Damage to ${damage.itemType} is not covered by the policy`);
  }
  return unclaimed.splice(index, 1)[0];
}

function matchDamagesToItems(items: Item[], damages: Damage[]): DamagedItem[] {
  const unclaimed = [...items];
  return damages.map((damage) => {
    assertValidDamage(damage);
    return { item: takeCoveringItem(unclaimed, damage), damage };
  });
}

function damagesPayout(items: Item[], damages: Damage[]): number {
  const total = matchDamagesToItems(items, damages).reduce(
    (sum, { item, damage }) => sum + payoutForDamage(item, damage),
    0,
  );
  return Math.floor(total);
}

export type Policy = { items: Item[]; remainingCap: number };

export function openPolicy(items: Item[]): Policy {
  return { items, remainingCap: insuranceSumOf(items) * CAP_MULTIPLIER };
}

export function fileClaim(policy: Policy, damages: Damage[]): { payout: number; remainingCap: number } {
  const payout = Math.min(damagesPayout(policy.items, damages), policy.remainingCap);
  policy.remainingCap -= payout;
  return { payout, remainingCap: policy.remainingCap };
}
