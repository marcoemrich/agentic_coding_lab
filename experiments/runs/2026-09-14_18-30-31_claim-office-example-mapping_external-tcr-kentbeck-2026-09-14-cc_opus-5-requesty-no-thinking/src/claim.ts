import { Item } from './premium.js';
import { lookupItem } from './catalog.js';

export interface Damage {
  itemType: string;
  amount: number;
}

export class ClaimError extends Error {}

const DEDUCTIBLE = 100;
const HALF_REIMBURSEMENT_THRESHOLD = 8;
const HALF_REIMBURSEMENT_RATE = 0.5;
const CAP_MULTIPLIER = 2;

export function insuranceSum(items: Item[]): number {
  return items.reduce((sum, item) => sum + lookupItem(item.type)!.value, 0);
}

export function damagePayout(item: Item, amount: number): number {
  let reimbursed = amount;
  if ((item.enchantment ?? 0) >= HALF_REIMBURSEMENT_THRESHOLD) {
    reimbursed = amount * HALF_REIMBURSEMENT_RATE;
  }
  return Math.max(0, reimbursed - DEDUCTIBLE);
}

export interface ClaimResult {
  payout: number;
  remainingCap: number;
}

export class Policy {
  private remaining: number;

  constructor(private readonly items: Item[]) {
    this.remaining = insuranceSum(items) * CAP_MULTIPLIER;
  }

  claim(damages: Damage[]): ClaimResult {
    const available = [...this.items];
    let desired = 0;
    for (const damage of damages) {
      if (damage.amount < 0) {
        throw new ClaimError(`Negative damage amount: ${damage.amount}`);
      }
      const index = available.findIndex((item) => item.type === damage.itemType);
      if (index === -1) {
        throw new ClaimError(`Damaged item not covered by policy: ${damage.itemType}`);
      }
      const [item] = available.splice(index, 1);
      desired += damagePayout(item, damage.amount);
    }
    const payout = Math.floor(Math.min(desired, this.remaining));
    this.remaining -= payout;
    return { payout, remainingCap: this.remaining };
  }
}

