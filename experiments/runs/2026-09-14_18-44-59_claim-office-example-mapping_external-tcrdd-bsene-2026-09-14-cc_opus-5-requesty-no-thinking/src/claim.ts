import type { Item } from './quote';

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
const HIGH_ENCHANTMENT = 8;
const HIGH_ENCHANTMENT_SHARE = 0.5;

/**
 * Share of the damage the MHPCO reimburses. The 50 % high-enchantment clause
 * takes precedence; the dragon-material clause reimburses in full, which is
 * also what every item without a special clause gets.
 */
function reimbursementShare(item: Item): number {
  if (item.enchantment !== undefined && item.enchantment >= HIGH_ENCHANTMENT) {
    return HIGH_ENCHANTMENT_SHARE;
  }
  return 1;
}

export function settleClaim(policy: Policy, damages: Damage[]): ClaimResult {
  let payout = 0;
  const unclaimed = [...policy.items];
  for (const damage of damages) {
    if (damage.amount < 0) {
      throw new Error(`negative damage amount: ${damage.amount}`);
    }
    const index = unclaimed.findIndex((candidate) => candidate.type === damage.itemType);
    if (index === -1) {
      const insured = policy.items.filter((item) => item.type === damage.itemType).length;
      throw new Error(
        insured === 0
          ? `item not covered by the policy: ${damage.itemType}`
          : `more damages of type ${damage.itemType} than the policy covers (${insured})`,
      );
    }
    const [item] = unclaimed.splice(index, 1);
    payout += damage.amount * reimbursementShare(item) - DEDUCTIBLE;
  }
  payout = Math.min(Math.floor(payout), policy.remainingCap);
  return { payout, remainingCap: policy.remainingCap - payout };
}
