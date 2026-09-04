import type { Item } from './quote.js';

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

const DEDUCTIBLE = 100;
const HIGH_ENCHANTMENT_PAYOUT_THRESHOLD = 8;
const HIGH_ENCHANTMENT_PAYOUT_RATE = 0.5;

/** Payouts are rounded down, in the MHPCO's favour. */
function roundPayout(amount: number): number {
  return Math.floor(amount);
}

/**
 * Reimbursement for one damaged item: the high-enchantment clause halves the
 * damage and wins over the dragon-material clause; the deductible applies last.
 */
function reimbursement(item: Item, amount: number): number {
  const reimbursed =
    (item.enchantment ?? 0) >= HIGH_ENCHANTMENT_PAYOUT_THRESHOLD
      ? amount * HIGH_ENCHANTMENT_PAYOUT_RATE
      : amount;
  return Math.max(0, reimbursed - DEDUCTIBLE);
}

/**
 * Matches each damage to a distinct insured item of the same type, so a policy
 * covering one sword cannot absorb two sword damages.
 */
function matchDamagesToItems(items: Item[], damages: Damage[]): Item[] {
  const available = [...items];
  return damages.map((damage) => {
    const index = available.findIndex((item) => item.type === damage.itemType);
    if (index === -1) {
      throw new Error(`damaged item is not covered by the policy: ${damage.itemType}`);
    }
    return available.splice(index, 1)[0];
  });
}

export function claim(items: Item[], incident: Incident, remainingCap: number): ClaimResult {
  for (const damage of incident.damages) {
    if (damage.amount < 0) {
      throw new Error(`damage amount must not be negative: ${damage.amount}`);
    }
  }
  const matched = matchDamagesToItems(items, incident.damages);

  let desired = 0;
  for (const [index, damage] of incident.damages.entries()) {
    desired += reimbursement(matched[index], damage.amount);
  }

  const payout = roundPayout(Math.min(desired, remainingCap));
  return { payout, remainingCap: remainingCap - payout };
}
