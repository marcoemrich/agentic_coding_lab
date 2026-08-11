import { insuranceSum } from './premium.js';
import { lookup } from './catalog.js';
import { ClaimOfficeError, type Incident, type Item } from './types.js';

const DEDUCTIBLE = 100;
const CAP_FACTOR = 2;
const HIGH_ENCHANTMENT_THRESHOLD = 8;
const HIGH_ENCHANTMENT_RATE = 0.5;

export interface Policy {
  items: Item[];
  insuranceSum: number;
  remainingCap: number;
}

export function createPolicy(items: Item[]): Policy {
  const sum = insuranceSum(items);
  return { items, insuranceSum: sum, remainingCap: sum * CAP_FACTOR };
}

/**
 * Reimbursement for one damaged item, before the deductible.
 *
 * Highly enchanted items are reimbursed at 50 %; everything else is reimbursed
 * in full — which is also what the dragon-material clause grants, so that
 * clause only matters where it loses to the 50 % rule.
 */
function reimbursement(item: Item, amount: number): number {
  const highlyEnchanted = (item.enchantment ?? 0) >= HIGH_ENCHANTMENT_THRESHOLD;
  return highlyEnchanted ? amount * HIGH_ENCHANTMENT_RATE : amount;
}

/**
 * Settles one incident against the policy, consuming its remaining cap.
 *
 * Each damage entry is a separate damage event with its own deductible and is
 * matched to a distinct insured item of that type; a claim naming more items
 * of a type than the policy covers is rejected in full.
 */
export function settleClaim(
  policy: Policy,
  incident: Incident,
): { payout: number; remainingCap: number } {
  const available = new Map<string, Item[]>();
  for (const item of policy.items) {
    const bucket = available.get(item.type);
    if (bucket) {
      bucket.push(item);
    } else {
      available.set(item.type, [item]);
    }
  }

  let total = 0;
  for (const damage of incident.damages) {
    lookup(damage.itemType); // rejects unknown types
    if (damage.amount < 0) {
      throw new ClaimOfficeError(`negative damage amount: ${damage.amount}`);
    }
    const insured = available.get(damage.itemType)?.shift();
    if (!insured) {
      throw new ClaimOfficeError(`item not covered by the policy: ${damage.itemType}`);
    }
    total += Math.max(0, reimbursement(insured, damage.amount) - DEDUCTIBLE);
  }

  const payout = Math.floor(Math.min(total, policy.remainingCap));
  policy.remainingCap -= payout;
  return { payout, remainingCap: policy.remainingCap };
}
