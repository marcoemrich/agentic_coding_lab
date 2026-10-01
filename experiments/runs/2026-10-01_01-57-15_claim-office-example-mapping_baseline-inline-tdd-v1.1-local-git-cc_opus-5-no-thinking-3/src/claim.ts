import { type Item } from './premium.js';
import { insuranceSum } from './policy.js';

const DEDUCTIBLE = 100;
const HIGH_ENCHANTMENT_PAYOUT_THRESHOLD = 8;
const HIGH_ENCHANTMENT_PAYOUT_RATE = 0.5;

/**
 * Payout for one damage event, as an exact fraction.
 *
 * Damage to items with enchantment >= 8 is reimbursed at 50 %; dragon material
 * is reimbursed in full. Where both clauses apply the 50 % rule wins. The
 * deductible applies once per damage event, and never turns into a debt.
 */
export function damagePayout(item: Item, amount: number): number {
  const reimbursed =
    (item.enchantment ?? 0) >= HIGH_ENCHANTMENT_PAYOUT_THRESHOLD
      ? amount * HIGH_ENCHANTMENT_PAYOUT_RATE
      : amount;
  return Math.max(0, reimbursed - DEDUCTIBLE);
}

const CAP_FACTOR = 2;

/** Payouts are rounded down — the MHPCO's favour. */
export function roundPayout(amount: number): number {
  return Math.floor(amount);
}

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

/** A policy created by a quote step; it tracks how much of its cap is left. */
export interface Policy {
  items: Item[];
  remainingCap: number;
}

export function createPolicy(items: Item[]): Policy {
  return { items, remainingCap: insuranceSum(items) * CAP_FACTOR };
}

/**
 * Matches each damage entry to a distinct insured item of the same type, so a
 * policy covering one sword cannot absorb two sword damages.
 */
function matchDamagesToItems(policy: Policy, damages: Damage[]): Item[] {
  const available = [...policy.items];
  return damages.map((damage) => {
    const index = available.findIndex((item) => item.type === damage.itemType);
    if (index === -1) {
      throw new Error(`Damaged item is not part of the policy: ${damage.itemType}`);
    }
    return available.splice(index, 1)[0];
  });
}

export function processClaim(policy: Policy, incident: Incident): ClaimResult {
  for (const damage of incident.damages) {
    if (damage.amount < 0) {
      throw new Error(`Damage amount must not be negative: ${damage.amount}`);
    }
  }

  const items = matchDamagesToItems(policy, incident.damages);
  const desired = items.reduce(
    (sum, item, index) => sum + damagePayout(item, incident.damages[index].amount),
    0,
  );

  const payout = roundPayout(Math.min(desired, policy.remainingCap));
  policy.remainingCap -= payout;

  return { payout, remainingCap: policy.remainingCap };
}
