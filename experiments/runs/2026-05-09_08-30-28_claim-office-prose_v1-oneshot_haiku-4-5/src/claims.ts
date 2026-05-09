import { Item, ItemType, Policy } from './types.js';

const DEDUCTIBLE = 100;

export function processClaimForPolicy(
  policy: Policy,
  damages: Array<{ itemType: ItemType; amount: number }>
): { payout: number; remainingCap: number } {
  // Find items of each type in the policy
  const itemsByType: Record<ItemType, Item | undefined> = {} as Record<ItemType, Item | undefined>;
  for (const item of policy.items) {
    if (!itemsByType[item.type]) {
      itemsByType[item.type] = item;
    }
  }

  let totalPayout = 0;

  for (const damage of damages) {
    const item = itemsByType[damage.itemType];
    if (!item) {
      // Item not found in policy, no payout
      continue;
    }

    let damageReimbursement = damage.amount;

    // Special damage rules
    if (item.material === 'dragon') {
      // Dragon material: 100% reimbursement
      damageReimbursement = damage.amount;
    } else if (item.enchantment >= 8) {
      // High enchantment: 50% reimbursement
      damageReimbursement = Math.ceil(damage.amount * 0.5);
    } else {
      // Regular damage: full amount (before deductible)
      damageReimbursement = damage.amount;
    }

    // Apply deductible per damage event
    const payout = Math.max(0, damageReimbursement - DEDUCTIBLE);
    totalPayout += payout;
  }

  // Cap at twice the insurance sum
  const maxPayout = policy.totalPayoutCap - policy.usedPayout;
  const actualPayout = Math.min(totalPayout, maxPayout);

  const remainingCap = policy.totalPayoutCap - policy.usedPayout - actualPayout;

  return {
    payout: actualPayout,
    remainingCap: remainingCap,
  };
}
