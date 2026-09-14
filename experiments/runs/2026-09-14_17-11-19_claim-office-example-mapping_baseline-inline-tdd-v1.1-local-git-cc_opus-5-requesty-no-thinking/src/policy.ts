import { Item, insuranceValue } from './premium.js';
import { ClaimError } from './errors.js';

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
const HALF_REIMBURSEMENT_THRESHOLD = 8;
const HALF_REIMBURSEMENT = 0.5;

/** Rounds in the MHPCO's favour: payouts go down. */
export function roundPayout(amount: number): number {
  return Math.floor(amount);
}

/**
 * Reimbursable share of a damage to the given item, before the deductible.
 *
 * The high-enchantment clause takes precedence: on an item of enchantment 8
 * or more only half the damage is reimbursed, even for dragon material. Every
 * other item — dragon material or not — is reimbursed in full.
 */
function reimbursement(item: Item, amount: number): number {
  if ((item.enchantment ?? 0) >= HALF_REIMBURSEMENT_THRESHOLD) {
    return amount * HALF_REIMBURSEMENT;
  }
  return amount;
}

export class Policy {
  readonly insuranceSum: number;
  remainingCap: number;

  constructor(private readonly items: Item[]) {
    this.insuranceSum = items.reduce(
      (sum, item) => sum + insuranceValue(item.type),
      0,
    );
    this.remainingCap = this.insuranceSum * CAP_FACTOR;
  }

  /**
   * Processes one incident. Each damage entry is a separate damage event with
   * its own deductible and is matched against one distinct insured item, so a
   * policy covering one sword cannot carry two sword damages.
   *
   * Throws without touching the cap if any entry cannot be matched or carries
   * a negative amount — the whole claim is rejected.
   */
  claim(damages: Damage[]): ClaimResult {
    const available = [...this.items];

    let total = 0;
    for (const damage of damages) {
      if (damage.amount < 0) {
        throw new ClaimError(`negative damage amount: ${damage.amount}`);
      }
      const index = available.findIndex(
        (item) => item.type === damage.itemType,
      );
      if (index === -1) {
        throw new ClaimError(
          `item not covered by the policy: ${damage.itemType}`,
        );
      }
      const [item] = available.splice(index, 1);
      total += Math.max(0, reimbursement(item, damage.amount) - DEDUCTIBLE);
    }

    const payout = roundPayout(Math.min(total, this.remainingCap));
    this.remainingCap -= payout;
    return { payout, remainingCap: this.remainingCap };
  }
}
