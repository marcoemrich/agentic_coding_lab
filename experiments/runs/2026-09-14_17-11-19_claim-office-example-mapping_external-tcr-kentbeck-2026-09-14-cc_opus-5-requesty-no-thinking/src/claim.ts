import { Item } from './policy.js';

export interface Damage {
  itemType: string;
  amount: number;
}

export interface Incident {
  cause: string;
  damages: Damage[];
}

const DEDUCTIBLE = 100;
const HIGH_ENCHANTMENT_CLAIM_THRESHOLD = 8;
const HIGH_ENCHANTMENT_REIMBURSEMENT = 0.5;

export class ClaimError extends Error {}

/**
 * Dragon material is reimbursed in full, which is also the default; the
 * high-enchantment clause wins wherever both would apply.
 */
function reimbursement(item: Item, amount: number): number {
  if ((item.enchantment ?? 0) >= HIGH_ENCHANTMENT_CLAIM_THRESHOLD) {
    return amount * HIGH_ENCHANTMENT_REIMBURSEMENT;
  }
  return amount;
}

/** Payout for a single damage entry, before the policy cap is applied. */
export function damagePayout(item: Item, amount: number): number {
  if (amount < 0) throw new ClaimError(`negative damage amount: ${amount}`);
  return Math.max(0, reimbursement(item, amount) - DEDUCTIBLE);
}
