import { INSURANCE_VALUES, type Item } from './quote.js';

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
  remainingCap: number;
}

const DEDUCTIBLE = 100;
const HALF_REIMBURSEMENT_THRESHOLD = 8;
const HALF_REIMBURSEMENT_RATE = 0.5;
const CAP_MULTIPLIER = 2;

export function createPolicy(items: Item[]): Policy {
  const insuranceSum = items.reduce((sum, item) => sum + INSURANCE_VALUES[item.type], 0);
  return { items, remainingCap: insuranceSum * CAP_MULTIPLIER };
}

/**
 * Highly enchanted items are reimbursed at 50 %. Dragon material is fully
 * reimbursed, but when both clauses apply the 50 % rule wins.
 */
function reimbursableAmount(item: Item, amount: number): number {
  if ((item.enchantment ?? 0) >= HALF_REIMBURSEMENT_THRESHOLD) {
    return amount * HALF_REIMBURSEMENT_RATE;
  }
  return amount;
}

/**
 * Matches each damage to a distinct insured item, so that a policy covering
 * one sword cannot absorb two sword damages. Throws if the incident cannot
 * be satisfied — the whole claim is rejected before any cap is drawn down.
 */
function matchDamagesToItems(policy: Policy, incident: Incident): Item[] {
  const available = [...policy.items];

  return incident.damages.map((damage) => {
    if (damage.amount < 0) {
      throw new Error(`damage amount must not be negative: ${damage.amount}`);
    }
    const index = available.findIndex((item) => item.type === damage.itemType);
    if (index === -1) {
      throw new Error(`damaged item is not covered by the policy: ${damage.itemType}`);
    }
    return available.splice(index, 1)[0];
  });
}

export function claim(policy: Policy, incident: Incident): ClaimResult {
  const damagedItems = matchDamagesToItems(policy, incident);

  let payout = 0;
  incident.damages.forEach((damage, index) => {
    const reimbursable = reimbursableAmount(damagedItems[index], damage.amount);
    payout += Math.max(0, reimbursable - DEDUCTIBLE);
  });
  // The policy pays out at most its remaining cap.
  const granted = Math.floor(Math.min(payout, policy.remainingCap));
  policy.remainingCap -= granted;

  return { payout: granted, remainingCap: policy.remainingCap };
}
