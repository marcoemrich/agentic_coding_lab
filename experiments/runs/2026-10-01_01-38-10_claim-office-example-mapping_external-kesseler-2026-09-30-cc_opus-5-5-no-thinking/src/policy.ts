import { Item, kindOf } from './catalog';

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
const VERY_HIGH_ENCHANTMENT = 8;
const VERY_HIGH_ENCHANTMENT_REIMBURSEMENT = 0.5;

function reimbursableAmount(item: Item, amount: number): number {
  if ((item.enchantment ?? 0) >= VERY_HIGH_ENCHANTMENT) {
    return amount * VERY_HIGH_ENCHANTMENT_REIMBURSEMENT;
  }
  return amount;
}

export class Policy {
  private remainingCap: number;

  constructor(private readonly items: Item[]) {
    this.remainingCap = CAP_FACTOR * items.reduce((sum, item) => sum + kindOf(item.type).insuranceValue, 0);
  }

  claim(damages: Damage[]): ClaimResult {
    const payout = Math.floor(Math.min(this.desiredPayout(damages), this.remainingCap));
    this.remainingCap -= payout;
    return { payout, remainingCap: this.remainingCap };
  }

  private desiredPayout(damages: Damage[]): number {
    const undamaged = [...this.items];
    return damages.reduce((sum, damage) => {
      if (damage.amount < 0) {
        throw new Error(`Damage amount must not be negative: ${damage.amount}`);
      }
      const index = undamaged.findIndex((candidate) => candidate.type === damage.itemType);
      if (index < 0) {
        throw new Error(`Damaged item is not covered by the policy: ${damage.itemType}`);
      }
      const [item] = undamaged.splice(index, 1);
      return sum + Math.max(0, reimbursableAmount(item, damage.amount) - DEDUCTIBLE);
    }, 0);
  }
}
