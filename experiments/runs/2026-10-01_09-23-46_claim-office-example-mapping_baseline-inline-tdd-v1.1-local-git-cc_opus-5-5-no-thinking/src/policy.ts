import { ClaimOfficeError, Item, insuranceValue } from './catalog';
import { roundFloatNoise } from './premium';

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
  // Dragon material grants full reimbursement, which is the default; the 50 % clause wins over it.
  const rate = (item.enchantment ?? 0) >= HIGH_ENCHANTMENT_LEVEL ? HIGH_ENCHANTMENT_RATE : 1;
  return Math.max(0, amount * rate - DEDUCTIBLE);
}

export class Policy {
  private readonly items: Item[];
  remainingCap: number;

  constructor(items: Item[]) {
    this.items = items;
    this.remainingCap = CAP_FACTOR * items.reduce((sum, item) => sum + insuranceValue(item), 0);
  }

  claim(damages: Damage[]): ClaimResult {
    const desired = this.matchDamages(damages).reduce(
      (sum, { item, amount }) => sum + reimbursement(item, amount),
      0,
    );
    const payout = Math.min(Math.floor(roundFloatNoise(desired)), this.remainingCap);
    this.remainingCap -= payout;
    return { payout, remainingCap: this.remainingCap };
  }

  /** Assigns each damage to a distinct covered item of the same type, in order. */
  private matchDamages(damages: Damage[]): { item: Item; amount: number }[] {
    const used = new Set<number>();
    return damages.map(({ itemType, amount }) => {
      if (!Number.isFinite(amount) || amount < 0) {
        throw new ClaimOfficeError(`Invalid damage amount for ${itemType}: ${amount}`);
      }
      const index = this.items.findIndex((item, i) => item.type === itemType && !used.has(i));
      if (index < 0) {
        throw new ClaimOfficeError(`Damaged item not covered by policy: ${itemType}`);
      }
      used.add(index);
      return { item: this.items[index], amount };
    });
  }
}
