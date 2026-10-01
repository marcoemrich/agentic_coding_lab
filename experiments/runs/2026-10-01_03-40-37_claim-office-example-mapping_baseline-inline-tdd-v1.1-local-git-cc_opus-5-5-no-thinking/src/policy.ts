import { Item, ValidationError, priceOf } from './catalog';

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

/**
 * Reimbursement in half-G units, keeping the 50% clause exact.
 * The 50% clause takes precedence over dragon material, which (like every other item)
 * is reimbursed fully.
 */
function reimbursementInHalves(item: Item, amount: number): number {
  const halves = (item.enchantment ?? 0) >= HALF_REIMBURSEMENT_ENCHANTMENT ? amount : amount * HALVES_PER_G;
  return Math.max(0, halves - DEDUCTIBLE * HALVES_PER_G);
}

export class Policy {
  private readonly items: Item[];
  private remaining: number;

  constructor(items: Item[]) {
    this.items = items;
    const insuranceSum = items.reduce((sum, item) => sum + priceOf(item.type).insuranceValue, 0);
    this.remaining = insuranceSum * CAP_FACTOR;
  }

  get remainingCap(): number {
    return this.remaining;
  }

  claim(damages: Damage[]): ClaimResult {
    const damagedItems = this.matchDamagedItems(damages);
    const halves = damages.reduce((sum, damage, i) => sum + reimbursementInHalves(damagedItems[i], damage.amount), 0);
    const payout = Math.min(Math.floor(halves / HALVES_PER_G), this.remaining);
    this.remaining -= payout;
    return { payout, remainingCap: this.remaining };
  }

  /** Pairs each damage with a distinct insured item of its type, in policy order. */
  private matchDamagedItems(damages: Damage[]): Item[] {
    const used = new Set<number>();
    return damages.map((damage) => {
      if (!Number.isFinite(damage.amount) || damage.amount < 0) {
        throw new ValidationError(`Invalid damage amount: ${damage.amount}`);
      }
      const index = this.items.findIndex((item, i) => item.type === damage.itemType && !used.has(i));
      if (index < 0) {
        throw new ValidationError(`No (further) insured item of type ${damage.itemType} on this policy`);
      }
      used.add(index);
      return this.items[index];
    });
  }
}
