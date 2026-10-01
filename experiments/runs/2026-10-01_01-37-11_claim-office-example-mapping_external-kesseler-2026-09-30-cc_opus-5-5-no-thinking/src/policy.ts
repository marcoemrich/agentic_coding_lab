import { catalogEntry, Item } from './catalog';

export interface Damage {
  itemType: string;
  amount: number;
}

const CAP_FACTOR = 2;
const DEDUCTIBLE = 100;
const HALF_REIMBURSEMENT_ENCHANTMENT_LEVEL = 8;
const HALF_REIMBURSEMENT = 0.5;

function reimbursement(item: Item, amount: number): number {
  return (item.enchantment ?? 0) >= HALF_REIMBURSEMENT_ENCHANTMENT_LEVEL ? amount * HALF_REIMBURSEMENT : amount;
}

function damagePayout(item: Item, amount: number): number {
  if (amount < 0) {
    throw new Error(`Damage amount must not be negative: ${amount}`);
  }
  return Math.max(reimbursement(item, amount) - DEDUCTIBLE, 0);
}

function takeItem(items: Item[], itemType: string): Item {
  const index = items.findIndex((item) => item.type === itemType);
  if (index < 0) {
    throw new Error(`Damaged item is not covered by the policy: ${itemType}`);
  }
  return items.splice(index, 1)[0];
}

export class Policy {
  private remainingCap: number;

  constructor(private readonly items: Item[]) {
    const insuranceSum = items.reduce((sum, item) => sum + catalogEntry(item.type).insuranceValue, 0);
    this.remainingCap = insuranceSum * CAP_FACTOR;
  }

  claim(damages: Damage[]): { payout: number; remainingCap: number } {
    const undamagedItems = [...this.items];
    const desiredPayout = damages.reduce(
      (sum, damage) => sum + damagePayout(takeItem(undamagedItems, damage.itemType), damage.amount),
      0,
    );
    const payout = Math.min(Math.floor(desiredPayout), this.remainingCap);
    this.remainingCap -= payout;
    return { payout, remainingCap: this.remainingCap };
  }
}
