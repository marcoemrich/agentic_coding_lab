import { Item, insuranceSum } from './items';

export interface Damage {
  itemType: string;
  amount: number;
}

export interface ClaimResult {
  payout: number;
  remainingCap: number;
}

export class InvalidClaimError extends Error {}

const DEDUCTIBLE = 100;
const CAP_FACTOR = 2;
const HIGH_ENCHANTMENT_THRESHOLD = 8;
const HIGH_ENCHANTMENT_RATE = 0.5;

function reimbursement(item: Item, amount: number): number {
  const rate = (item.enchantment ?? 0) >= HIGH_ENCHANTMENT_THRESHOLD ? HIGH_ENCHANTMENT_RATE : 1;
  return Math.max(0, amount * rate - DEDUCTIBLE);
}

export class Policy {
  remainingCap: number;

  constructor(private readonly items: Item[]) {
    this.remainingCap = CAP_FACTOR * insuranceSum(items);
  }

  claim(damages: Damage[]): ClaimResult {
    const available = [...this.items];
    let desired = 0;
    for (const damage of damages) {
      if (!Number.isFinite(damage.amount) || damage.amount < 0) {
        throw new InvalidClaimError(`Invalid damage amount ${damage.amount} for ${damage.itemType}`);
      }
      const index = available.findIndex((item) => item.type === damage.itemType);
      if (index < 0) throw new InvalidClaimError(`Damaged item ${damage.itemType} is not covered by the policy`);
      const [item] = available.splice(index, 1);
      desired += reimbursement(item, damage.amount);
    }
    const payout = Math.floor(Math.min(desired, this.remainingCap));
    this.remainingCap -= payout;
    return { payout, remainingCap: this.remainingCap };
  }
}
