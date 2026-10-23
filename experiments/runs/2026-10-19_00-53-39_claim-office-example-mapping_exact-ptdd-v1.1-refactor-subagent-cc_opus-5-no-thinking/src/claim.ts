import { type Item, insuranceSumOf } from "./claim-office.js";

const DEDUCTIBLE_PER_DAMAGE_ENTRY = 100;
const PAYOUT_CAP_MULTIPLE = 2;
const HIGH_ENCHANTMENT_CLAIM_LEVEL = 8;
const HIGH_ENCHANTMENT_REIMBURSEMENT_SHARE = 0.5;
const UNREDUCED_REIMBURSEMENT_SHARE = 1;

export interface Damage {
  readonly itemType: string;
  readonly amount: number;
}

export interface Incident {
  readonly cause: string;
  readonly damages: readonly Damage[];
}

// What the policy covers never changes, but how much of its cap is left does:
// `remainingCap` is the office's running record of cap not yet paid out, and
// `settle` depletes it in place. A policy is therefore a standing record that
// outlives the claim being settled, and whoever holds one holds the cap's one
// authoritative figure -- two claims given the same policy share its cap, two
// given separately built policies do not.
export interface Policy {
  readonly items: readonly Item[];
  readonly insuranceSum: number;
  remainingCap: number;
}

export interface ClaimSettlement {
  readonly payout: number;
  readonly remainingCap: number;
}

// A damage entry names an insured item by type; the clauses that govern the
// payout are properties of that insured item, not of the damage report. Looking
// the item up in the policy is therefore also the office's coverage rule: a
// damage entry naming a type the policy does not cover is refused rather than
// settled, and the whole claim falls with it. An amulet damaged when only a
// sword is insured is not a payout of zero, it is a rejection. The refusal
// cannot be lifted out of the lookup -- an entry is uncovered precisely because
// the policy holds no item of its type, so resolving and refusing are one
// decision made once per entry.
//
// This one rule answers both halves of the spec's claim-side rejection bullet.
// An amulet named when only a sword is insured and a "broomstick" named at all
// are the same refusal here, because the register is consulted for a match and
// neither finds one -- so an unknown type needs no separate check against the
// office's price list. That asymmetry with the quote side is deliberate: a quote
// is priced against the office's price list, which is what makes `broomstick`
// unknown there (see `listedPriceFor`), whereas a claim is settled against one
// policy, whose item register is the only authority on what it may name. A type
// the MHPCO insures but this policy does not cover is refused just as flatly.
//
// What it resolves is which clauses govern a damage, not which physical item was
// destroyed: with two swords insured, two sword damage entries resolve to the
// same insured item, which is right because the clauses read only the item's
// attributes and alike items share them. Counting entries against items insured
// is a separate rejection rule, and this lookup deliberately does not make it --
// it answers only whether the type is covered at all.
function damagedItemFor(policy: Policy, damage: Damage): Item {
  const damagedItem = policy.items.find((item) => item.type === damage.itemType);
  if (damagedItem === undefined) {
    throw new Error(`damaged item ${damage.itemType} is not covered by the policy`);
  }
  return damagedItem;
}

function roundPayoutInOfficesFavour(payout: number): number {
  return Math.floor(payout);
}

export function policyFor(items: readonly Item[]): Policy {
  const insuranceSum = insuranceSumOf(items);
  return { items, insuranceSum, remainingCap: insuranceSum * PAYOUT_CAP_MULTIPLE };
}

// The share of the damage amount the office reimburses, decided by the clauses
// that the damaged item triggers. Damage to an item with enchantment level >= 8
// is reimbursed at 50 %; with no clause reducing it, the whole amount is
// reimbursable. The share is taken before the deductible.
//
// There is deliberately no dragon-material branch here, and adding one would be
// a mistake. The spec's clause "damage to items made of dragon material is fully
// reimbursed" asks for exactly the share this function already yields by default,
// so on its own it is indistinguishable from no clause at all (dragon sword,
// enchantment 5, damage 800 -> 800 - 100 = 700, identical to a steel sword). The
// only case where it meets another clause is enchantment >= 8, and there the spec
// says the 50 % rule wins (dragon sword, enchantment 8 or 9, damage 1000 -> 400).
// So the clause never changes a payout: it is subsumed by the unreduced share and
// loses every conflict. `Item.material` is read by no rule for that reason.
function reimbursableShareOf(damagedItem: Item): number {
  return (damagedItem.enchantment ?? 0) >= HIGH_ENCHANTMENT_CLAIM_LEVEL
    ? HIGH_ENCHANTMENT_REIMBURSEMENT_SHARE
    : UNREDUCED_REIMBURSEMENT_SHARE;
}

