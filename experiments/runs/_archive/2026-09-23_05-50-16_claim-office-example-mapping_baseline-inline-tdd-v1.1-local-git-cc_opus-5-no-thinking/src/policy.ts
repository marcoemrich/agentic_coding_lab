import { Item, insuranceSum } from './quote.js';
import { ClaimResult, Damage, InvalidDamageError, UninsuredDamageError } from './claim.js';

const DEDUCTIBLE = 100;
const CAP_FACTOR = 2;
const HIGH_ENCHANTMENT_CLAIM_THRESHOLD = 8;
const HIGH_ENCHANTMENT_REIMBURSEMENT = 0.5;

/**
 * A policy created by a quote step. It knows the insured items and tracks how
 * much of the payout cap successive claims have already consumed.
 */
export class Policy {
  readonly insuranceSum: number;
  private capLeft: number;

  constructor(private readonly items: Item[]) {
    this.insuranceSum = insuranceSum(items);
    this.capLeft = this.insuranceSum * CAP_FACTOR;
  }

  get remainingCap(): number {
    return this.capLeft;
  }

  claim(damages: Damage[]): ClaimResult {
    const damagedItems = this.matchDamagesToItems(damages);

    let desired = 0;
    for (const { item, amount } of damagedItems) {
      desired += Math.max(0, this.reimbursement(item, amount) - DEDUCTIBLE);
    }

    const payout = Math.floor(Math.min(desired, this.capLeft));
    this.capLeft -= payout;
    return { payout, remainingCap: this.capLeft };
  }

  /**
   * Each damage entry is a separate damage against one insured item, so a
   * policy covering two swords absorbs two sword damages but no more.
   */
  private matchDamagesToItems(damages: Damage[]): { item: Item; amount: number }[] {
    const available = [...this.items];

    return damages.map(({ itemType, amount }) => {
      if (amount < 0) throw new InvalidDamageError(`negative damage amount: ${amount}`);

      const index = available.findIndex((item) => item.type === itemType);
      if (index === -1) {
        throw new UninsuredDamageError(`damage to an item not covered by the policy: ${itemType}`);
      }

      const [item] = available.splice(index, 1);
      return { item, amount };
    });
  }

  /**
   * Damage is reimbursed in full - as the dragon-material clause spells out
   * and as the standard case does anyway - except for highly enchanted items,
   * whose 50 % clause wins even when the item is also dragon material.
   */
  private reimbursement(item: Item, amount: number): number {
    return (item.enchantment ?? 0) >= HIGH_ENCHANTMENT_CLAIM_THRESHOLD
      ? amount * HIGH_ENCHANTMENT_REIMBURSEMENT
      : amount;
  }
}
