import { isKnownType } from './catalog.js';
import type { Item } from './premium.js';
import { insuranceSum, policyCap, settleDamage } from './claim.js';

export interface Damage {
  itemType: string;
  amount: number;
}

export interface Incident {
  cause: string;
  damages: Damage[];
}

export interface ClaimResult {
  payout: number;
  remainingCap: number;
}

export class ClaimRejectedError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'ClaimRejectedError';
  }
}

/**
 * A policy created by a quote step. It owns the insured items and the
 * remaining cap, which successive claims draw down.
 */
export class Policy {
  readonly insuranceSum: number;
  private remaining: number;

  constructor(private readonly items: Item[]) {
    this.insuranceSum = insuranceSum(items);
    this.remaining = policyCap(items);
  }

  get remainingCap(): number {
    return this.remaining;
  }

  /**
   * Settles an incident against this policy. The whole claim is rejected if
   * any damage entry cannot be matched to a distinct insured item, or carries
   * a negative amount, so a rejected claim leaves the cap untouched.
   */
  claim(incident: Incident): ClaimResult {
    const available = [...this.items];
    let desired = 0;

    for (const damage of incident.damages) {
      if (damage.amount < 0) {
        throw new ClaimRejectedError(`negative damage amount: ${damage.amount}`);
      }
      if (!isKnownType(damage.itemType)) {
        throw new ClaimRejectedError(`unknown item type: ${damage.itemType}`);
      }
      const index = available.findIndex((item) => item.type === damage.itemType);
      if (index === -1) {
        throw new ClaimRejectedError(`item not covered by this policy: ${damage.itemType}`);
      }
      const [insured] = available.splice(index, 1);
      desired += settleDamage(insured, damage.amount);
    }

    const payout = Math.min(desired, this.remaining);
    this.remaining -= payout;
    return { payout, remainingCap: this.remaining };
  }
}
