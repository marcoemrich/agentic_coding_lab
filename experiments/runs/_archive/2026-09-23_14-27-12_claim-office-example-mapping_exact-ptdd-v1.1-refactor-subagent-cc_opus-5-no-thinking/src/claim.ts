import { type Item } from "./price-list.js";
import { amountOwedByMHPCO } from "./rounding.js";

/** What one damaged item lost in an incident, as the claim report states it. */
export interface Damage {
  itemType: string;
  amount: number;
}

const DEDUCTIBLE_PER_DAMAGE = 100;
const HIGH_ENCHANTMENT_CLAIM_THRESHOLD = 8;
const HIGH_ENCHANTMENT_REIMBURSED_SHARE = 0.5;
const FULL_REIMBURSEMENT = 1;

/**
 * The claim clause's own enchantment test. The quote side has a high-enchantment
 * rule too, at a different threshold and for a different effect; the two are
 * separate entries in the MHPCO clause book and move independently.
 */
function qualifiesForHighEnchantmentClause(item: Item): boolean {
  return (item.enchantment ?? 0) >= HIGH_ENCHANTMENT_CLAIM_THRESHOLD;
}

/**
 * The share of a damage the office carries before the deductible is charged.
 *
 * The MHPCO clause book grants full reimbursement as its standing position: an item
 * the office insures is made whole unless a clause cuts that share. The dragon-material
 * clause of the rules grants exactly that standing share, so it discriminates nothing
 * and is not a branch here; the spec confirms this by settling a steel sword with no
 * clause at all on the same full share. The high-enchantment clause is the one clause
 * that cuts, and it takes precedence over full reimbursement wherever both would speak
 * -- a dragon sword at enchantment 9 is settled at 50 %, not at 100 %.
 */
function reimbursedShareOf(item: Item): number {
  return qualifiesForHighEnchantmentClause(item)
    ? HIGH_ENCHANTMENT_REIMBURSED_SHARE
    : FULL_REIMBURSEMENT;
}

/**
 * The loss a damage entry states. The office settles losses, so a figure below zero
 * is not a damage it can read -- the report is refused rather than paid out in
 * reverse. This tests the report as written, before any clause is consulted.
 */
function reportedAmountOf(damage: Damage): number {
  if (damage.amount < 0) {
    throw new Error(`A damage amount cannot be negative, but the claim reports ${damage.amount}.`);
  }
  return damage.amount;
}

/**
 * What the office owes for one damaged item: the share its clauses carry, less the
 * deductible charged per damage event -- an incident that harms two items is
 * reduced twice, so the payout is assembled per damaged item rather than per
 * incident.
 */
function reimbursementFor(damage: Damage, damagedItem: Item): number {
  return reportedAmountOf(damage) * reimbursedShareOf(damagedItem) - DEDUCTIBLE_PER_DAMAGE;
}

/**
 * The insured item a damage entry names, resolved against what the policy carries.
 * The policy is the sole authority on what the office settles, so the lookup that
 * finds the damaged item is also the one that refuses a type -- unknown to the price
 * list or simply not on this policy -- that the policy does not cover.
 *
 * Each insured item answers at most one damage, so the matched item is taken out of
 * the items still unclaimed: a policy carrying one sword cannot answer two sword
 * damages.
 */
function claimInsuredItemFor(unclaimedItems: Item[], damage: Damage): Item {
  const index = unclaimedItems.findIndex((item) => item.type === damage.itemType);
  if (index === -1) {
    throw new Error(`The policy does not cover an item of type "${damage.itemType}".`);
  }
  return unclaimedItems.splice(index, 1)[0];
}

/** A damage entry and the insured item the policy assigns to it. */
interface ClaimedDamage {
  damage: Damage;
  damagedItem: Item;
}

/**
 * How the policy answers an incident: each reported damage is assigned the insured
 * item that settles it, and no item settles twice. Assignment is the office's own
 * decision -- which item answers which damage, and when the report asks for more
 * than the policy carries -- and is made in full before any money is counted.
 */
function claimedDamagesOf(items: Item[], damages: Damage[]): ClaimedDamage[] {
  const unclaimedItems = [...items];
  return damages.map((damage) => ({
    damage,
    damagedItem: claimInsuredItemFor(unclaimedItems, damage),
  }));
}

export function payoutFor(items: Item[], damages: Damage[]): number {
  const reimbursed = claimedDamagesOf(items, damages).reduce(
    (payout, claimed) => payout + reimbursementFor(claimed.damage, claimed.damagedItem),
    0,
  );
  return amountOwedByMHPCO(reimbursed);
}

/** What the office pays for one incident, and what the policy's cap has left afterwards. */
export interface Settlement {
  payout: number;
  remainingCap: number;
}

/**
 * The office never pays out more than the policy's cap still allows: a desired
 * payout beyond the remaining cap is reduced to it, and the cap falls by what is
 * actually paid. The payout arriving here is already rounded in the office's
 * favour, and the remaining cap is integral, so the cap reduction cannot
 * reintroduce a fraction.
 */
export function settleClaim(items: Item[], damages: Damage[], capRemaining: number): Settlement {
  const payout = Math.min(payoutFor(items, damages), capRemaining);
  return { payout, remainingCap: capRemaining - payout };
}
