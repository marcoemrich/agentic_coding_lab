import { Item, insuranceSum, specFor } from './pricing.js';

export interface Damage {
  itemType: string;
  amount: number;
}

export interface ClaimResult {
  payout: number;
  remainingCap: number;
}

const DEDUCTIBLE = 100;
const CAP_MULTIPLIER = 2;
const HALF_REIMBURSEMENT_THRESHOLD = 8;
const DRAGON_MATERIAL = 'dragon';

export class ClaimError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'ClaimError';
  }
}

export interface PolicyState {
  items: Item[];
  remainingCap: number;
}

/**
 * Creates a policy. The cap is twice the insurance sum of the unmodified
 * item values — premium modifiers and block discounts never move it — and
 * it is consumed by successive claims over the policy's lifetime.
 */
export function Policy(items: Item[]): PolicyState {
  // specFor throws on an unknown type, rejecting the policy outright.
  const sum = insuranceSum(items);
  return { items, remainingCap: sum * CAP_MULTIPLIER };
}

/**
 * Reimbursement for one damaged item before the deductible. The 50 % clause
 * for highly enchanted items takes precedence over full dragon-material
 * reimbursement when both would apply.
 */
function reimbursement(item: Item, amount: number): number {
  // Dragon material reimburses in full — which is also the standard rate, so
  // the clause only becomes observable when it loses to the 50 % rule below.
  if ((item.enchantment ?? 0) >= HALF_REIMBURSEMENT_THRESHOLD) return amount / 2;
  return amount;
}

/**
 * Matches each damage to a distinct insured item of that type, so a policy
 * covering one sword cannot absorb two sword damages.
 */
function matchDamages(policy: PolicyState, damages: Damage[]): Item[] {
  const available = [...policy.items];
  return damages.map((damage) => {
    if (damage.amount < 0) {
      throw new ClaimError(`negative damage amount: ${damage.amount}`);
    }
    specFor(damage.itemType);
    const index = available.findIndex((item) => item.type === damage.itemType);
    if (index === -1) {
      throw new ClaimError(
        `damage to an item not covered by the policy: ${damage.itemType}`,
      );
    }
    return available.splice(index, 1)[0];
  });
}

/**
 * Settles an incident against a policy, consuming its remaining cap.
 * The deductible applies once per damaged item; the payout is rounded down
 * (the MHPCO's favour) only at the very end.
 */
export function settleClaim(
  policy: PolicyState,
  damages: Damage[],
): ClaimResult {
  const items = matchDamages(policy, damages);

  const desired = damages.reduce((sum, damage, index) => {
    const covered = reimbursement(items[index], damage.amount);
    return sum + Math.max(0, covered - DEDUCTIBLE);
  }, 0);

  const payout = Math.floor(Math.min(desired, policy.remainingCap));
  policy.remainingCap -= payout;

  return { payout, remainingCap: policy.remainingCap };
}
