/** The claims office: what the MHPCO pays out when an insured item is damaged.
 *  Every decision here belongs to the claims handbook -- the deductible, the
 *  special clauses, the cap on a policy -- and is revised independently of the
 *  tariff that priced the policy. */

import { insuranceValue, type Item } from "./item-catalog.js";
import { amountPaidInMHPCOsFavour } from "./rounding.js";

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
  /** What the MHPCO has already paid out on this policy against its cap. */
  capConsumed: number;
}

export interface ClaimResult {
  payout: number;
  remainingCap: number;
}

const DEDUCTIBLE_PER_DAMAGE = 100;

/** The MHPCO never pays out more than twice the sum a policy insures. */
const CAP_MULTIPLE_OF_INSURANCE_SUM = 2;

/** From enchantment level 8 upwards the handbook reimburses only half the
 *  damage: powerful enchantments are held to attract their own misfortune.
 *  This is the only clause the handbook reads *down* from full reimbursement,
 *  so it outranks the dragon-material clause whenever both cover an item. */
const HIGH_ENCHANTMENT_CLAUSE_THRESHOLD = 8;
const HIGH_ENCHANTMENT_CLAUSE_SHARE = 0.5;

/** The MHPCO opens a policy over the items a quote covered. */
export function createPolicy(items: Item[]): Policy {
  return { items, capConsumed: 0 };
}

/** The MHPCO bears its deductible against a damage; it never turns the
 *  deductible round into a charge the customer owes the office. A damage
 *  smaller than the deductible is simply not reimbursed. */
function neverACharge(reimbursement: number): number {
  return Math.max(reimbursement, 0);
}

/** Whether the handbook's high-enchantment clause covers a damaged item. */
function fallsUnderHighEnchantmentClause(item: Item): boolean {
  return (item.enchantment ?? 0) >= HIGH_ENCHANTMENT_CLAUSE_THRESHOLD;
}

/** The amount of a damage the handbook reimburses, before the deductible is
 *  kept back. Full reimbursement is what the office grants unless a clause cuts
 *  it down, and the high-enchantment clause is the only clause that cuts.
 *
 *  The handbook's dragon-material clause -- damage to items made of dragon
 *  material is fully reimbursed -- is therefore already honoured here: it grants
 *  exactly what the default grants, so no dragon branch is written. Should a
 *  future clause reduce reimbursement for some *other* reason, dragon material
 *  would have to be read as an exemption from it, and would then need a branch
 *  of its own. */
function reimbursedAmount(damage: Damage, item: Item): number {
  if (fallsUnderHighEnchantmentClause(item)) {
    return damage.amount * HIGH_ENCHANTMENT_CLAUSE_SHARE;
  }
  return damage.amount;
}

/** The handbook's reimbursement decision for one damage event: the clauses
 *  decide the reimbursed amount, from which the MHPCO keeps back its
 *  deductible. */
function reimbursementForDamage(damage: Damage, item: Item): number {
  return neverACharge(reimbursedAmount(damage, item) - DEDUCTIBLE_PER_DAMAGE);
}

/** One reported damage, matched to the covered item it refers to. */
interface MatchedDamage {
  damage: Damage;
  item: Item;
}

/** Whether the office entertains a reported damage at all, judged on the entry
 *  itself and without consulting the cover. A damage is a loss the customer
 *  suffered, so an entry claiming a negative amount is not an understated claim
 *  the office could settle at nothing -- it is not a damage report at all, and
 *  the office refuses the whole claim rather than reading past it.
 *
 *  This is the office's admission policy, and it is revised independently of how
 *  a report is read against the cover: a new ground of refusal is a rule added
 *  here, and a change to how damages are assigned to covered items leaves it
 *  untouched. */
function refuseInadmissibleDamage(damage: Damage): void {
  if (damage.amount < 0) {
    throw new Error(`a damage report cannot claim a negative amount of ${damage.amount} G`);
  }
}

