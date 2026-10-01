import { catalogEntry } from './catalog';
import { percentOf } from './percent';
import { Item } from './premium';

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
const HIGH_ENCHANTMENT_CLAUSE_LEVEL = 8;
const HIGH_ENCHANTMENT_REIMBURSEMENT_PERCENT = 50;

export class Policy {
  private remainingCap: number;

  constructor(private readonly items: Item[]) {
    const insuranceSum = items.reduce((sum, item) => sum + catalogEntry(item.type).insuranceValue, 0);
    this.remainingCap = insuranceSum * CAP_FACTOR;
  }

  claim(damages: Damage[]): ClaimResult {
    const unmatched = [...this.items];
    const desired = damages.reduce((sum, damage) => {
      requireNonNegative(damage);
      const item = takeMatchingItem(unmatched, damage);
      return sum + Math.max(0, reimbursement(item, damage) - DEDUCTIBLE);
    }, 0);
    const payout = Math.floor(Math.min(desired, this.remainingCap));
    this.remainingCap -= payout;
    return { payout, remainingCap: this.remainingCap };
  }
}

function requireNonNegative(damage: Damage): void {
  if (damage.amount < 0) {
    throw new Error(`Damage amount must not be negative: ${damage.amount}`);
  }
}

function takeMatchingItem(unmatched: Item[], damage: Damage): Item {
  const index = unmatched.findIndex((candidate) => candidate.type === damage.itemType);
  if (index === -1) {
    throw new Error(`Damaged item is not covered by the policy: ${damage.itemType}`);
  }
  return unmatched.splice(index, 1)[0];
}

function reimbursement(item: Item, damage: Damage): number {
  if ((item.enchantment ?? 0) >= HIGH_ENCHANTMENT_CLAUSE_LEVEL) {
    return percentOf(damage.amount, HIGH_ENCHANTMENT_REIMBURSEMENT_PERCENT);
  }
  return damage.amount;
}
