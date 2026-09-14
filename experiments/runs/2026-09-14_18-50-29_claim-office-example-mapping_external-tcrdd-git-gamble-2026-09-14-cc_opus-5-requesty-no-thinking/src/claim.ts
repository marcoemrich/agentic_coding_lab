import type { Item } from './premium';

export interface Policy {
  items: Item[];
  remainingCap: number;
}

export interface Damage {
  itemType: string;
  amount: number;
}

export interface ClaimResult {
  payout: number;
  remainingCap: number;
}

const DEDUCTIBLE = 100;
const HALF_REIMBURSEMENT_THRESHOLD = 8;
const HALF_REIMBURSEMENT_RATE = 0.5;

export function settleClaim(policy: Policy, damages: Damage[]): ClaimResult {
  const available = [...policy.items];
  let payout = 0;
  for (const damage of damages) {
    if (damage.amount < 0) {
      throw new Error(`damage amount must not be negative: ${damage.amount}`);
    }
    const index = available.findIndex((candidate) => candidate.type === damage.itemType);
    if (index === -1) {
      throw new Error(`damaged item is not covered by the policy: ${damage.itemType}`);
    }
    const [item] = available.splice(index, 1);
    let reimbursed = damage.amount;
    if ((item.enchantment ?? 0) >= HALF_REIMBURSEMENT_THRESHOLD) {
      reimbursed *= HALF_REIMBURSEMENT_RATE;
    }
    payout += Math.max(0, reimbursed - DEDUCTIBLE);
  }
  payout = Math.floor(Math.min(payout, policy.remainingCap));
  return { payout, remainingCap: policy.remainingCap - payout };
}
