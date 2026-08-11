import { lookUp } from './priceList.js';
import { ClaimOfficeError, type Incident, type Item } from './types.js';

export interface Policy {
  items: Item[];
  insuranceSum: number;
  /** Payout budget left on this policy; starts at twice the insurance sum. */
  remainingCap: number;
}

export interface ClaimResult {
  payout: number;
  remainingCap: number;
}

const DEDUCTIBLE = 100;
const CAP_FACTOR = 2;
const HALF_REIMBURSEMENT_LEVEL = 8;
const HALF_REIMBURSEMENT_RATE = 0.5;

export function createPolicy(items: Item[], insuranceSum: number): Policy {
  return { items, insuranceSum, remainingCap: insuranceSum * CAP_FACTOR };
}

/**
 * Reimbursement for a single damage before the deductible. Highly enchanted
 * items are reimbursed at half; everything else — including dragon material,
 * which the price list singles out as fully reimbursed — at the full amount.
 */
function reimbursement(item: Item, amount: number): number {
  const halved = (item.enchantment ?? 0) >= HALF_REIMBURSEMENT_LEVEL;
  return halved ? amount * HALF_REIMBURSEMENT_RATE : amount;
}

/**
 * Matches each damage to a distinct insured item of the same type, so a
 * policy covering one sword cannot absorb two sword damages.
 */
function matchDamagedItems(policy: Policy, incident: Incident): Item[] {
  const available = [...policy.items];

  return incident.damages.map((damage) => {
    lookUp(damage.itemType);
    if (damage.amount < 0) {
      throw new ClaimOfficeError(`negative damage amount for ${damage.itemType}`);
    }
    const index = available.findIndex((item) => item.type === damage.itemType);
    if (index === -1) {
      throw new ClaimOfficeError(`item not covered by the policy: ${damage.itemType}`);
    }
    return available.splice(index, 1)[0];
  });
}

export function settleClaim(policy: Policy, incident: Incident): ClaimResult {
  const damagedItems = matchDamagedItems(policy, incident);

  const desired = incident.damages.reduce((sum, damage, index) => {
    const covered = reimbursement(damagedItems[index], damage.amount);
    // The deductible applies once per damage event, never below zero.
    return sum + Math.max(0, covered - DEDUCTIBLE);
  }, 0);

  // Rounding in the MHPCO's favour: payouts go down.
  const payout = Math.min(Math.floor(desired), policy.remainingCap);
  policy.remainingCap -= payout;

  return { payout, remainingCap: policy.remainingCap };
}
