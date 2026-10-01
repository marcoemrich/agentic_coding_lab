import { insuranceValueOf, type Item } from './premium.js';

const DEDUCTIBLE = 100;
const CAP_FACTOR = 2;
const HALVING_ENCHANTMENT_LEVEL = 8;
const HALVING_RATE = 0.5;

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

/** A policy holds the insured items and tracks how much of its cap is left. */
export interface Policy {
  items: Item[];
  remainingCap: number;
}

export class ClaimRejectedError extends Error {}

export function openPolicy(items: Item[]): Policy {
  const insuranceSum = items.reduce((sum, item) => sum + insuranceValueOf(item), 0);
  return { items, remainingCap: insuranceSum * CAP_FACTOR };
}

/**
 * Highly enchanted items are reimbursed at half the damage; dragon material is
 * reimbursed in full, which is also the default. Where both clauses apply, the
 * halving wins. The deductible comes off afterwards.
 */
function payoutFor(item: Item, amount: number): number {
  const reimbursable =
    (item.enchantment ?? 0) >= HALVING_ENCHANTMENT_LEVEL ? amount * HALVING_RATE : amount;
  return Math.max(0, reimbursable - DEDUCTIBLE);
}

/** Rounds down: whole G, in the MHPCO's favour. */
function roundPayout(amount: number): number {
  return Math.floor(amount);
}

/**
 * Matches every damage to a distinct insured item, so two damages of the same
 * type require two insured items of that type. Rejects the whole claim when a
 * damage cannot be matched or its amount is negative.
 */
function matchDamages(policy: Policy, damages: Damage[]): Item[] {
  const unclaimed = [...policy.items];
  return damages.map((damage) => {
    if (damage.amount < 0) {
      throw new ClaimRejectedError(`negative damage amount: ${damage.amount}`);
    }
    const index = unclaimed.findIndex((item) => item.type === damage.itemType);
    if (index === -1) {
      throw new ClaimRejectedError(`not insured under this policy: ${damage.itemType}`);
    }
    return unclaimed.splice(index, 1)[0];
  });
}

export function processClaim(policy: Policy, incident: Incident): ClaimResult {
  const damagedItems = matchDamages(policy, incident.damages);
  const desired = incident.damages.reduce(
    (sum, damage, index) => sum + payoutFor(damagedItems[index], damage.amount),
    0,
  );
  const payout = roundPayout(Math.min(desired, policy.remainingCap));
  policy.remainingCap -= payout;
  return { payout, remainingCap: policy.remainingCap };
}
