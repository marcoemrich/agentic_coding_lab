import { Item } from './premium.js';
import { insuranceSum } from './quote.js';
import { damagePayout } from './claim.js';

const CAP_FACTOR = 2;

export interface Damage {
  itemType: string;
  amount: number;
}

export interface ClaimResult {
  payout: number;
  remainingCap: number;
}

export class Policy {
  private readonly items: Item[];
  private remaining: number;

  constructor(items: Item[]) {
    this.items = items;
    this.remaining = insuranceSum(items) * CAP_FACTOR;
  }

  get remainingCap(): number {
    return this.remaining;
  }

  claim(damages: Damage[]): ClaimResult {
    const available = new Map<string, Item[]>();
    for (const item of this.items) {
      const bucket = available.get(item.type) ?? [];
      bucket.push(item);
      available.set(item.type, bucket);
    }

    let gross = 0;
    for (const damage of damages) {
      if (damage.amount < 0) {
        throw new Error(`negative damage amount: ${damage.amount}`);
      }
      const bucket = available.get(damage.itemType);
      if (!bucket || bucket.length === 0) {
        throw new Error(`item not covered by the policy: ${damage.itemType}`);
      }
      const item = bucket.shift()!;
      gross += damagePayout(item, damage.amount);
    }

    const payout = Math.min(Math.floor(gross), this.remaining);
    this.remaining -= payout;
    return { payout, remainingCap: this.remaining };
  }
}
