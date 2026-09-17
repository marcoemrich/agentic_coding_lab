/**
 * The MHPCO claim office: it settles a damage report against an open policy. It
 * answers what the office pays for a reported damage -- what the damage is worth
 * under the policy's clauses, and what the office's settlement conventions then
 * deduct from it. It knows nothing about what a policy costs to take out; that
 * is the quote's business.
 */

import { insuranceValueOf, type Item } from "./price-list.js";

export interface Damage {
  itemType: string;
  amount: number;
}

export interface Incident {
  cause: string;
  damages: Damage[];
}

export interface Policy {
  items: Item[];
  cap: number;
  /** What is left of the cap after the claims already paid on this policy. */
  remainingCap: number;
}

export interface ClaimResult {
  payout: number;
  remainingCap: number;
}

const CAP_MULTIPLE_OF_INSURANCE_SUM = 2;

/** The sum a policy insures, read off the price list for the items it covers. */
export function insuranceSum(policy: Policy): number {
  return insuranceValueOf(policy.items);
}

/**
 * Opening a policy fixes the cover it grants: the office caps its total payout at
 * twice the insurance sum of the items presented. The cap is fixed from the
 * items' own insurance values, so no premium modifier can raise it.
 */
export function openPolicy(items: Item[]): Policy {
  const cap = CAP_MULTIPLE_OF_INSURANCE_SUM * insuranceValueOf(items);
  return { items, cap, remainingCap: cap };
}

const DEDUCTIBLE_PER_DAMAGE = 100;

const HALF_REIMBURSEMENT_ENCHANTMENT_LEVEL = 8;
const HALF_REIMBURSEMENT_PERCENT = 50;
const PERCENT = 100;

/**
 * The claim office's enchantment threshold, deliberately its own rule. The price
 * list also reads an enchantment level off an item, but for an unrelated purpose
 * and at an unrelated level (>= 5, a premium risk surcharge). The two thresholds
 * share no cause: moving one does not move the other, which is why the office
 * keeps them apart rather than naming them alike.
 */
function qualifiesForHalfReimbursement(item: Item): boolean {
  return (item.enchantment ?? 0) >= HALF_REIMBURSEMENT_ENCHANTMENT_LEVEL;
}

/**
 * What a reported damage is worth under the policy's clauses. A deeply enchanted
 * item is reimbursed at half its damage; an item no clause speaks to is
 * reimbursed in full.
 *
 * The office also names a dragon-material clause, and it is deliberately absent
 * here rather than overlooked. That clause grants full reimbursement -- which is
 * already what an item no clause speaks to receives -- so it can only change an
 * outcome by overriding a *reducing* clause. Against the sole reducing clause the
 * office has, the half-reimbursement rule, it does not: a dragon-material sword
 * at enchantment 8 or 9 is valued at half, not in full. So under every rule the
 * office currently holds, a dragon branch would return exactly what this fallback
 * returns. Writing it would not encode the clause; it would encode a precedence
 * decision between dragon material and some future reducing clause, and the
 * office has not made that decision. When a reducing clause appears that dragon
 * material is meant to outrank, that precedence becomes observable and belongs
 * here then.
 */
function reimbursementFor(damage: Damage, item: Item): number {
  if (qualifiesForHalfReimbursement(item)) {
    return (damage.amount * HALF_REIMBURSEMENT_PERCENT) / PERCENT;
  }
  return damage.amount;
}

/**
 * The insured items a policy has still to answer for in one incident, taken as
 * the policy's own list so that claiming them off spends nothing the policy
 * keeps. An incident draws its items from here and nowhere else, which is what
 * lets `claimDamagedItem` refuse a damage the policy has already answered for.
 */
function unclaimedItems(policy: Policy): Item[] {
  return [...policy.items];
}

/**
 * The insured item a reported damage refers to, claimed from those the incident
 * has not spoken for yet, and matched on item type alone. A damage the office
 * can match to nothing is refused rather than settled -- it will not pay against
 * cover it never granted. An uninsured type, an unknown type, and one entry too
 * many of an insured type all meet the same refusal here, and deliberately so:
 * each names a damage to something this policy does not answer for. The price
 * list's separate refusal of unlisted types answers a different question -- what
 * the office is willing to insure at all.
 */
