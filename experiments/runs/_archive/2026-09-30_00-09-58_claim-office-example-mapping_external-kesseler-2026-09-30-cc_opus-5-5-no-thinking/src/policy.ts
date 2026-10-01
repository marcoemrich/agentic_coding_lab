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
const REDUCED_REIMBURSEMENT_ENCHANTMENT_LEVEL = 8;
const REDUCED_REIMBURSEMENT_RATE = 0.5;

function reimbursementRate(item: Item): number {
  return (item.enchantment ?? 0) >= REDUCED_REIMBURSEMENT_ENCHANTMENT_LEVEL ? REDUCED_REIMBURSEMENT_RATE : 1;
}

function damagePayout(damage: Damage, item: Item): number {
  return Math.max(0, damage.amount * reimbursementRate(item) - DEDUCTIBLE);
}

export class Policy {
  private remainingCap: number;

  constructor(private readonly items: Item[]) {
    this.remainingCap = CAP_FACTOR * items.reduce((sum, item) => sum + priceListEntry(item.type).insuranceValue, 0);
  }

  claim(damages: Damage[]): ClaimResult {
    const desired = this.damagePayouts(damages).reduce((sum, payout) => sum + payout, 0);
    const payout = Math.min(Math.floor(desired), this.remainingCap);
    this.remainingCap -= payout;
    return { payout, remainingCap: this.remainingCap };
  }

  private damagePayouts(damages: Damage[]): number[] {
    const undamaged = [...this.items];
    return damages.map((damage) => {
      if (damage.amount < 0) {
        throw new Error(`Invalid damage amount: ${damage.amount}`);
      }
      const index = undamaged.findIndex((candidate) => candidate.type === damage.itemType);
      if (index < 0) {
        throw new Error(`Item not covered: ${damage.itemType}`);
      }
      return damagePayout(damage, undamaged.splice(index, 1)[0]);
    });
  }
}
