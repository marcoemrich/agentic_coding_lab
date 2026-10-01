import { Item, priceListEntry } from './catalog';

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
const HIGH_ENCHANTMENT_LEVEL = 8;
const HIGH_ENCHANTMENT_REIMBURSEMENT = 0.5;

function reimbursement(item: Item, amount: number): number {
  const rate = (item.enchantment ?? 0) >= HIGH_ENCHANTMENT_LEVEL ? HIGH_ENCHANTMENT_REIMBURSEMENT : 1;
  return Math.max(0, amount * rate - DEDUCTIBLE);
}

export class Policy {
  private remainingCap: number;

  constructor(private readonly items: Item[]) {
    const insuranceSum = items.reduce((total, item) => total + priceListEntry(item.type).insuranceValue, 0);
    this.remainingCap = CAP_FACTOR * insuranceSum;
  }

  claim(damages: Damage[]): ClaimResult {
    const unclaimed = [...this.items];
    const requested = damages.reduce((total, damage) => {
      if (damage.amount < 0) throw new Error(`Damage amount must not be negative: ${damage.amount}`);
      const index = unclaimed.findIndex((item) => item.type === damage.itemType);
      if (index === -1) throw new Error(`Damaged item is not covered by the policy: ${damage.itemType}`);
      const [item] = unclaimed.splice(index, 1);
      return total + reimbursement(item, damage.amount);
    }, 0);
    const payout = Math.min(Math.floor(requested), this.remainingCap);
    this.remainingCap -= payout;
    return { payout, remainingCap: this.remainingCap };
  }
}
