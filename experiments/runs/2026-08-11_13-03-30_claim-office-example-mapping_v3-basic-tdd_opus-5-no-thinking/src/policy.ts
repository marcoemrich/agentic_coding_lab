import { Item, priceOf } from './catalog.js';
import { roundDown } from './rounding.js';

const DEDUCTIBLE = 100;
const CAP_FACTOR = 2;
const HALF_REIMBURSEMENT_THRESHOLD = 8;
const HALF_REIMBURSEMENT_RATE = 0.5;
const FULL_REIMBURSEMENT_RATE = 1;

export interface Damage {
  itemType: string;
  amount: number;
}

export interface ClaimResult {
  payout: number;
  remainingCap: number;
}

export class ClaimError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'ClaimError';
  }
}

/**
 * Reimbursable share of a damage, before the deductible. Items with a high
 * enchantment are reimbursed at 50 %; that clause takes precedence over the
 * full reimbursement granted to dragon material. Dragon material and the
 * standard case both reimburse in full, so they share the 1 below — the
 * dragon clause only becomes observable if the standard rate ever drops.
 */
function reimbursementRate(item: Item): number {
  if ((item.enchantment ?? 0) >= HALF_REIMBURSEMENT_THRESHOLD) {
    return HALF_REIMBURSEMENT_RATE;
  }
  return FULL_REIMBURSEMENT_RATE;
}

export class Policy {
  readonly insuranceSum: number;
  remainingCap: number;

  constructor(private readonly items: Item[]) {
    this.insuranceSum = items.reduce(
      (sum, item) => sum + priceOf(item.type).insuranceValue,
      0,
    );
    this.remainingCap = this.insuranceSum * CAP_FACTOR;
  }

  /**
   * Process one damage event. Each damage entry is matched to a distinct
   * insured item, carries its own deductible, and the total is limited to the
   * cap still remaining on the policy.
   */
  claim(damages: Damage[]): ClaimResult {
    const available = [...this.items];

    let payout = 0;
    for (const damage of damages) {
      if (damage.amount < 0) {
        throw new ClaimError(
          `Damage amount must not be negative: ${damage.amount}`,
        );
      }
      // Unknown types are rejected by priceOf; a type the policy does not
      // cover — or covers fewer times than claimed — is rejected here.
      priceOf(damage.itemType);
      const index = available.findIndex((item) => item.type === damage.itemType);
      if (index === -1) {
        throw new ClaimError(
          `Damaged item is not covered by this policy: ${damage.itemType}`,
        );
      }
      const [item] = available.splice(index, 1);

      const reimbursed = damage.amount * reimbursementRate(item);
      payout += Math.max(0, reimbursed - DEDUCTIBLE);
    }

    const granted = Math.min(roundDown(payout), this.remainingCap);
    this.remainingCap -= granted;
    return { payout: granted, remainingCap: this.remainingCap };
  }
}

export function openPolicy(items: Item[]): Policy {
  return new Policy(items);
}
