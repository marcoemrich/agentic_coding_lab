import { Item, insuranceValue } from './catalog';

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

function reimbursableAmount(item: Item, amount: number): number {
  // Dragon material is fully reimbursed, which is the default; the 50% rule wins over it.
  if ((item.enchantment ?? 0) >= HIGH_ENCHANTMENT_LEVEL) return amount * HIGH_ENCHANTMENT_REIMBURSEMENT;
  return amount;
}

export class Policy {
  private remainingCap: number;

  constructor(private readonly items: Item[]) {
    const insuranceSum = items.reduce((sum, item) => sum + insuranceValue(item.type), 0);
    this.remainingCap = insuranceSum * CAP_FACTOR;
  }

  claim(damages: Damage[]): ClaimResult {
    const damagedItems = this.matchDamagedItems(damages);
    const desired = damages.reduce(
      (sum, damage, index) => sum + Math.max(0, reimbursableAmount(damagedItems[index], damage.amount) - DEDUCTIBLE),
      0,
    );
    const payout = Math.min(Math.floor(desired), this.remainingCap);
    this.remainingCap -= payout;
    return { payout, remainingCap: this.remainingCap };
  }

  // Each damage entry claims its own insured item; the claim fails if none is left.
  private matchDamagedItems(damages: Damage[]): Item[] {
    const unclaimed = [...this.items];
    return damages.map((damage) => {
      if (damage.amount < 0) throw new Error(`Negative damage amount for ${damage.itemType}: ${damage.amount}`);
      const index = unclaimed.findIndex((item) => item.type === damage.itemType);
      if (index === -1) throw new Error(`Damaged item not covered by policy: ${damage.itemType}`);
      return unclaimed.splice(index, 1)[0];
    });
  }
}
