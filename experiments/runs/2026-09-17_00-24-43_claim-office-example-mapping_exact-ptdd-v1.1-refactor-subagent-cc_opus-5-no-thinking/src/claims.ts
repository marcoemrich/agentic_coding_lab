/**
 * How MHPCO settles a damage report against a policy.
 *
 * This module owns the office's claims rulings: what it deducts from every
 * damage event and what it is willing to reimburse. It knows nothing about
 * premiums — a policy costs what it costs, and a claim pays what it pays.
 */

import { type Item } from "./item.js";

/** A single damaged item in a damage report. */
export interface Damage {
  readonly itemType: string;
  readonly amount: number;
}

/** A damage report submitted against a policy. */
export interface Incident {
  readonly cause: string;
  readonly damages: readonly Damage[];
}

/** MHPCO reimburses the whole damage amount when no clause reduces it. */
const FULL_SHARE = 1;
const HALF_SHARE = 0.5;

/**
 * A reimbursement clause: a property of a damaged item the office has ruled on,
 * and the share of the damage amount that clause grants.
 */
interface ReimbursementClause {
  readonly appliesTo: (damagedItem: Item) => boolean;
  readonly share: number;
}

/**
 * A highly enchanted item is held to be beyond the office's ordinary means of
 * restoration, so MHPCO reimburses only half of such a damage.
 */
const HALF_REIMBURSEMENT_FROM_ENCHANTMENT = 8;

/** Dragon-forged goods are the office's pride; it reimburses them in full. */
const FULLY_REIMBURSED_MATERIAL = "dragon";

/**
 * The office's register of reimbursement clauses. Each entry is an independent
 * ruling: a further clause is added here, and the property or share of an
 * existing one is revised here, without touching the deductible or the cap.
 */
const REIMBURSEMENT_CLAUSES: readonly ReimbursementClause[] = [
  {
    appliesTo: (damagedItem) =>
      (damagedItem.enchantment ?? 0) >= HALF_REIMBURSEMENT_FROM_ENCHANTMENT,
    share: HALF_SHARE,
  },
  {
    appliesTo: (damagedItem) => damagedItem.material === FULLY_REIMBURSED_MATERIAL,
    share: FULL_SHARE,
  },
];

/**
 * The share of a damage amount MHPCO accepts before taking its deductible.
 *
 * When several clauses apply at once the office grants the least generous of
 * them — a dragon-forged sword of enchantment 9 is reimbursed at half, not in
 * full — and an item no clause speaks to is reimbursed in full.
 */
function acceptedShare(damagedItem: Item): number {
  const shares = REIMBURSEMENT_CLAUSES.filter((clause) => clause.appliesTo(damagedItem)).map(
    (clause) => clause.share,
  );
  return Math.min(FULL_SHARE, ...shares);
}

/**
 * MHPCO will never pay out more than twice what a policy insures in total,
 * however many claims are made against it.
 */
const CAP_MULTIPLE_OF_INSURANCE_SUM = 2;

/** The total MHPCO is willing to pay out over the life of a policy. */
export function payoutCap(insuranceSum: number): number {
  return insuranceSum * CAP_MULTIPLE_OF_INSURANCE_SUM;
}

/** How much of a reimbursement the cap lets through, and what is left of it. */
export interface CappedPayout {
  readonly payout: number;
  readonly remainingCap: number;
}

/**
 * Holds a reimbursement to what the policy's cap still allows: the office pays
 * the lesser of what it owes and what its cap still permits, and whatever is
 * left of the cap stands available to later claims against the same policy.
 */
export function capPayout(reimbursement: number, remainingCap: number): CappedPayout {
  const payout = Math.min(reimbursement, remainingCap);
  return { payout, remainingCap: remainingCap - payout };
}

/** MHPCO deducts a fixed excess from every damage event it settles. */
const DEDUCTIBLE_G = 100;

/**
 * What MHPCO reimburses for a single damaged item: the share of the damage its
 * clauses accept, less the deductible it keeps on every damage event.
 */
function damageReimbursement(damage: Damage, damagedItem: Item): number {
  if (damage.amount < 0) {
    throw new Error(`a damage cannot be worth less than nothing: ${damage.amount}`);
  }
  return damage.amount * acceptedShare(damagedItem) - DEDUCTIBLE_G;
}

/**
 * What MHPCO owes for a whole damage report, before its cap is applied: the
 * office settles a report damage entry by damage entry and owes the sum, so a
 * dragon attack on a sword and an amulet costs the office two deductibles, not
 * one. Which insured item an entry refers to is a coverage question the caller
 * answers; this ruling only knows that entries are settled one by one.
 */
export function incidentReimbursement(
  incident: Incident,
  insuredItemFor: (damage: Damage) => Item,
): number {
  return incident.damages.reduce(
    (total, damage) => total + damageReimbursement(damage, insuredItemFor(damage)),
    0,
  );
}
