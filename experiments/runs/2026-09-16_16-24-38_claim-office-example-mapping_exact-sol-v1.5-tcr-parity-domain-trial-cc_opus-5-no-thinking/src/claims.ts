import { type Item } from "./price-list.js";

const DEDUCTIBLE = 100;
const REDUCED_REIMBURSEMENT = 0.5;
const REDUCED_REIMBURSEMENT_LEVEL = 8;

/** Payouts are rounded down: to whole G in the MHPCO's favor. */
const roundPayoutInMHPCOFavour = Math.floor;

export interface Damage {
  itemType: string;
  amount: number;
}

export interface Policy {
  items: Item[];
  remainingCap: number;
}

interface DamagedItem {
  damage: Damage;
  insured: Item;
}

/** Damage to strongly enchanted items is reimbursed at half; a deductible applies per damage event. */
function reimbursementRate(item: Item): number {
  return (item.enchantment ?? 0) >= REDUCED_REIMBURSEMENT_LEVEL ? REDUCED_REIMBURSEMENT : 1;
}

/** The MHPCO does not accept a damage report for a negative amount. */
function reportedDamage(damage: Damage): number {
  if (damage.amount < 0) {
    throw new Error(`A damage amount cannot be negative, but was ${damage.amount}`);
  }
  return damage.amount;
}

function damagePayout(damage: Damage, item: Item): number {
  return Math.max(0, reportedDamage(damage) * reimbursementRate(item) - DEDUCTIBLE);
}

/** The total payout per policy is capped at twice the insurance sum. */
function withinRemainingCap(claimed: number, remainingCap: number): number {
  return Math.min(claimed, remainingCap);
}

/**
 * A claim is honoured only for items the policy covers, and each damage entry is
 * settled against a distinct insured item.
 */
function assignDamagesToInsuredItems(policy: Policy, damages: Damage[]): DamagedItem[] {
  const unclaimed = [...policy.items];
  return damages.map((damage) => {
    const position = unclaimed.findIndex((item) => item.type === damage.itemType);
    if (position < 0) {
      throw new Error(`The policy does not cover a further item of type "${damage.itemType}"`);
    }
    return { damage, insured: unclaimed.splice(position, 1)[0] };
  });
}

export function settleClaim(policy: Policy, damages: Damage[]): { payout: number; remainingCap: number } {
  const claimed = assignDamagesToInsuredItems(policy, damages).reduce(
    (sum, { damage, insured }) => sum + damagePayout(damage, insured),
    0,
  );
  const payout = roundPayoutInMHPCOFavour(withinRemainingCap(claimed, policy.remainingCap));
  policy.remainingCap -= payout;
  return { payout, remainingCap: policy.remainingCap };
}
