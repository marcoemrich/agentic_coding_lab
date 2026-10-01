import { Item } from './premium.js';

const DEDUCTIBLE = 100;
const HIGH_ENCHANTMENT_RATE = 0.5;
const HIGH_ENCHANTMENT_THRESHOLD = 8;

/**
 * Payout for the damage to one item, before the policy cap is applied.
 * Dragon material means full reimbursement, which is also the default for
 * ordinary items, so it needs no separate branch; where both clauses apply the
 * 50 % high-enchantment rule wins. The deductible applies once per damage.
 */
export function damagePayout(item: Item, amount: number): number {
  const reimbursed =
    (item.enchantment ?? 0) >= HIGH_ENCHANTMENT_THRESHOLD
      ? amount * HIGH_ENCHANTMENT_RATE
      : amount;
  return Math.max(0, reimbursed - DEDUCTIBLE);
}
