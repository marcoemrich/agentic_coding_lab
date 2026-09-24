/** MHPCO claim settlement: pays out damages against one policy's insured items. */
import type { Item } from "./premium.js";
import { priceOf } from "./priceList.js";

export interface Damage {
  itemType: string;
  amount: number;
}

export interface ClaimResult {
  payout: number;
  remainingCap: number;
}

const DEDUCTIBLE_PER_DAMAGE = 100;
const CAP_MULTIPLIER = 2;
const HIGH_ENCHANTMENT_CLAUSE_LEVEL = 8;
const HIGH_ENCHANTMENT_REIMBURSEMENT_RATE = 0.5;
const FULL_REIMBURSEMENT_RATE = 1;

function insuranceValueOf(item: Item): number {
  return priceOf(item.type).insuranceValue;
}

function insuranceSumOf(items: Item[]): number {
  return items.reduce((sum, item) => sum + insuranceValueOf(item), 0);
}

/** An insurance policy: the insured items and the part of its payout cap not yet paid out. */
export interface Policy {
  items: Item[];
  remainingCap: number;
}

/** The total payout per policy is capped at twice the insurance sum. */
function payoutCapOf(policyItems: Item[]): number {
  return CAP_MULTIPLIER * insuranceSumOf(policyItems);
}

export function openPolicy(items: Item[]): Policy {
  return { items, remainingCap: payoutCapOf(items) };
}

/**
 * Damage is fully reimbursed (as the dragon-material clause also grants) unless the
 * high-enchantment clause applies; that clause wins, even for dragon material.
 */
function reimbursementRateOf(item: Item): number {
  return (item.enchantment ?? 0) >= HIGH_ENCHANTMENT_CLAUSE_LEVEL
    ? HIGH_ENCHANTMENT_REIMBURSEMENT_RATE
    : FULL_REIMBURSEMENT_RATE;
}

/** One damage event: a damage entry together with the insured item it befell. */
interface DamageEvent {
  damage: Damage;
  insuredItem: Item;
}

function payoutOf({ damage, insuredItem }: DamageEvent): number {
  return damage.amount * reimbursementRateOf(insuredItem) - DEDUCTIBLE_PER_DAMAGE;
}

/** Each damage entry befalls its own insured item; an entry with no insured item of its type left rejects the claim. */
function damageEventsOf(damages: Damage[], policyItems: Item[]): DamageEvent[] {
  const undamagedItems = [...policyItems];
  return damages.map((damage) => {
    const index = undamagedItems.findIndex((item) => item.type === damage.itemType);
    if (index < 0)
      throw new Error(
        `Damaged ${damage.itemType} is not covered: the policy insures fewer items of this type than the claim reports damaged`,
      );
    return { damage, insuredItem: undamagedItems.splice(index, 1)[0] };
  });
}

/** Payouts are rounded down to whole G, in the MHPCO's favor; only the final payout is rounded. */
function roundPayoutInMhpcoFavor(payout: number): number {
  return Math.floor(payout);
}

function assertValidDamageAmount(damage: Damage): void {
  if (damage.amount < 0) throw new Error(`Damage amount must not be negative, got ${damage.amount}`);
}

export function claim(policy: Policy, damages: Damage[]): ClaimResult {
  damages.forEach(assertValidDamageAmount);
  const unroundedPayout = damageEventsOf(damages, policy.items).reduce((sum, event) => sum + payoutOf(event), 0);
  const payout = Math.min(roundPayoutInMhpcoFavor(unroundedPayout), policy.remainingCap);
  return { payout, remainingCap: policy.remainingCap - payout };
}
