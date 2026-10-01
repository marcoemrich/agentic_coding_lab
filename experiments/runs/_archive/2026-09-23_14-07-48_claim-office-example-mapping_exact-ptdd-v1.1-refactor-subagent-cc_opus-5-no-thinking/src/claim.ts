import type { Item } from "./insured-item.js";
import { amountOwedByMhpco } from "./mhpcos-favor.js";
import { insuranceValue } from "./price-list.js";

export interface Damage {
  itemType: string;
  amount: number;
}

export interface Incident {
  cause: string;
  damages: Damage[];
}

export interface Policy {
  insuredItems: Item[];
  // How much the MHPCO may still pay out over this policy's lifetime. This is
  // the single figure the MHPCO tracks per policy: opening the policy sets it
  // to the full cap, and each claim depletes it. The insurance sum it is
  // derived from is never reported on its own.
  remainingCap: number;
}

export interface ClaimResult {
  payout: number;
  remainingCap: number;
  // The policy as it stands after this claim, for settling the next one.
  policy: Policy;
}

const DEDUCTIBLE_PER_DAMAGE = 100;
const CAP_MULTIPLE_OF_INSURANCE_SUM = 2;

// The MHPCO insures a policy for the sum of its items' insurance values.
function insuranceSum(insuredItems: Item[]): number {
  return insuredItems
    .map(insuranceValue)
    .reduce((sum, value) => sum + value, 0);
}

// The MHPCO pays out at most twice the insurance sum over a policy's lifetime.
// A policy is opened with that whole cap intact; each claim depletes it.
export function openPolicy(insuredItems: Item[]): Policy {
  return {
    insuredItems,
    remainingCap: insuranceSum(insuredItems) * CAP_MULTIPLE_OF_INSURANCE_SUM,
  };
}

const HIGH_ENCHANTMENT_CLAIM_LEVEL = 8;
const HIGH_ENCHANTMENT_REIMBURSEMENT_RATE = 0.5;
const FULL_REIMBURSEMENT_RATE = 1;

// A damage entry names only the type of the item it befell, so the MHPCO
// identifies the covering item no further than the policy's first insured item
// of that type. Where a policy covers several alike items this is a deliberate
// approximation: alike items share the traits the reimbursement clauses read,
// so any of them yields the same clause.
function firstInsuredItemCoveringDamage(
  policy: Policy,
  damage: Damage,
): Item | undefined {
  return policy.insuredItems.find((item) => item.type === damage.itemType);
}

// The conditions on which the MHPCO accepts a single damage entry, each
// readable from that entry alone: it settles a damage only against an item the
// policy actually covers, and a damage event reports what was lost, so its
// amount cannot be negative. An entry that fails either condition is refused,
// and the whole claim with it. Accepting an entry yields the covering item,
// since establishing coverage is what finds it.
function acceptedDamageEntryCover(policy: Policy, damage: Damage): Item {
  const covering = firstInsuredItemCoveringDamage(policy, damage);
  if (covering === undefined) {
    throw new Error(`the policy does not cover "${damage.itemType}"`);
  }
  if (damage.amount < 0) {
    throw new Error(
      `a damage amount cannot be negative, but "${damage.itemType}" reports ${damage.amount}`,
    );
  }
  return covering;
}

function isHighlyEnchanted(item: Item): boolean {
  return (item.enchantment ?? 0) >= HIGH_ENCHANTMENT_CLAIM_LEVEL;
}

// Which reimbursement clause covers the damaged item. Damage to a highly
// enchanted item is reimbursed at half; all other damage in full.
// The dragon-material clause is subsumed by that default: it reimburses in
// full, and where it meets the high-enchantment clause the 50 % rate wins, so
// it never changes a payout and needs no branch of its own.
// Every item reaching a clause is one the policy covers: whether the MHPCO
// accepts the damage entry at all is settled beforehand, not here.
function reimbursementRateFor(item: Item): number {
  return isHighlyEnchanted(item)
    ? HIGH_ENCHANTMENT_REIMBURSEMENT_RATE
    : FULL_REIMBURSEMENT_RATE;
}

// The MHPCO settles each accepted damage event separately: it reimburses the
// damage under the applicable clause, then withholds its deductible once per
// event.
function settlementForDamageEvent(policy: Policy, damage: Damage): number {
  const rate = reimbursementRateFor(acceptedDamageEntryCover(policy, damage));
  return damage.amount * rate - DEDUCTIBLE_PER_DAMAGE;
}

function countByType(types: string[]): Map<string, number> {
  const counts = new Map<string, number>();
  for (const type of types) {
    counts.set(type, (counts.get(type) ?? 0) + 1);
  }
  return counts;
}

// The condition on which the MHPCO accepts a whole incident, checked before it
// settles any of its damage entries. An incident can damage an insured item
// only once, so an incident reporting more damages of a type than the policy
// covers of it is refused, and every entry in it with it. This is the
// incident-level counterpart to the per-entry conditions in
// acceptedDamageEntryCover: it reads the damages as a whole, which no single
// entry can.
function acceptIncidentAgainstInsuredItems(
  policy: Policy,
  incident: Incident,
): void {
  const insured = countByType(policy.insuredItems.map((item) => item.type));
  for (const [type, damaged] of countByType(
    incident.damages.map((damage) => damage.itemType),
  )) {
    if (damaged > (insured.get(type) ?? 0)) {
      throw new Error(
        `the policy covers ${insured.get(type) ?? 0} of "${type}", but the incident reports ${damaged} damaged`,
      );
    }
  }
}

// What the MHPCO owes for the whole incident before rounding: every damage
// event settled under its clause, reduced to what the policy's lifetime cap
// still allows.
function cappedSettlement(policy: Policy, incident: Incident): number {
  const settled = incident.damages
    .map((damage) => settlementForDamageEvent(policy, damage))
    .reduce((sum, amount) => sum + amount, 0);
  return Math.min(settled, policy.remainingCap);
}

export function claim(policy: Policy, incident: Incident): ClaimResult {
  acceptIncidentAgainstInsuredItems(policy, incident);
  // A payout is owed by the MHPCO, so its fraction is rounded down. Only this
  // final amount is rounded; the settlement above stays fractional. Rounding
  // last is safe for a capped claim too: the cap is always a whole number of
  // G, so rounding a capped settlement changes nothing.
  const payout = amountOwedByMhpco(cappedSettlement(policy, incident));
  const remainingCap = policy.remainingCap - payout;
  return { payout, remainingCap, policy: { ...policy, remainingCap } };
}
