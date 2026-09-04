import { type Item, insuranceSum } from './premium.js';

/** Applies once per damaged item, not once per incident. */
const DEDUCTIBLE = 100;

/** The total payout per policy is capped at twice the insurance sum. */
const CAP_MULTIPLIER = 2;

const HIGH_ENCHANTMENT_CLAIM_THRESHOLD = 8;
const HIGH_ENCHANTMENT_REIMBURSEMENT = 0.5;

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
  remainingCap: number;
}

export interface ClaimResult {
  payout: number;
  remainingCap: number;
}

export function createPolicy(items: Item[]): Policy {
  return { items, remainingCap: insuranceSum(items) * CAP_MULTIPLIER };
}

/**
 * The reimbursable share of a damage amount before the deductible.
 * Highly enchanted items pay out at 50 %; everything else — including
 * dragon material, which is explicitly reimbursed in full — pays out at
 * 100 %. The enchantment clause wins when both would apply.
 */
function reimbursableShare(item: Item): number {
  const highlyEnchanted = (item.enchantment ?? 0) >= HIGH_ENCHANTMENT_CLAIM_THRESHOLD;
  return highlyEnchanted ? HIGH_ENCHANTMENT_REIMBURSEMENT : 1;
}

export function settleClaim(policy: Policy, incident: Incident): ClaimResult {
  // Each damage entry must match a distinct insured item, so a policy
  // covering one sword cannot absorb two sword damages.
  const available = [...policy.items];
  let desired = 0;

  for (const damage of incident.damages) {
    if (damage.amount < 0) {
      throw new Error(`damage amount must not be negative: ${damage.amount}`);
    }

    const index = available.findIndex((candidate) => candidate.type === damage.itemType);
    if (index === -1) {
      throw new Error(`item not covered by this policy: ${damage.itemType}`);
    }
    const [item] = available.splice(index, 1);

    desired += Math.max(0, damage.amount * reimbursableShare(item) - DEDUCTIBLE);
  }

  const payout = Math.floor(Math.min(desired, policy.remainingCap));
  policy.remainingCap -= payout;
  return { payout, remainingCap: policy.remainingCap };
}
