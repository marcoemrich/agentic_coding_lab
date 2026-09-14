import { ClaimError, Incident, damagePayout } from './claim.js';
import { Item, insuranceSum } from './policy.js';

const CAP_FACTOR = 2;

/** Rounds in the MHPCO's favour: payouts go down. */
function roundDown(amount: number): number {
  return Math.floor(amount);
}

export interface ClaimResult {
  payout: number;
  remainingCap: number;
}

export class Policy {
  private remainingCap: number;

  constructor(private readonly items: Item[]) {
    this.remainingCap = insuranceSum(items) * CAP_FACTOR;
  }

  /** Assigns each damage entry to a distinct insured item of the same type. */
  private matchDamages(incident: Incident): { item: Item; amount: number }[] {
    const available = [...this.items];
    return incident.damages.map((damage) => {
      const index = available.findIndex((item) => item.type === damage.itemType);
      if (index < 0) {
        throw new ClaimError(`item not covered by the policy: ${damage.itemType}`);
      }
      const [item] = available.splice(index, 1);
      return { item, amount: damage.amount };
    });
  }

  claim(incident: Incident): ClaimResult {
    const matched = this.matchDamages(incident);
    const desired = matched.reduce(
      (sum, { item, amount }) => sum + damagePayout(item, amount),
      0,
    );
    const payout = roundDown(Math.min(desired, this.remainingCap));
    this.remainingCap -= payout;
    return { payout, remainingCap: this.remainingCap };
  }
}