/** Which covered item each reported damage refers to. The office reads a
 *  damage report against the policy's *cover*: a damage names an item type, and
 *  the office assigns it one of the items the policy covers of that type. Two
 *  entries of the same type are two damages against two covered swords, not the
 *  same sword claimed twice, so a matched item is struck off the cover and the
 *  next entry of that type must find another.
 *
 *  A report naming an item the policy does not cover, or naming more items of a
 *  type than the policy covers, fails here: that is a failure of the cover, not
 *  of the entry's own form, so an unmatchable entry stops the claim rather than
 *  being settled against nothing. */
function matchDamagesToCover(policy: Policy, damages: Damage[]): MatchedDamage[] {
  const unclaimedCover = [...policy.items];
  return damages.map((damage) => {
    const covered = unclaimedCover.findIndex((item) => item.type === damage.itemType);
    if (covered < 0) {
      throw new Error(
        `the policy covers no further ${damage.itemType} for this damage report`,
      );
    }
    const [item] = unclaimedCover.splice(covered, 1);
    return { damage, item };
  });
}

/** The damages of an incident the office admits to settlement: every entry is
 *  first judged admissible on its own terms, then read against the policy's
 *  cover. A report that fails either test is refused whole -- the office does
 *  not settle the admissible part of a bad report. */
function admitDamages(policy: Policy, damages: Damage[]): MatchedDamage[] {
  damages.forEach(refuseInadmissibleDamage);
  return matchDamagesToCover(policy, damages);
}

/** The sum a policy insures: the insurance values of all covered items. The
 *  block discount on the premium does not reduce what the items are insured
 *  for. */
function insuranceSum(policy: Policy): number {
  return policy.items.reduce((sum, item) => sum + insuranceValue(item), 0);
}

/** The most the MHPCO will ever pay out on a policy. */
function payoutCap(policy: Policy): number {
  return insuranceSum(policy) * CAP_MULTIPLE_OF_INSURANCE_SUM;
}

/** What the handbook reimburses for a whole incident: every admitted damage
 *  settled on its own terms -- its own clauses, its own deductible -- and the
 *  reimbursements added up. This is the claim before the cap is consulted; how
 *  far the policy's cap bounds it is a separate decision. */
function reimbursementForIncident(admitted: MatchedDamage[]): number {
  return admitted.reduce(
    (sum, { damage, item }) => sum + reimbursementForDamage(damage, item),
    0,
  );
}

/** What is left of a policy's cap: the cap itself, less what the MHPCO has
 *  already paid out on it. */
function remainingCap(policy: Policy): number {
  return payoutCap(policy) - policy.capConsumed;
}

/** What the MHPCO actually pays for an incident: what the handbook reimburses,
 *  but never more than the policy's cap still allows. A claim that asks for more
 *  than is left is settled at what is left. */
function settledPayout(policy: Policy, admitted: MatchedDamage[]): number {
  const bounded = Math.min(reimbursementForIncident(admitted), remainingCap(policy));
  return amountPaidInMHPCOsFavour(bounded);
}

/** The office's ledger entry against the policy: a settled payout consumes that
 *  much of the policy's cap, once and for good. This is what makes a claim a
 *  command rather than a calculation -- the cap a later claim finds is the cap
 *  this one left behind. */
function recordAgainstCap(policy: Policy, payout: number): void {
  policy.capConsumed += payout;
}

/** The MHPCO settles one incident against a policy: it decides what the claim is
 *  worth under the handbook and the policy's remaining cap, enters that payout
 *  in the policy's ledger, and reports the payout with the cap that survives it.
 *  Admitting the report against the cover comes first and on its own: a report
 *  the office refuses is refused before any amount is decided, so whether a
 *  claim is entertained at all changes independently of what it is worth.
 *  Deciding the amount and recording it are separate acts here, so that a change
 *  to how a payout is arrived at is necessarily also what gets recorded. */
export function claim(policy: Policy, incident: Incident): ClaimResult {
  const admitted = admitDamages(policy, incident.damages);
  const payout = settledPayout(policy, admitted);
  recordAgainstCap(policy, payout);
  return { payout, remainingCap: remainingCap(policy) };
}
