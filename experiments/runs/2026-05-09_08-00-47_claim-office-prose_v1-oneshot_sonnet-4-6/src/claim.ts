import type { Policy, Damage } from './types.js';

const DEDUCTIBLE = 100;

function reimbursementRate(policy: Policy, damage: Damage): number {
  const item = policy.items.find((i) => i.type === damage.itemType);
  if (!item) return 0;

  // Dragon material: fully reimbursed
  if (item.material === 'dragon') return 1.0;

  // High enchantment (>= 8): 50% reimbursement
  if (item.enchantment >= 8) return 0.5;

  // Default: full reimbursement
  return 1.0;
}

export function processClaim(
  policy: Policy,
  damages: Damage[],
): { payout: number; remainingCap: number } {
  let totalReimbursable = 0;
  for (const damage of damages) {
    totalReimbursable += damage.amount * reimbursementRate(policy, damage);
  }

  // Subtract deductible; payout cannot be negative
  const afterDeductible = Math.max(0, totalReimbursable - DEDUCTIBLE);

  // Cap at remaining policy cap; round down (MHPCO's favor)
  const payout = Math.floor(Math.min(afterDeductible, policy.remainingCap));

  const remainingCap = policy.remainingCap - payout;

  return { payout, remainingCap };
}
