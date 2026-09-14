import type { Policy } from './policy';
import type { Item } from './catalogue';

export type Damage = {
  itemType: string;
  amount: number;
};

export type Incident = {
  cause: string;
  damages: Damage[];
};

export type ClaimResult = {
  payout: number;
  remainingCap: number;
};

const DEDUCTIBLE = 100;
const HALF_REIMBURSEMENT_LEVEL = 8;
const HALF_REIMBURSEMENT = 0.5;

function reimbursement(item: Item, amount: number): number {
  if ((item.enchantment ?? 0) >= HALF_REIMBURSEMENT_LEVEL) {
    return amount * HALF_REIMBURSEMENT;
  }
  return amount;
}

export function claim(policy: Policy, incident: Incident): ClaimResult {
  const uncovered = [...policy.items];
  let desired = 0;

  for (const damage of incident.damages) {
    if (damage.amount < 0) {
      throw new Error(`negative damage amount: ${damage.amount}`);
    }
    const index = uncovered.findIndex((candidate) => candidate.type === damage.itemType);
    if (index === -1) {
      throw new Error(`item not covered by the policy: ${damage.itemType}`);
    }
    const [item] = uncovered.splice(index, 1);
    desired += reimbursement(item, damage.amount) - DEDUCTIBLE;
  }

  const payout = Math.min(Math.floor(desired), policy.remainingCap);
  policy.remainingCap -= payout;
  return { payout, remainingCap: policy.remainingCap };
}
