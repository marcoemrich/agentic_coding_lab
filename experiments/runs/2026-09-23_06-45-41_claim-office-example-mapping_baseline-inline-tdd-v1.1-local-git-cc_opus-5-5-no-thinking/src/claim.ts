import { Item, ROUNDING_EPSILON, ValidationError, insuranceSum, lookup } from './catalog';

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

function reimbursementRate(item: Item): number {
  // The 50 % high-enchantment clause wins over full dragon-material reimbursement.
  if ((item.enchantment ?? 0) >= HIGH_ENCHANTMENT_THRESHOLD) return HIGH_ENCHANTMENT_RATE;
  return 1;
}

export class Policy {
  readonly cap: number;
  private paid = 0;

  constructor(private readonly items: Item[]) {
    this.cap = CAP_FACTOR * insuranceSum(items);
  }

  get remainingCap(): number {
    return this.cap - this.paid;
  }

  claim(damages: Damage[]): ClaimResult {
    const damagedItems = this.matchDamages(damages);
    const desired = damages.reduce((sum, damage, i) => {
      const reimbursed = damage.amount * reimbursementRate(damagedItems[i]);
      return sum + Math.max(0, reimbursed - DEDUCTIBLE);
    }, 0);
    const payout = Math.min(Math.floor(desired + ROUNDING_EPSILON), this.remainingCap);
    this.paid += payout;
    return { payout, remainingCap: this.remainingCap };
  }

  /** Assigns each damage entry to a distinct insured item of the same type. */
  private matchDamages(damages: Damage[]): Item[] {
    const available = [...this.items];
    return damages.map((damage) => {
      if (!Number.isInteger(damage.amount) || damage.amount < 0) {
        throw new ValidationError(`Invalid damage amount: ${damage.amount}`);
      }
      lookup(damage.itemType);
      const index = available.findIndex((item) => item.type === damage.itemType);
      if (index < 0) throw new ValidationError(`Damaged item not covered by policy: ${damage.itemType}`);
      return available.splice(index, 1)[0];
    });
  }
}
