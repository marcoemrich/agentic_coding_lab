import type { Item } from "./policy.js";
import { enchantmentLevelOf } from "./policy.js";

/**
 * The special clauses that decide what share of a damage the MHPCO
 * reimburses. Which clauses exist, what each grants, and which one wins when
 * several apply is a policy table the MHPCO revises on its own schedule --
 * independently of the deductible, of how a damage entry is matched to an
 * insured item, and of the cap. It is kept here so that revising a clause
 * means editing this list and nothing else.
 *
 * The share is stated before the deductible: a clause reduces what counts as
 * reimbursable damage, and the deductible is taken off whatever remains.
 */

/** Damage to a highly enchanted item is reimbursed at half its amount. */
const HIGH_ENCHANTMENT_REIMBURSEMENT_RATE = 0.5;
const HIGH_ENCHANTMENT_CLAIM_LEVEL = 8;

/**
 * An item that qualifies for no special clause at all is reimbursed in full;
 * the deductible is the only thing the policyholder bears. This is the
 * absence of a clause rather than a clause of its own -- a distinction that
 * matters, because a clause that grants full reimbursement in its own right
 * can still be overridden by a stronger one, whereas this fallback is
 * whatever is left when nothing applies.
 *
 * The spec's dragon-material clause ("damage to items made of dragon
 * material is fully reimbursed") has deliberately not been written as a
 * clause of its own, because under the present clause set it cannot change
 * any payout. It would grant rate 1, which is what the fallback already
 * grants, and where it competes with the high-enchantment clause the spec
 * has the 50 % rule win -- so dragon material and no clause at all settle
 * identically for every item, at every enchantment level. All three of the
 * spec's dragon examples (enchantment 5 -> 700, 8 -> 400, 9 -> 400) are
 * satisfied here without reading `material` at all.
 *
 * This stops being true the moment a clause is added that grants less than
 * full reimbursement and that dragon material should override. At that
 * point dragon material becomes observable and earns its own entry.
 */
const NO_CLAUSE_REIMBURSEMENT_RATE = 1;

/**
 * The claim office's own enchantment threshold, deliberately not shared with
 * the premium side's. Both read the same item property, but they answer
 * different questions -- what a risk costs to insure against, versus what it
 * settles at -- and the spec fixes them at different levels and lets them
 * move apart. An item at enchantment 6 carries the premium surcharge and
 * still gets reimbursed in full.
 */
function qualifiesForHighEnchantmentClause(item: Item): boolean {
  return enchantmentLevelOf(item) >= HIGH_ENCHANTMENT_CLAIM_LEVEL;
}

/** What share of a damage the MHPCO reimburses, before the deductible. */
export function reimbursementRateOf(item: Item): number {
  return qualifiesForHighEnchantmentClause(item)
    ? HIGH_ENCHANTMENT_REIMBURSEMENT_RATE
    : NO_CLAUSE_REIMBURSEMENT_RATE;
}
