import type { Item } from './quote.js';
import type { Policy } from './policy.js';

export interface Damage {
  itemType: string;
  amount: number;
}

export interface ClaimResult {
  payout: number;
  remainingCap: number;
}

const DEDUCTIBLE = 100;
const REDUCED_REIMBURSEMENT_LEVEL = 8;
const REDUCED_REIMBURSEMENT_RATE = 0.5;

const FULL_REIMBURSEMENT = 1;

// The high-enchantment clause wins over the dragon-material clause; every
// other item is reimbursed in full, which is also what dragon material grants.
function reimbursementRate(item: Item): number {
  if ((item.enchantment ?? 0) >= REDUCED_REIMBURSEMENT_LEVEL) return REDUCED_REIMBURSEMENT_RATE;
  return FULL_REIMBURSEMENT;
}

function payoutFor(item: Item, damage: Damage): number {
  return Math.max(0, damage.amount * reimbursementRate(item) - DEDUCTIBLE);
}

export function claim(policy: Policy, damages: Damage[]): ClaimResult {
  const available = [...policy.items];
  let payout = 0;

  for (const damage of damages) {
    if (damage.amount < 0) {
      throw new Error(`Damage amount for ${damage.itemType} must not be negative`);
    }

    const index = available.findIndex((item) => item.type === damage.itemType);
    if (index === -1) {
      throw new Error(`${damage.itemType} is not insured under this policy`);
    }

    const [item] = available.splice(index, 1);
    payout += payoutFor(item, damage);
  }

  // Rounded down in the MHPCO's favour; the cap is drawn down by what was
  // actually paid out, so both figures stay whole.
  const granted = Math.floor(Math.min(payout, policy.remainingCap));
  policy.remainingCap -= granted;

  return { payout: granted, remainingCap: policy.remainingCap };
}
