import { Item } from './premium.js';

export class ClaimError extends Error {}

export interface Damage {
  itemType: string;
  amount: number;
}

export interface Incident {
  cause: string;
  damages: Damage[];
}

export interface Settlement {
  payout: number;
  remainingCap: number;
}

const DEDUCTIBLE = 100;
const REDUCED_REIMBURSEMENT = 0.5;
const REDUCED_REIMBURSEMENT_THRESHOLD = 8;

/**
 * A highly enchanted item is reimbursed at half the damage; everything
 * else — dragon material included — is reimbursed in full. The
 * deductible applies once per damage event, and never turns a damage
 * into a negative payout.
 */
function reimbursement(item: Item, amount: number): number {
  const enchantment = item.enchantment ?? 0;
  const reimbursed =
    enchantment >= REDUCED_REIMBURSEMENT_THRESHOLD ? amount * REDUCED_REIMBURSEMENT : amount;
  return Math.max(0, reimbursed - DEDUCTIBLE);
}

/**
 * Each damage entry claims one covered item of its type, so a policy
 * covering one sword cannot absorb two sword damages.
 */
function takeCoveredItem(uncovered: Item[], itemType: string): Item {
  const index = uncovered.findIndex((candidate) => candidate.type === itemType);
  if (index === -1) {
    throw new ClaimError(`damaged item "${itemType}" is not covered by the policy`);
  }
  return uncovered.splice(index, 1)[0];
}

export function settleClaim(
  items: Item[],
  incident: Incident,
  remainingCap: number,
): Settlement {
  const unclaimed = [...items];
  const desired = incident.damages.reduce((sum, damage) => {
    if (damage.amount < 0) {
      throw new ClaimError(`damage amount for "${damage.itemType}" must not be negative`);
    }
    const item = takeCoveredItem(unclaimed, damage.itemType);
    return sum + reimbursement(item, damage.amount);
  }, 0);
  const payout = Math.floor(Math.min(desired, remainingCap));
  return { payout, remainingCap: remainingCap - payout };
}
