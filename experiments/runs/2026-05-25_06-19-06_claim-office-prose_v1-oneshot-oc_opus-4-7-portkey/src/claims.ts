import { Item, Incident } from './types.js';
import { totalInsuranceSum } from './pricing.js';

const DEDUCTIBLE = 100;
const CAP_MULTIPLIER = 2;
const HIGH_ENCHANT_THRESHOLD = 8;
const HIGH_ENCHANT_REIMBURSEMENT = 0.5;
const DRAGON_MATERIAL = 'dragon';

export interface PolicyState {
  items: Item[];
  insuranceSum: number;
  cap: number; // remaining cap (in G)
}

export function createPolicyState(items: Item[]): PolicyState {
  const insuranceSum = totalInsuranceSum(items);
  return {
    items,
    insuranceSum,
    cap: insuranceSum * CAP_MULTIPLIER,
  };
}

/**
 * Determine the reimbursement rate for a damaged item:
 *  - dragon material: 100%
 *  - enchantment >= 8: 50%
 *  - else: 0%
 * Dragon material takes precedence over enchantment (full reimbursement).
 */
function reimbursementRate(item: Item | undefined): number {
  if (!item) return 0;
  if (item.material === DRAGON_MATERIAL) return 1.0;
  if ((item.enchantment ?? 0) >= HIGH_ENCHANT_THRESHOLD) return HIGH_ENCHANT_REIMBURSEMENT;
  return 0;
}

/**
 * Find the next matching item in the policy for a given damage entry.
 * Items are consumed (marked) so that two damages to the same item type
 * map to two different items when possible.
 */
function findItemForDamage(items: Item[], itemType: string, usedIdx: Set<number>): Item | undefined {
  for (let i = 0; i < items.length; i++) {
    if (usedIdx.has(i)) continue;
    if (items[i].type === itemType) {
      usedIdx.add(i);
      return items[i];
    }
  }
  // No remaining unused match — fall back to any item of that type (eligibility
  // is still determined by item attributes).
  return items.find(it => it.type === itemType);
}

export interface ClaimOutcome {
  payout: number;
  remainingCap: number;
}

export function processClaim(state: PolicyState, incident: Incident): ClaimOutcome {
  const used = new Set<number>();
  let reimbursable = 0;

  for (const dmg of incident.damages) {
    const item = findItemForDamage(state.items, dmg.itemType, used);
    const rate = reimbursementRate(item);
    reimbursable += dmg.amount * rate;
  }

  // Apply deductible per damage event.
  let payout = Math.max(0, reimbursable - DEDUCTIBLE);

  // Round down in MHPCO's favor (less paid out is better for the office).
  payout = Math.floor(payout);

  // Cap by remaining policy cap.
  if (payout > state.cap) payout = state.cap;

  state.cap -= payout;

  return { payout, remainingCap: state.cap };
}
