import { type Item } from './premium';

export interface Damage {
  itemType: string;
  amount: number;
}

export interface Incident {
  cause: string;
  damages: Damage[];
}

export interface Policy {
  items: Item[];
  insuranceSum: number;
  remainingCap: number;
}

export interface ClaimResult {
  payout: number;
  remainingCap: number;
}

export class ClaimError extends Error {}

const DEDUCTIBLE = 100;
const HIGH_ENCHANTMENT_THRESHOLD = 8;
const HIGH_ENCHANTMENT_REIMBURSEMENT = 0.5;

/**
 * The high-enchantment clause halves the damage and wins over the
 * dragon-material clause when both apply. Dragon material grants full
 * reimbursement, which is what a damage without any clause gets anyway.
 * The deductible is taken afterwards, once per damage entry.
 */
function reimbursementFor(item: Item, amount: number): number {
  const highlyEnchanted = (item.enchantment ?? 0) >= HIGH_ENCHANTMENT_THRESHOLD;
  const reimbursed = highlyEnchanted ? amount * HIGH_ENCHANTMENT_REIMBURSEMENT : amount;
  return Math.max(0, reimbursed - DEDUCTIBLE);
}

export function settleClaim(policy: Policy, incident: Incident): ClaimResult {
  const available = [...policy.items];

  let desired = 0;
  for (const damage of incident.damages) {
    if (damage.amount < 0) {
      throw new ClaimError(`Negative damage amount for ${damage.itemType}: ${damage.amount}`);
    }
    // Each damage entry consumes one insured item of that type, so a policy
    // can never be claimed for more items than it actually covers.
    const index = available.findIndex((candidate) => candidate.type === damage.itemType);
    if (index === -1) {
      throw new ClaimError(`Damaged item is not covered by the policy: ${damage.itemType}`);
    }
    const [item] = available.splice(index, 1);
    desired += reimbursementFor(item, damage.amount);
  }
  const payout = Math.floor(Math.min(desired, policy.remainingCap));
  return { payout, remainingCap: policy.remainingCap - payout };
}
