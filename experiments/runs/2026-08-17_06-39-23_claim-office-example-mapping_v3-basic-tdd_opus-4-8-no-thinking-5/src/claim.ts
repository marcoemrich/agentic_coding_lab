import { type Item } from './premium';

const INSURANCE_VALUES: Record<string, number> = {
  sword: 1000,
  amulet: 600,
  staff: 800,
  potion: 400,
  rune: 250,
  moonstone: 250,
};

const DEDUCTIBLE = 100;
const HIGH_ENCHANTMENT_CLAIM_THRESHOLD = 8;
const HIGH_ENCHANTMENT_REIMBURSEMENT = 0.5;
const CAP_MULTIPLIER = 2;

export interface Damage {
  itemType: string;
  amount: number;
}

export interface Incident {
  cause: string;
  damages: Damage[];
}

export class InvalidClaimError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'InvalidClaimError';
  }
}

export function insuranceValue(type: string): number {
  const value = INSURANCE_VALUES[type];
  if (value === undefined) {
    throw new InvalidClaimError(`Unknown item type for insurance value: ${type}`);
  }
  return value;
}

/** Insurance sum for a policy = sum of its items' insurance values. */
export function insuranceSum(items: Item[]): number {
  return items.reduce((sum, item) => sum + insuranceValue(item.type), 0);
}

/**
 * A Policy tracks the covered items and the remaining payout cap. The cap is
 * twice the insurance sum and is consumed across successive claims.
 */
export class Policy {
  readonly items: Item[];
  readonly cap: number;
  remainingCap: number;

  constructor(items: Item[]) {
    this.items = items;
    this.cap = CAP_MULTIPLIER * insuranceSum(items);
    this.remainingCap = this.cap;
  }

  /** Count how many covered items of each type this policy has. */
  private itemCountsByType(): Map<string, number> {
    const counts = new Map<string, number>();
    for (const item of this.items) {
      counts.set(item.type, (counts.get(item.type) ?? 0) + 1);
    }
    return counts;
  }

  /**
   * Match each damage entry to a distinct covered item of the same type.
   * Damages are consumed in order; if there are more damages of a type than
   * covered items, the claim is invalid.
   */
  private matchDamages(damages: Damage[]): Item[] {
    const available = new Map<string, Item[]>();
    for (const item of this.items) {
      const list = available.get(item.type) ?? [];
      list.push(item);
      available.set(item.type, list);
    }

    const matched: Item[] = [];
    for (const damage of damages) {
      if (damage.amount < 0) {
        throw new InvalidClaimError(
          `Damage amount must not be negative: ${damage.amount}`,
        );
      }
      const list = available.get(damage.itemType);
      if (!list || list.length === 0) {
        throw new InvalidClaimError(
          `Damaged item not covered by policy: ${damage.itemType}`,
        );
      }
      matched.push(list.shift()!);
    }
    return matched;
  }

  /**
   * Reimbursement for a single damage after clauses and deductible (>= 0).
   *
   * When both the high-enchantment (≥ 8) and dragon-material clauses apply, the
   * 50 % rule wins. Dragon material otherwise reimburses in full; so does a
   * plain item. The deductible is then subtracted.
   */
  private reimburse(item: Item, amount: number): number {
    // The high-enchantment clause (≥ 8) reimburses at 50 % and wins over the
    // dragon-material clause. Dragon material and plain items are reimbursed in
    // full, so both fall through to the full amount below.
    const highlyEnchanted =
      (item.enchantment ?? 0) >= HIGH_ENCHANTMENT_CLAIM_THRESHOLD;
    const reimbursable = highlyEnchanted
      ? amount * HIGH_ENCHANTMENT_REIMBURSEMENT
      : amount;
    return Math.max(0, reimbursable - DEDUCTIBLE);
  }

  /**
   * Process a claim against this policy, mutating the remaining cap.
   * Returns the (rounded, in MHPCO's favor) payout and the remaining cap.
   */
  processClaim(incident: Incident): { payout: number; remainingCap: number } {
    const matched = this.matchDamages(incident.damages);

    let payout = 0;
    for (let i = 0; i < matched.length; i++) {
      payout += this.reimburse(matched[i], incident.damages[i].amount);
    }

    // Payout is capped by the remaining cap; round down (MHPCO's favor).
    const cappedPayout = Math.min(payout, this.remainingCap);
    const finalPayout = Math.floor(cappedPayout);
    this.remainingCap -= finalPayout;

    return { payout: finalPayout, remainingCap: this.remainingCap };
  }
}
