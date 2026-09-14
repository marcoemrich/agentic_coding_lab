import { specFor, DEDUCTIBLE } from './domain.js';
import type { QuoteItem } from './premium.js';

export interface Damage {
  itemType: string;
  amount: number;
}

export interface Incident {
  cause: string;
  damages: Damage[];
}

export const HIGH_ENCHANTMENT_CLAIM_THRESHOLD = 8;
export const HIGH_ENCHANTMENT_REIMBURSEMENT = 0.5;
export const DRAGON_MATERIAL = 'dragon';

export class ClaimError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'ClaimError';
  }
}

/**
 * Matches each damage entry to a distinct insured item of the same type, so
 * that two damages of one type require two insured items of that type.
 */
function matchDamagesToItems(items: QuoteItem[], damages: Damage[]): QuoteItem[] {
  const available = new Map<string, QuoteItem[]>();
  for (const item of items) {
    const list = available.get(item.type) ?? [];
    list.push(item);
    available.set(item.type, list);
  }

  return damages.map((damage) => {
    const candidates = available.get(damage.itemType);
    if (!candidates || candidates.length === 0) {
      throw new ClaimError(
        `Damage refers to ${damage.itemType}, which is not covered by the policy`,
      );
    }
    return candidates.shift() as QuoteItem;
  });
}

/**
 * Reimbursement for one damaged item before the deductible. The 50 % clause
 * for highly enchanted items wins over full dragon-material reimbursement
 * when both would apply.
 */
function reimbursementFor(item: QuoteItem, amount: number): number {
  if ((item.enchantment ?? 0) >= HIGH_ENCHANTMENT_CLAIM_THRESHOLD) {
    return amount * HIGH_ENCHANTMENT_REIMBURSEMENT;
  }
  return amount;
}

export interface ClaimOutcome {
  payout: number;
  remainingCap: number;
}

/** Rounded in the MHPCO's favor: payouts always round down. */
export function computeClaim(
  items: QuoteItem[],
  incident: Incident,
  remainingCap: number,
): ClaimOutcome {
  for (const damage of incident.damages) {
    if (damage.amount < 0) {
      throw new ClaimError(`Damage amount must not be negative: ${damage.amount}`);
    }
    // Validates the item type, raising UnknownItemTypeError for junk types.
    specFor(damage.itemType);
  }

  const matched = matchDamagesToItems(items, incident.damages);

  let desired = 0;
  incident.damages.forEach((damage, index) => {
    const reimbursed = reimbursementFor(matched[index], damage.amount);
    desired += Math.max(0, reimbursed - DEDUCTIBLE);
  });

  const payout = Math.floor(Math.min(desired, remainingCap));
  return { payout, remainingCap: remainingCap - payout };
}
