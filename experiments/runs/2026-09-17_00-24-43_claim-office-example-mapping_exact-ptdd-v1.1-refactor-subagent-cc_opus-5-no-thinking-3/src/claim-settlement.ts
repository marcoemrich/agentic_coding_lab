// How the MHPCO settles a claim against a policy: what the policy covers in
// total, and what it will pay out. This is settlement policy, separate from
// the premium policy that decides what the office charges.

import { ClaimOfficeRefusal } from "./claim-office-refusal.js";
import { type Item, insuranceValue } from "./item-catalogue.js";

const CAP_MULTIPLE = 2;
const DEDUCTIBLE = 100;
const REDUCED_REIMBURSEMENT_ENCHANTMENT = 8;
const REDUCED_REIMBURSEMENT_RATE = 0.5;

// The insurance sum is the sum of the insured items' insurance values; the
// block discount affects the premium only, never the insurance sum.
function insuranceSum(items: Item[]): number {
  return items.reduce((total, item) => total + insuranceValue(item), 0);
}

// The total payout per policy is capped at twice the insurance sum.
export function policyCap(items: Item[]): number {
  return insuranceSum(items) * CAP_MULTIPLE;
}

export interface Damage {
  itemType: string;
  amount: number;
}

export interface Settlement {
  payout: number;
  remainingCap: number;
}

// Damage to an item enchanted at this level or above is reimbursed at half.
function isReducedReimbursement(item: Item): boolean {
  return (item.enchantment ?? 0) >= REDUCED_REIMBURSEMENT_ENCHANTMENT;
}

// The reimbursement clauses decide what a damage is worth before the
// deductible is withheld. Dragon material is fully reimbursed, which is also
// the default for an item no clause reduces, so it needs no separate branch:
// where dragon material meets high enchantment the spec's examples give the
// 50 % rule precedence (dragon sword, enchantment 8 or 9, damage 1000 G ->
// payout 400 G).
function reimbursableAmount(item: Item, damage: Damage): number {
  return isReducedReimbursement(item)
    ? damage.amount * REDUCED_REIMBURSEMENT_RATE
    : damage.amount;
}

// A deductible is withheld per damage event, after the reimbursement clauses
// have decided what the damage is worth.
function damagePayout(item: Item, damage: Damage): number {
  return reimbursableAmount(item, damage) - DEDUCTIBLE;
}

// Before the office asks whether the policy covers a damage, it asks whether
// the report is one it will consider at all. A damage report states what an
// incident cost, so a report claiming a negative amount is not a lesser claim
// but an inadmissible one, and the office refuses the whole claim rather than
// settling it. This admissibility policy is about the report itself and
// changes apart from coverage and from what an admitted damage is worth.
function admissibleDamage(damage: Damage): Damage {
  if (damage.amount < 0) {
    throw new ClaimOfficeRefusal(
      `a damage to an item of type ${damage.itemType} cannot be a negative amount: ${damage.amount}`,
    );
  }
  return damage;
}

// Admitting an incident's damages to the policy's cover. A damage report names
// only an item type, so the office has to decide which covered item each report
// refers to -- and refuses the whole claim when the policy covers no such item.
// Each damage consumes one covered item, so a policy covering one sword answers
// for one damaged sword and no more; the register therefore keeps, for the
// duration of one incident, the items not yet claimed against. It works on its
// own copy, so the policy's own items survive the claim unchanged and remain
// available to the next one.
//
// This admission is the office's coverage policy; what an admitted damage is
// then worth is the reimbursement policy above, and the two change apart.
class CoverRegister {
  private readonly unclaimedItems: Item[];

  constructor(items: Item[]) {
    this.unclaimedItems = [...items];
  }

  admit(damage: Damage): Item {
    const covered = this.unclaimedItems.findIndex(
      (item) => item.type === damage.itemType,
    );
    if (covered < 0) {
      throw new ClaimOfficeRefusal(
        `the policy does not cover a further item of type ${damage.itemType}`,
      );
    }
    return this.unclaimedItems.splice(covered, 1)[0];
  }
}

// Every damage in an incident is settled on its own -- two damaged swords are
// two damage events, each bearing its own deductible -- and the claim pays out
// the sum of them. One damage passes three decisions in order: is the report
// admissible, which covered item does it name, and what is it worth.
function settledDamage(cover: CoverRegister, reported: Damage): number {
  const damage = admissibleDamage(reported);
  return damagePayout(cover.admit(damage), damage);
}

function claimPayout(items: Item[], damages: Damage[]): number {
  const cover = new CoverRegister(items);
  return damages.reduce(
    (total, damage) => total + settledDamage(cover, damage),
    0,
  );
}

// The total payout per policy is capped, so the office never pays more than
// the cap the policy has left: a claim that wants more is reduced to it.
function payoutWithinRemainingCap(
  desiredPayout: number,
  remainingCap: number,
): number {
  return Math.min(desiredPayout, remainingCap);
}

// Amounts are rounded to whole G in the MHPCO's favour: a payout is rounded
// down. Intermediate amounts are kept as fractions.
function roundPayoutInMhpcoFavor(payout: number): number {
  return Math.floor(payout);
}

// Settling a claim: what the incident is worth, reduced to what the policy's
// cap still permits, and what that leaves of the cap for later claims.
export function settleClaim(
  items: Item[],
  damages: Damage[],
  remainingCap: number,
): Settlement {
  const desiredPayout = claimPayout(items, damages);
  const permittedPayout = payoutWithinRemainingCap(desiredPayout, remainingCap);
  const payout = roundPayoutInMhpcoFavor(permittedPayout);
  return { payout, remainingCap: remainingCap - payout };
}
