import { ClaimOfficeError, Item, ROUNDING_EPSILON, insuranceValue } from './catalog';

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
const HIGH_ENCHANTMENT_RATE = 0.5;

function reimbursement(item: Item, amount: number): number {
  // Dragon material is fully reimbursed, which is also the default; the 50 % clause wins over it.
  const rate = (item.enchantment ?? 0) >= HIGH_ENCHANTMENT_LEVEL ? HIGH_ENCHANTMENT_RATE : 1;
  return Math.max(0, amount * rate - DEDUCTIBLE);
}

export class Policy {
  private readonly items: Item[];
  remainingCap: number;

  constructor(items: Item[]) {
    this.items = items;
    const insuranceSum = items.reduce((sum, item) => sum + insuranceValue(item.type), 0);
    this.remainingCap = insuranceSum * CAP_FACTOR;
  }

  claim(damages: Damage[]): ClaimResult {
    const used = new Set<number>();
    let total = 0;
    for (const damage of damages) {
      if (!Number.isFinite(damage.amount) || damage.amount < 0) {
        throw new ClaimOfficeError(`Invalid damage amount for ${damage.itemType}: ${damage.amount}`);
      }
      const index = this.items.findIndex((item, i) => item.type === damage.itemType && !used.has(i));
      if (index < 0) {
        throw new ClaimOfficeError(`Damaged item ${damage.itemType} is not covered by the policy`);
      }
      used.add(index);
      total += reimbursement(this.items[index], damage.amount);
    }
    const payout = Math.min(Math.floor(total + ROUNDING_EPSILON), this.remainingCap);
    this.remainingCap -= payout;
    return { payout, remainingCap: this.remainingCap };
  }
}