function claimDamagedItem(unclaimed: Item[], damage: Damage): Item {
  const index = unclaimed.findIndex((insured) => insured.type === damage.itemType);
  if (index === -1) {
    throw new Error(`The policy does not cover an item of type "${damage.itemType}"`);
  }
  return unclaimed.splice(index, 1)[0];
}

/**
 * Settling turns a reimbursement into the sum actually paid. The deductible is
 * the MHPCO's settlement convention, not a clause: it is charged per damage
 * event, after the reimbursement is valued, and never turns a payout negative.
 */
function settleReimbursement(reimbursement: number): number {
  return Math.max(reimbursement - DEDUCTIBLE_PER_DAMAGE, 0);
}

/**
 * A damage is a loss the office may be asked to make good, so it cannot be
 * negative: a negative amount is not a smaller claim but a nonsensical one, and
 * the office refuses it rather than reading it as no loss at all.
 */
function refuseNonsensicalAmount(damage: Damage): void {
  if (damage.amount < 0) {
    throw new Error(
      `A damage cannot be reported as a negative amount, but "${damage.itemType}" reports ${damage.amount}`,
    );
  }
}

/**
 * The office's whole decision about one reported damage: refuse it if it is
 * nonsensical, claim the insured item it refers to, value it under the policy's
 * clauses, then settle that reimbursement. What the office then does with
 * several such sums -- adding them up and charging them against the policy's
 * remaining cap -- is the claim's business, not this one's.
 */
function settleDamage(unclaimed: Item[], damage: Damage): number {
  refuseNonsensicalAmount(damage);
  return settleReimbursement(reimbursementFor(damage, claimDamagedItem(unclaimed, damage)));
}

/**
 * What the office would pay for an incident on the strength of its damages
 * alone: every reported damage settled under the policy's clauses, added up.
 * This is what the claim *desires* to pay -- a separate question from what the
 * policy's remaining cover then permits it to actually pay.
 */
function desiredPayout(policy: Policy, incident: Incident): number {
  const unclaimed = unclaimedItems(policy);
  return incident.damages.reduce((total, damage) => total + settleDamage(unclaimed, damage), 0);
}

/**
 * The cover side of the office's ledger, the counterpart of `openPolicy`: what
 * the policy actually permits the office to pay towards a desired sum, and what
 * that leaves. A claim may draw no more than the cover still standing, so a
 * desire that would exceed it is reduced to whatever remains; what is drawn is
 * then gone from the policy for good.
 *
 * This is where the office's cap rule is revised -- a per-incident sub-cap or a
 * cover that reinstates would change this line and `openPolicy`, and nothing
 * about how a damage is valued or settled.
 */
function drawDownCover(policy: Policy, desired: number): number {
  const drawn = Math.min(desired, policy.remainingCap);
  policy.remainingCap -= drawn;
  return drawn;
}

/**
 * MHPCO rounds a payout down: every fraction of a G it would owe stays in the
 * office's coffers. Only the final payout is rounded -- the clause valuations and
 * the deductible before it are kept as exact fractions -- and it is rounded before
 * the cover is drawn, so the cap is only ever charged what the office actually pays.
 *
 * This is the paying side of the office's single rounding principle; the quote
 * holds the collecting side and rounds the other way. The shared principle is a
 * direction ("in the MHPCO's favor"), not a shared calculation: the direction is
 * fixed by which way the money moves, so there is nothing for the two sides to
 * share but the phrase. They are revised independently.
 */
function roundPayoutInMHPCOsFavor(payout: number): number {
  return Math.floor(payout);
}

/**
 * The office pays what the incident's damages come to, so far as the policy's
 * remaining cover permits.
 */
export function claim(policy: Policy, incident: Incident): ClaimResult {
  const payout = drawDownCover(
    policy,
    roundPayoutInMHPCOsFavor(desiredPayout(policy, incident)),
  );
  return { payout, remainingCap: policy.remainingCap };
}
