import { Item, insuranceSum, isKnownType } from './pricing.js';

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

export interface Policy {
  items: Item[];
  insuranceSum: number;
  /** Total payout cap: twice the insurance sum, based on unmodified values. */
  cap: number;
  /** Cap left after the claims settled so far; mutated as claims are settled. */
  remainingCap: number;
}

const DEDUCTIBLE = 100;
const CAP_FACTOR = 2;
const HALF_REIMBURSEMENT_THRESHOLD = 8;
const HALF_REIMBURSEMENT_RATE = 0.5;

/** Rounds in the MHPCO's favour: payouts always go down. */
export function roundPayout(amount: number): number {
  return Math.floor(amount);
}

export function openPolicy(items: Item[]): Policy {
  const sum = insuranceSum(items);
  return { items, insuranceSum: sum, cap: sum * CAP_FACTOR, remainingCap: sum * CAP_FACTOR };
}

/**
 * Reimbursement for one damage before the deductible. Highly enchanted items
 * are reimbursed at half the damage; that clause wins over dragon material.
 * Everything else - dragon material included - is reimbursed in full, which
 * is also the default, so the dragon clause needs no branch of its own.
 */
function reimbursement(item: Item, amount: number): number {
  if ((item.enchantment ?? 0) >= HALF_REIMBURSEMENT_THRESHOLD) {
    return amount * HALF_REIMBURSEMENT_RATE;
  }
  return amount;
}

/**
 * Matches each damage to a distinct insured item of the same type: a policy
 * covering one sword cannot absorb two sword damages.
 */
function matchDamages(policy: Policy, damages: Damage[]): { item: Item; damage: Damage }[] {
  const available = [...policy.items];

  return damages.map((damage) => {
    if (!isKnownType(damage.itemType)) {
      throw new Error(`Unknown item type: ${damage.itemType}`);
    }
    if (damage.amount < 0) {
      throw new Error(`Negative damage amount: ${damage.amount}`);
    }

    const index = available.findIndex((item) => item.type === damage.itemType);
    if (index === -1) {
      throw new Error(`Damaged item is not covered by the policy: ${damage.itemType}`);
    }

    const [item] = available.splice(index, 1);
    return { item, damage };
  });
}

export function settleClaim(policy: Policy, incident: Incident): ClaimResult {
  const matched = matchDamages(policy, incident.damages);

  const desired = matched.reduce((total, { item, damage }) => {
    const afterDeductible = reimbursement(item, damage.amount) - DEDUCTIBLE;
    return total + Math.max(0, afterDeductible);
  }, 0);

  const payout = roundPayout(Math.min(desired, policy.remainingCap));
  policy.remainingCap -= payout;

  return { payout, remainingCap: policy.remainingCap };
}
