import { ClaimOfficeError, type Damage, type Item } from './types.js';
import { lookUp } from './priceList.js';

const DEDUCTIBLE = 100;
const CAP_FACTOR = 2;
const HIGH_ENCHANTMENT_THRESHOLD = 8;
const HIGH_ENCHANTMENT_REIMBURSEMENT = 0.5;
const DRAGON_MATERIAL = 'dragon';

export interface Policy {
  items: Item[];
  insuranceSum: number;
  remainingCap: number;
}

export interface ClaimResult {
  payout: number;
  remainingCap: number;
}

export function openPolicy(items: Item[]): Policy {
  const insuranceSum = items.reduce((sum, item) => sum + lookUp(item.type).insuranceValue, 0);
  return { items, insuranceSum, remainingCap: insuranceSum * CAP_FACTOR };
}

/**
 * Matches each damage to a distinct insured item of the same type, so that a
 * policy covering one sword cannot absorb two sword damages.
 */
function matchDamagesToItems(policy: Policy, damages: Damage[]): Item[] {
  const available = [...policy.items];
  return damages.map((damage) => {
    if (damage.amount < 0) {
      throw new ClaimOfficeError(`damage amount must not be negative: ${damage.amount}`);
    }
    const index = available.findIndex((item) => item.type === damage.itemType);
    if (index === -1) {
      throw new ClaimOfficeError(`item is not covered by this policy: ${damage.itemType}`);
    }
    return available.splice(index, 1)[0];
  });
}

/** The share of the damage the MHPCO reimburses, before the deductible. */
function reimbursementRate(item: Item): number {
  if ((item.enchantment ?? 0) >= HIGH_ENCHANTMENT_THRESHOLD) {
    // The 50 % rule wins even for dragon material.
    return HIGH_ENCHANTMENT_REIMBURSEMENT;
  }
  return 1;
}

/**
 * Settles one damage event against the policy and consumes its cap. Throws
 * without touching the policy if any damage entry is not covered.
 */
export function settleClaim(policy: Policy, damages: Damage[]): ClaimResult {
  const damagedItems = matchDamagesToItems(policy, damages);

  const desired = damages.reduce((total, damage, index) => {
    const reimbursed = damage.amount * reimbursementRate(damagedItems[index]);
    // The deductible applies once per damaged item and never turns negative.
    return total + Math.max(0, reimbursed - DEDUCTIBLE);
  }, 0);

  const payout = Math.floor(Math.min(desired, policy.remainingCap));
  policy.remainingCap -= payout;

  return { payout, remainingCap: policy.remainingCap };
}
