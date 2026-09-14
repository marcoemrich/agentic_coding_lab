import type { Item } from './premium.js';
import { insuranceValueOf } from './premium.js';

export interface Policy {
  items: Item[];
  remainingCap?: number;
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

const DEDUCTIBLE = 100;
const HALF_REIMBURSEMENT_THRESHOLD = 8;
const CAP_MULTIPLIER = 2;

export function insuranceSumOf(policy: Policy): number {
  return policy.items.reduce((sum, item) => sum + insuranceValueOf(item), 0);
}

export function capOf(policy: Policy): number {
  return insuranceSumOf(policy) * CAP_MULTIPLIER;
}

export function settleClaim(policy: Policy, incident: Incident): ClaimResult {
  const unclaimed = [...policy.items];
  const desired = incident.damages.reduce(
    (sum, damage) => sum + payoutForDamage(unclaimed, damage),
    0,
  );
  const available = policy.remainingCap ?? capOf(policy);
  const payout = Math.floor(Math.min(desired, available));
  return { payout, remainingCap: available - payout };
}

function payoutForDamage(unclaimed: Item[], damage: Damage): number {
  if (damage.amount < 0) {
    throw new Error(`negative damage amount: ${damage.amount}`);
  }
  const index = unclaimed.findIndex((candidate) => candidate.type === damage.itemType);
  if (index === -1) {
    throw new Error(`item not covered by the policy: ${damage.itemType}`);
  }
  const [item] = unclaimed.splice(index, 1);
  const highlyEnchanted = (item.enchantment ?? 0) >= HALF_REIMBURSEMENT_THRESHOLD;
  const reimbursed = highlyEnchanted ? damage.amount / 2 : damage.amount;
  return Math.max(0, reimbursed - DEDUCTIBLE);
}
