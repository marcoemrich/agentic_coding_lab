import type { Item } from './premium.js';
import type { Policy } from './policy.js';

export interface Damage {
  itemType: string;
  amount: number;
}

export interface ClaimResult {
  payout: number;
  remainingCap: number;
}

/**
 * Pairs each damage with a distinct insured item, so a repeated item type
 * draws its own deductible. Throws when a damage names an item the policy
 * does not cover, or covers fewer times than it is claimed.
 */
export function matchDamagesToItems(
  policy: Policy,
  damages: Damage[],
): { item: Item; amount: number }[] {
  const unclaimed = [...policy.items];

  return damages.map((damage) => {
    if (damage.amount < 0) {
      throw new Error(`damage amount must not be negative: ${damage.amount}`);
    }
    const index = unclaimed.findIndex((item) => item.type === damage.itemType);
    if (index === -1) {
      throw new Error(`item not covered by the policy: ${damage.itemType}`);
    }
    const [item] = unclaimed.splice(index, 1);
    return { item, amount: damage.amount };
  });
}

/**
 * Settles one incident against a policy, consuming the policy's remaining cap.
 */
export function settleClaim(policy: Policy, damages: Damage[]): ClaimResult {
  const desired = matchDamagesToItems(policy, damages).reduce(
    (total, { item, amount }) => total + damagePayout(item, amount),
    0,
  );

  const payout = Math.floor(Math.min(desired, policy.remainingCap));
  policy.remainingCap -= payout;

  return { payout, remainingCap: policy.remainingCap };
}

const DEDUCTIBLE = 100;
const HIGH_ENCHANTMENT_CLAIM_THRESHOLD = 8;
const HIGH_ENCHANTMENT_REIMBURSEMENT = 0.5;

/**
 * Payout for one damage entry, before the policy cap is applied.
 *
 * The high-enchantment clause takes precedence over the dragon-material
 * clause when both apply; the deductible is taken last.
 */
export function damagePayout(item: Item, amount: number): number {
  // Dragon material reimburses in full, which is the default; it only
  // matters that the high-enchantment clause does not also apply.
  const reimbursed =
    (item.enchantment ?? 0) >= HIGH_ENCHANTMENT_CLAIM_THRESHOLD
      ? amount * HIGH_ENCHANTMENT_REIMBURSEMENT
      : amount;

  return Math.max(0, reimbursed - DEDUCTIBLE);
}
