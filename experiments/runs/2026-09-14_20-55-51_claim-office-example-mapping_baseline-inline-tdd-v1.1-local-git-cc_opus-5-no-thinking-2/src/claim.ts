import { lookup } from './catalog.js';
import type { Item } from './premium.js';

const DEDUCTIBLE = 100;
const CAP_FACTOR = 2;
const HALF_REIMBURSEMENT_LEVEL = 8;
const HALF_REIMBURSEMENT = 0.5;
const DRAGON_MATERIAL = 'dragon';

/** Payouts are rounded down: fractions stay with the MHPCO. */
export function roundPayout(amount: number): number {
  return Math.floor(amount);
}

/** Insurance sum of a policy: the unmodified catalog values of its items. */
export function insuranceSum(items: Item[]): number {
  return items.reduce((sum, item) => sum + lookup(item.type).insuranceValue, 0);
}

export function policyCap(items: Item[]): number {
  return insuranceSum(items) * CAP_FACTOR;
}

/**
 * Payout for a single damage entry, before the policy cap is applied.
 * The high-enchantment clause takes precedence over dragon material; the
 * deductible is applied once per damaged item, after any reduction.
 */
export function settleDamage(item: Item, amount: number): number {
  return roundPayout(Math.max(0, reimbursableAmount(item, amount) - DEDUCTIBLE));
}

/**
 * The share of a damage the MHPCO reimburses, before the deductible.
 * Highly enchanted items are halved; every other item — dragon material
 * included — is reimbursed in full, so dragon material only matters as an
 * exception to a reduction the office would otherwise have applied.
 */
function reimbursableAmount(item: Item, amount: number): number {
  if ((item.enchantment ?? 0) >= HALF_REIMBURSEMENT_LEVEL) return amount * HALF_REIMBURSEMENT;
  return amount;
}
