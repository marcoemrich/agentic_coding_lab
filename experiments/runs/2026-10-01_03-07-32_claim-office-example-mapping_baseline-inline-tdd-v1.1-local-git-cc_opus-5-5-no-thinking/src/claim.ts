import { ClaimOfficeError, Item, specFor } from './items';

const ROUNDING_PRECISION = 6;
const DEDUCTIBLE = 100;
const CAP_FACTOR = 2;
const HIGH_ENCHANTMENT_THRESHOLD = 8;
const HIGH_ENCHANTMENT_RATE = 0.5;

export interface Damage {
  itemType: string;
  amount: number;
}

export interface ClaimResult {
  payout: number;
  remainingCap: number;
}

function reimbursementRate(item: Item): number {
  // Dragon material is fully reimbursed, but the high-enchantment clause takes precedence.
  return (item.enchantment ?? 0) >= HIGH_ENCHANTMENT_THRESHOLD ? HIGH_ENCHANTMENT_RATE : 1;
}

/** Rounds down, tolerating floating-point noise from fractional intermediates. */
function roundDown(amount: number): number {
  return Math.floor(Number(amount.toFixed(ROUNDING_PRECISION)));
}

export class Policy {
  private readonly items: Item[];
  remainingCap: number;

  constructor(items: Item[]) {
    this.items = items;
    const insuranceSum = items.reduce((sum, item) => sum + specFor(item.type).insuranceValue, 0);
    this.remainingCap = CAP_FACTOR * insuranceSum;
  }

  claim(damages: Damage[]): ClaimResult {
    const available = [...this.items];
    let desired = 0;
    for (const damage of damages) {
      if (!Number.isFinite(damage.amount) || damage.amount < 0) {
        throw new ClaimOfficeError(`Invalid damage amount: ${damage.amount}`);
      }
      const index = available.findIndex((item) => item.type === damage.itemType);
      if (index < 0) {
        throw new ClaimOfficeError(`Damaged item not covered by policy: ${damage.itemType}`);
      }
      const [item] = available.splice(index, 1);
      desired += Math.max(0, damage.amount * reimbursementRate(item) - DEDUCTIBLE);
    }
    const payout = roundDown(Math.min(desired, this.remainingCap));
    this.remainingCap -= payout;
    return { payout, remainingCap: this.remainingCap };
  }
}
