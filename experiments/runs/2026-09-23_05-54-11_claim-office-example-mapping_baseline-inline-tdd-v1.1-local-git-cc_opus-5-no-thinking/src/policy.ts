import { Item, insuranceSum } from './premium.js';
import { ClaimError, ClaimResult, Incident, damagePayout } from './claim.js';
import { lookup, UnknownItemTypeError } from './catalog.js';

const CAP_FACTOR = 2;

/**
 * A policy created by a quote step. Tracks the payout cap, which is consumed
 * by successive claims.
 */
export class Policy {
  readonly insuranceSum: number;
  private cap: number;

  constructor(private readonly items: Item[]) {
    this.insuranceSum = insuranceSum(items);
    this.cap = this.insuranceSum * CAP_FACTOR;
  }

  get remainingCap(): number {
    return this.cap;
  }

  /**
   * Processes an incident against this policy. Either the whole claim is
   * accepted and the cap reduced, or a ClaimError is thrown and the policy is
   * left untouched.
   */
  claim(incident: Incident): ClaimResult {
    const matched = this.matchDamages(incident);

    let desired = 0;
    for (const { item, amount } of matched) {
      desired += damagePayout(item, amount);
    }

    const payout = Math.floor(Math.min(desired, this.cap));
    this.cap -= payout;
    return { payout, remainingCap: this.cap };
  }

  /**
   * Pairs every damage entry with a distinct insured item of that type, so
   * that two damages to "sword" need two insured swords. Rejects unknown
   * types, uninsured types, excess entries and negative amounts.
   */
  private matchDamages(incident: Incident): { item: Item; amount: number }[] {
    const available = [...this.items];
    return incident.damages.map((damage) => {
      if (damage.amount < 0) {
        throw new ClaimError(`Negative damage amount for ${damage.itemType}: ${damage.amount}`);
      }
      try {
        lookup(damage.itemType);
      } catch (error) {
        if (error instanceof UnknownItemTypeError) throw new ClaimError(error.message);
        throw error;
      }
      const index = available.findIndex((item) => item.type === damage.itemType);
      if (index === -1) {
        throw new ClaimError(`Damaged item is not covered by the policy: ${damage.itemType}`);
      }
      const [item] = available.splice(index, 1);
      return { item, amount: damage.amount };
    });
  }
}
