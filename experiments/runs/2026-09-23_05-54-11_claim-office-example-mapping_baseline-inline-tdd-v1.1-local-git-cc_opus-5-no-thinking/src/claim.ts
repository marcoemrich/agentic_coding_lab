import { Item } from './premium.js';

export interface Damage {
  itemType: string;
  amount: number;
}

export interface Incident {
  cause: string;
  damages: Damage[];
}

export interface ClaimResult {
  payout: number;
  remainingCap: number;
}

/** A claim that the MHPCO rejects outright. */
export class ClaimError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'ClaimError';
  }
}

const DEDUCTIBLE = 100;
const HIGH_ENCHANTMENT_CLAIM_THRESHOLD = 8;
const HIGH_ENCHANTMENT_REIMBURSEMENT = 0.5;

/**
 * Reimbursable amount for one damaged item, before the deductible.
 *
 * The 50 % high-enchantment clause takes precedence over full reimbursement
 * for dragon material when both apply.
 */
export function reimbursement(item: Item, amount: number): number {
  if ((item.enchantment ?? 0) >= HIGH_ENCHANTMENT_CLAIM_THRESHOLD) {
    return amount * HIGH_ENCHANTMENT_REIMBURSEMENT;
  }
  // Dragon material is reimbursed in full, which is also the standard rate;
  // the clause only matters because it loses to the 50 % rule above.
  return amount;
}

/** Payout for one damage event: reimbursement less the per-event deductible. */
export function damagePayout(item: Item, amount: number): number {
  return Math.max(0, reimbursement(item, amount) - DEDUCTIBLE);
}
