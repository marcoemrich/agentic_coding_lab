import type { Item } from './quote.js';

export interface Policy {
  items: Item[];
  remainingCap?: number;
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
const CAP_FACTOR = 2;
const HALF_REIMBURSEMENT_LEVEL = 8;
const HALF_REIMBURSEMENT = 0.5;

const INSURANCE_VALUES: Record<string, number> = {
  sword: 1000,
  amulet: 600,
  staff: 800,
  potion: 400,
  rune: 250,
  moonstone: 250,
};

function reimbursementFor(item: Item, amount: number): number {
  const reduced =
    item.enchantment !== undefined && item.enchantment >= HALF_REIMBURSEMENT_LEVEL
      ? amount * HALF_REIMBURSEMENT
      : amount;
  return Math.max(reduced - DEDUCTIBLE, 0);
}

function capOf(policy: Policy): number {
  const insuranceSum = policy.items.reduce((sum, item) => sum + INSURANCE_VALUES[item.type], 0);
  return insuranceSum * CAP_FACTOR;
}

/**
 * Matches each damage to a distinct insured item, so a policy covering one sword
 * cannot absorb two sword damages.
 */
function takeInsuredItem(unclaimed: Item[], itemType: string): Item {
  const index = unclaimed.findIndex((candidate) => candidate.type === itemType);
  if (index === -1) {
    throw new Error(`item not covered by the policy: ${itemType}`);
  }
  return unclaimed.splice(index, 1)[0];
}

export function settleClaim(policy: Policy, damages: Damage[]): ClaimResult {
  const unclaimed = [...policy.items];
  let payout = 0;
  for (const damage of damages) {
    if (damage.amount < 0) {
      throw new Error(`negative damage amount: ${damage.amount}`);
    }
    payout += reimbursementFor(takeInsuredItem(unclaimed, damage.itemType), damage.amount);
  }

  policy.remainingCap ??= capOf(policy);
  const capped = Math.min(Math.floor(payout), policy.remainingCap);
  policy.remainingCap -= capped;
  return { payout: capped, remainingCap: policy.remainingCap };
}