// One entry of the incident's `damages` array is one damage, and each one bears
// its own deductible -- a single dragon attack that damages a sword and an amulet
// deducts 100 G twice, not once.
function reimbursementFor(damage: Damage, damagedItem: Item): number {
  return damage.amount * reimbursableShareOf(damagedItem) - DEDUCTIBLE_PER_DAMAGE_ENTRY;
}

// Summing per entry is what makes the deductible per-entry: the incident as a
// whole is never the unit the deductible is charged against.
function desiredReimbursementFor(policy: Policy, incident: Incident): number {
  return incident.damages.reduce(
    (sum, damage) => sum + reimbursementFor(damage, damagedItemFor(policy, damage)),
    0,
  );
}

// The cap limits what a single claim pays out, and every payout consumes it:
// successive claims against the same policy share one cap.
function payoutLimitedToRemainingCap(desiredReimbursement: number, remainingCap: number): number {
  return Math.min(desiredReimbursement, remainingCap);
}

function consumeCap(policy: Policy, payout: number): void {
  policy.remainingCap -= payout;
}

function countByType(itemTypes: readonly string[]): Map<string, number> {
  const counts = new Map<string, number>();
  for (const itemType of itemTypes) {
    counts.set(itemType, (counts.get(itemType) ?? 0) + 1);
  }
  return counts;
}

// A damage report states what was lost, so a negative amount is not a smaller
// claim but an unreportable one.
function refuseNegativeDamageAmounts(incident: Incident): void {
  for (const damage of incident.damages) {
    if (damage.amount < 0) {
      throw new Error(`a damage amount cannot be negative, but ${damage.amount} was reported`);
    }
  }
}

// Each damage entry is a distinct damaged item, so the policy must insure at
// least as many items of a type as the incident reports damages of it. Two
// sword damages against a single insured sword is a rejected claim, not a
// double payout on one sword.
//
// Counting types rather than matching entries to individual items is what lets
// `damagedItemFor` settle every alike entry against the first item of its type:
// once this rule has passed, the policy is known to hold enough alike items to
// go round, and alike items carry identical clauses, so which one each entry is
// assigned to cannot change a payout. The two rules are independent decisions
// that meet here -- this one is not a shortcut for the lookup, it is the reason
// the lookup need not be one.
function refuseMoreDamagesThanInsured(policy: Policy, incident: Incident): void {
  const insuredCounts = countByType(policy.items.map((item) => item.type));
  for (const [itemType, damageCount] of countByType(
    incident.damages.map((damage) => damage.itemType),
  )) {
    if (damageCount > (insuredCounts.get(itemType) ?? 0)) {
      throw new Error(
        `the policy insures fewer items of type ${itemType} than the claim reports damaged`,
      );
    }
  }
}

// The order of the three cap-and-rounding steps is itself policy: the desired
// reimbursement is first reduced to the remaining cap, the reduced figure is then
// rounded in the office's favour, and the cap is consumed by that rounded payout
// -- what the office actually books, not the fraction it computed. So the
// remaining cap reported here stays a whole number across successive claims
// against the same policy.
//
// Refusal comes first and is a different kind of decision from the figures that
// follow: a refused claim has no payout, not a payout of zero. The whole claim
// falls, which is why the refusal is made against the incident entire before any
// entry is priced.
//
// The refusals stay a flat sequence here rather than gathering behind one
// admission step, because they are not one criterion. A negative amount is
// refused on the report alone -- no policy is consulted, and every policy the
// office has written would refuse it alike -- whereas more damages of a type
// than are insured is refused by reading the report against this policy's item
// register. Either could change while the other stood: crediting negative
// amounts would not touch the multiplicity rule, nor would paying one sword
// twice touch the amount rule. A third refusal is not even in this sequence --
// `damagedItemFor` refuses an uncovered type per entry, mid-pricing, because
// there the refusal cannot be lifted out of the lookup. So a name spanning the
// two calls below would both bundle independent policies and imply the office's
// refusals end here, which they do not.
export function settle(policy: Policy, incident: Incident): ClaimSettlement {
  refuseNegativeDamageAmounts(incident);
  refuseMoreDamagesThanInsured(policy, incident);
  const payout = roundPayoutInOfficesFavour(
    payoutLimitedToRemainingCap(desiredReimbursementFor(policy, incident), policy.remainingCap),
  );
  consumeCap(policy, payout);
  return { payout, remainingCap: policy.remainingCap };
}
