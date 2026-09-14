import { insuranceSum, type Item } from './premium';

export const DEDUCTIBLE = 100;
export const CAP_FACTOR = 2;
export const HALF_REIMBURSEMENT_LEVEL = 8;
export const HALF_REIMBURSEMENT_RATE = 0.5;

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

export function createPolicy(items: Item[]): Policy {
  return { items, remainingCap: insuranceSum(items) * CAP_FACTOR };
}

function reimbursement(item: Item, amount: number): number {
  if ((item.enchantment ?? 0) >= HALF_REIMBURSEMENT_LEVEL) {
    return amount * HALF_REIMBURSEMENT_RATE;
  }
  return amount;
}

function matchDamagesToItems(policy: Policy, damages: Damage[]): Item[] {
  const available = [...policy.items];
  return damages.map((damage) => {
    if (damage.amount < 0) {
      throw new Error(`negative damage amount for ${damage.itemType}`);
    }
    const index = available.findIndex((item) => item.type === damage.itemType);
    if (index === -1) {
      throw new Error(`item not covered by policy: ${damage.itemType}`);
    }
    return available.splice(index, 1)[0];
  });
}

export interface ClaimResult {
  payout: number;
  remainingCap: number;
}

export function processClaim(policy: Policy, incident: Incident): ClaimResult {
  const items = matchDamagesToItems(policy, incident.damages);
  let desired = 0;
  incident.damages.forEach((damage, index) => {
    const gross = reimbursement(items[index], damage.amount);
    desired += Math.max(0, gross - DEDUCTIBLE);
  });
  const payout = Math.floor(Math.min(desired, policy.remainingCap));
  policy.remainingCap -= payout;
  return { payout, remainingCap: policy.remainingCap };
}
