import { specFor } from './catalog';
import type { Item, Policy } from './quote';

export interface Damage {
  itemType: string;
  amount: number;
}

export interface ClaimResult {
  payout: number;
  remainingCap: number;
}

export interface OpenPolicy {
  items: Item[];
  remainingCap: number;
}

const DEDUCTIBLE = 100;
const CAP_FACTOR = 2;
const HALF_REIMBURSEMENT_THRESHOLD = 8;
const HALF_REIMBURSEMENT_RATE = 0.5;

/** Rounds in the MHPCO's favour: payouts go down. */
export function roundPayout(amount: number): number {
  return Math.floor(amount);
}

export function openPolicy(policy: Policy): OpenPolicy {
  return { items: policy.items, remainingCap: policy.insuranceSum * CAP_FACTOR };
}

/**
 * Matches every damage to a distinct insured item of the same type, so that a
 * policy covering one sword cannot absorb two sword damages.
 */
function matchDamagesToItems(policy: OpenPolicy, damages: Damage[]): Item[] {
  const available = [...policy.items];
  return damages.map((damage) => {
    specFor(damage.itemType);
    if (damage.amount < 0) {
      throw new Error(`negative damage amount: ${damage.amount}`);
    }
    const index = available.findIndex((item) => item.type === damage.itemType);
    if (index < 0) {
      const insured = policy.items.some((item) => item.type === damage.itemType);
      throw new Error(
        insured
          ? `more ${damage.itemType} damages than the policy covers`
          : `item not covered by the policy: ${damage.itemType}`,
      );
    }
    return available.splice(index, 1)[0];
  });
}

/**
 * Reimbursable amount for one damage, before the deductible. Highly enchanted
 * items are reimbursed at half; everything else — including dragon material,
 * whose clause is explicit but matches the default — is reimbursed in full.
 */
function reimbursement(item: Item, amount: number): number {
  const halved = (item.enchantment ?? 0) >= HALF_REIMBURSEMENT_THRESHOLD;
  return halved ? amount * HALF_REIMBURSEMENT_RATE : amount;
}

/**
 * Settles a claim against the policy, consuming cap. Throws without touching
 * the policy if any damage entry is invalid.
 */
export function settleClaim(policy: OpenPolicy, damages: Damage[]): ClaimResult {
  const items = matchDamagesToItems(policy, damages);

  const desired = damages.reduce((sum, damage, index) => {
    return sum + Math.max(0, reimbursement(items[index], damage.amount) - DEDUCTIBLE);
  }, 0);

  const payout = roundPayout(Math.min(desired, policy.remainingCap));
  policy.remainingCap -= payout;

  return { payout, remainingCap: policy.remainingCap };
}
