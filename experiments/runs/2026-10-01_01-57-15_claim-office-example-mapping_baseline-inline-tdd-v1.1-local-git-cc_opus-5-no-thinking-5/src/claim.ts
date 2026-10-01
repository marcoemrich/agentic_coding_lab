import { isKnownType, type Item } from './premium.js';

export interface Damage {
  itemType: string;
  amount: number;
}

export interface ClaimRequest {
  items: Item[];
  damages: Damage[];
  remainingCap: number;
}

export interface ClaimResult {
  payout: number;
  remainingCap: number;
}

const DEDUCTIBLE = 100;
const HIGH_ENCHANTMENT_THRESHOLD = 8;
const HIGH_ENCHANTMENT_REIMBURSEMENT = 0.5;

export function processClaim(request: ClaimRequest): ClaimResult {
  const { items, damages, remainingCap } = request;
  const damagedItems = matchDamagesToItems(items, damages);

  let desiredPayout = 0;
  for (const [index, damage] of damages.entries()) {
    desiredPayout += reimbursement(damagedItems[index], damage.amount);
  }

  const payout = Math.floor(Math.min(desiredPayout, remainingCap));
  return { payout, remainingCap: remainingCap - payout };
}

/**
 * Assigns each damage entry to a distinct insured item of the same type, so
 * that a policy covering one sword cannot absorb two sword damages.
 */
function matchDamagesToItems(items: Item[], damages: Damage[]): Item[] {
  const available = [...items];
  return damages.map((damage) => {
    if (damage.amount < 0) {
      throw new Error(`negative damage amount: ${damage.amount}`);
    }
    if (!isKnownType(damage.itemType)) {
      throw new Error(`unknown item type: ${damage.itemType}`);
    }
    const index = available.findIndex((item) => item.type === damage.itemType);
    if (index === -1) {
      throw new Error(`item not covered by the policy: ${damage.itemType}`);
    }
    return available.splice(index, 1)[0];
  });
}

/**
 * Dragon material means full reimbursement, which is what the standard case
 * already does, so only the high-enchantment clause reduces the amount. When
 * both clauses apply the 50 % rule wins.
 */
function reimbursement(item: Item, amount: number): number {
  const covered = (item.enchantment ?? 0) >= HIGH_ENCHANTMENT_THRESHOLD
    ? amount * HIGH_ENCHANTMENT_REIMBURSEMENT
    : amount;
  return Math.max(0, covered - DEDUCTIBLE);
}
