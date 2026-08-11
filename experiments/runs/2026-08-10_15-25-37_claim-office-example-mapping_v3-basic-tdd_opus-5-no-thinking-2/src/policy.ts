import { insuranceValueOf, priceOf } from './catalog.js';
import { ClaimOfficeError, type ClaimResult, type Damage, type Incident, type Item } from './types.js';

const DEDUCTIBLE = 100;
const CAP_FACTOR = 2;
const HIGH_ENCHANTMENT_LEVEL = 8;
const HIGH_ENCHANTMENT_REIMBURSEMENT = 0.5;

/**
 * Reimbursement rate for a damaged item. Damage is reimbursed in full unless
 * the item is highly enchanted; that clause takes precedence over the full
 * reimbursement dragon material would otherwise guarantee.
 */
function reimbursementRate(item: Item): number {
  const highlyEnchanted = (item.enchantment ?? 0) >= HIGH_ENCHANTMENT_LEVEL;
  return highlyEnchanted ? HIGH_ENCHANTMENT_REIMBURSEMENT : 1;
}

/** An insurance policy created by a quote, tracking its remaining cap. */
export class Policy {
  readonly insuranceSum: number;
  remainingCap: number;

  constructor(private readonly items: Item[]) {
    this.insuranceSum = items.reduce((sum, item) => sum + insuranceValueOf(item), 0);
    this.remainingCap = this.insuranceSum * CAP_FACTOR;
  }

  /**
   * Matches each damage to a distinct covered item of the same type, so that
   * a policy is never claimed against more often than it covers.
   */
  private matchDamages(damages: Damage[]): { damage: Damage; item: Item }[] {
    const available = [...this.items];
    return damages.map((damage) => {
      priceOf(damage.itemType);
      if (damage.amount < 0) {
        throw new ClaimOfficeError(
          `damage amount must not be negative: ${damage.amount} for ${damage.itemType}`,
        );
      }
      const index = available.findIndex((item) => item.type === damage.itemType);
      if (index === -1) {
        throw new ClaimOfficeError(`item not covered by the policy: ${damage.itemType}`);
      }
      const [item] = available.splice(index, 1);
      return { damage, item };
    });
  }

  /** Processes a damage report, consuming part of the policy's cap. */
  claim(incident: Incident): ClaimResult {
    const matched = this.matchDamages(incident.damages);

    const desired = matched.reduce((sum, { damage, item }) => {
      const reimbursed = damage.amount * reimbursementRate(item);
      return sum + Math.max(0, reimbursed - DEDUCTIBLE);
    }, 0);

    const payout = Math.floor(Math.min(desired, this.remainingCap));
    this.remainingCap -= payout;

    return { payout, remainingCap: this.remainingCap };
  }
}
