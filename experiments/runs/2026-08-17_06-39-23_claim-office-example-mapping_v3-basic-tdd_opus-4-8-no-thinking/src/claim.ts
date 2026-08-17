import type { ClaimResult, DamageEntry, Incident, Item } from './types.js';
import {
  CAP_MULTIPLIER,
  DEDUCTIBLE,
  insuranceValueOf,
  isKnownItemType,
} from './pricing.js';

const HIGH_ENCHANTMENT_CLAIM_THRESHOLD = 8;
const HIGH_ENCHANTMENT_REIMBURSEMENT = 0.5;

export class ClaimError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'ClaimError';
  }
}

/** Round a payout down to the whole G (in the MHPCO's favor). */
export function roundPayout(amount: number): number {
  return Math.floor(amount);
}

/** Validate a single damage entry's item type and amount. */
function validateDamageEntry(damage: DamageEntry): void {
  if (!isKnownItemType(damage.itemType)) {
    throw new ClaimError(`Unknown item type: ${damage.itemType}`);
  }
  if (damage.amount < 0) {
    throw new ClaimError(`Negative damage amount: ${damage.amount}`);
  }
}

/**
 * Reimbursement fraction of the damage amount for a single item, before the
 * deductible. Items with enchantment >= 8 are reimbursed at 50 %; the
 * high-enchantment clause wins over the (full) dragon-material clause. All
 * other items are fully reimbursed.
 */
function reimbursementFraction(item: Item): number {
  if (
    item.enchantment !== undefined &&
    item.enchantment >= HIGH_ENCHANTMENT_CLAIM_THRESHOLD
  ) {
    return HIGH_ENCHANTMENT_REIMBURSEMENT;
  }
  return 1;
}

/**
 * A policy created by a quote step. Tracks the insured items and the remaining
 * cap across successive claims.
 */
export class Policy {
  readonly items: Item[];
  readonly insuranceSum: number;
  private remaining: number;

  constructor(items: Item[]) {
    this.items = items;
    this.insuranceSum = items.reduce(
      (sum, item) => sum + insuranceValueOf(item.type),
      0,
    );
    this.remaining = this.insuranceSum * CAP_MULTIPLIER;
  }

  get remainingCap(): number {
    return this.remaining;
  }

  /** Number of insured items of a given type. */
  private countOfType(type: string): number {
    return this.items.filter((item) => item.type === type).length;
  }

  /** The insured items of a given type, in policy order. */
  private itemsOfType(type: string): Item[] {
    return this.items.filter((item) => item.type === type);
  }

  claim(incident: Incident): ClaimResult {
    this.validateDamages(incident);

    const gross = this.grossReimbursement(incident);

    // Apply the remaining cap, then round the final payout down.
    const capped = Math.min(gross, this.remaining);
    const payout = roundPayout(capped);
    this.remaining -= payout;

    return { payout, remainingCap: this.remaining };
  }

  /**
   * Validate every damage entry up front; the whole claim is rejected on any
   * invalid entry (unknown type, negative amount, item not insured, or more
   * damages of a type than insured).
   */
  private validateDamages(incident: Incident): void {
    const damageCountByType = new Map<string, number>();
    for (const damage of incident.damages) {
      validateDamageEntry(damage);
      damageCountByType.set(
        damage.itemType,
        (damageCountByType.get(damage.itemType) ?? 0) + 1,
      );
    }
    for (const [type, count] of damageCountByType) {
      this.validateDamageCount(type, count);
    }
  }

  private validateDamageCount(type: string, count: number): void {
    const insured = this.countOfType(type);
    if (insured === 0) {
      throw new ClaimError(`Item not in policy: ${type}`);
    }
    if (count > insured) {
      throw new ClaimError(
        `More ${type} damages (${count}) than insured (${insured})`,
      );
    }
  }

  /**
   * Total reimbursement across all damage entries (before the cap). Each entry
   * is matched to an insured item of the same type so its enchantment/material
   * determine the reimbursement clause; the deductible applies per entry.
   */
  private grossReimbursement(incident: Incident): number {
    const cursor = new Map<string, number>();
    let gross = 0;
    for (const damage of incident.damages) {
      const index = cursor.get(damage.itemType) ?? 0;
      cursor.set(damage.itemType, index + 1);
      const item = this.itemsOfType(damage.itemType)[index];

      const reimbursed = damage.amount * reimbursementFraction(item);
      gross += Math.max(0, reimbursed - DEDUCTIBLE);
    }
    return gross;
  }
}
