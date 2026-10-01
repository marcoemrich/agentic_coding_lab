import { Item, ClaimOfficeError, insuranceValue } from './catalog';

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
const HIGH_ENCHANTMENT_THRESHOLD = 8;
const HIGH_ENCHANTMENT_RATE = 0.5;

function reimbursement(item: Item, amount: number): number {
  // Dragon material is fully reimbursed, which is also the default; the
  // high-enchantment clause wins whenever it applies.
  const rate = (item.enchantment ?? 0) >= HIGH_ENCHANTMENT_THRESHOLD ? HIGH_ENCHANTMENT_RATE : 1;
  return Math.max(0, amount * rate - DEDUCTIBLE);
}

export class Policy {
  private readonly items: Item[];
  remainingCap: number;

  constructor(items: Item[]) {
    this.items = items;
    this.remainingCap = CAP_FACTOR * items.reduce((sum, item) => sum + insuranceValue(item.type), 0);
  }

  claim(damages: Damage[]): ClaimResult {
    const unclaimed = [...this.items];
    let total = 0;
    for (const damage of damages) {
      if (!Number.isFinite(damage.amount) || damage.amount < 0) {
        throw new ClaimOfficeError(`Invalid damage amount: ${damage.amount}`);
      }
      const index = unclaimed.findIndex((item) => item.type === damage.itemType);
      if (index < 0) {
        throw new ClaimOfficeError(`Damaged item not covered by policy: ${damage.itemType}`);
      }
      const [item] = unclaimed.splice(index, 1);
      total += reimbursement(item, damage.amount);
    }
    const payout = Math.min(Math.floor(total), this.remainingCap);
    this.remainingCap -= payout;
    return { payout, remainingCap: this.remainingCap };
  }
}
