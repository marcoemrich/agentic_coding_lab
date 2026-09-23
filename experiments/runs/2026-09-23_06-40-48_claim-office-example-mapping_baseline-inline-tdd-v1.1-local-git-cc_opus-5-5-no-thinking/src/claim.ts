import { insuranceSum, ValidationError, type Item } from './catalog';

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
const HALF_REIMBURSEMENT_ENCHANTMENT = 8;
const HALVES_PER_G = 2;

export class Policy {
  remainingCap: number;

  constructor(private readonly items: Item[]) {
    this.remainingCap = CAP_FACTOR * insuranceSum(items);
  }

  claim(damages: Damage[]): ClaimResult {
    const damagedItems = this.matchDamagesToItems(damages);

    // Work in halves of G so the 50 % clause stays exact until the final rounding.
    let halves = 0;
    damages.forEach((damage, i) => {
      const reimbursedHalves =
        (damagedItems[i].enchantment ?? 0) >= HALF_REIMBURSEMENT_ENCHANTMENT ? damage.amount : damage.amount * HALVES_PER_G;
      halves += Math.max(0, reimbursedHalves - DEDUCTIBLE * HALVES_PER_G);
    });

    const payout = Math.min(Math.floor(halves / HALVES_PER_G), this.remainingCap);
    this.remainingCap -= payout;
    return { payout, remainingCap: this.remainingCap };
  }

  private matchDamagesToItems(damages: Damage[]): Item[] {
    const used = new Set<number>();
    return damages.map((damage) => {
      if (!Number.isInteger(damage.amount) || damage.amount < 0) {
        throw new ValidationError(`Invalid damage amount: ${damage.amount}`);
      }
      const index = this.items.findIndex((item, i) => item.type === damage.itemType && !used.has(i));
      if (index < 0) {
        throw new ValidationError(`Damaged item not covered by policy: ${damage.itemType}`);
      }
      used.add(index);
      return this.items[index];
    });
  }
}
