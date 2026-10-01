import { type Item, payoutRoundedInMHPCOsFavour, priceListEntryOf } from "./office-statutes.js";

/** One item damaged in an incident, as the customer reports it. */
export interface Damage {
  itemType: string;
  amount: number;
}

/** A damage report against one policy. */
export interface Incident {
  cause: string;
  damages: Damage[];
}

/** What a damage report costs the office, and what is left of the policy's cap. */
export interface Settlement {
  payout: number;
  remainingCap: number;
}

/**
 * What the office will accept as a reported damage at all, before it opens any
 * policy file: a damage is a loss suffered, so the office reads no negative amount
 * as a damage. A question about the report alone -- it is settled against no policy,
 * and the office refuses the whole report rather than the one entry.
 */
function refuseInadmissibleDamages(damages: Damage[]): void {
  for (const { amount } of damages) {
    if (amount < 0) {
      throw new Error(`a damage cannot be negative, but ${amount} G was reported`);
    }
  }
}

/**
 * The insured item one reported damage is settled against, struck off the items
 * still covered: every damage event in a report is a separate claim on a separate
 * insured item, so the office refuses a report that claims more of a kind than the
 * policy covers.
 */
function claimAgainst(stillCovered: Item[], damage: Damage): Item {
  const insured = stillCovered.findIndex((item) => item.type === damage.itemType);
  if (insured < 0) {
    throw new Error(`the policy does not cover a damaged ${damage.itemType}`);
  }
  return stillCovered.splice(insured, 1)[0];
}

/**
 * The office's half-reimbursement clause has an enchantment threshold of its own,
 * set higher than the threshold of the high-enchantment risk surcharge it charges
 * on premiums (level 5). Two statutes, written separately and free to move
 * separately: this one decides what the office pays out on a claim, that one what
 * it charges to write the policy.
 */
const HALF_REIMBURSEMENT_ENCHANTMENT_LEVEL = 8;
const HALF_REIMBURSEMENT_RATE = 0.5;

/**
 * Damage to an item enchanted to level 8 or above the office reimburses at half,
 * holding the enchantment itself partly to blame for what befell the item.
 */
function qualifiesForHalfReimbursement(item: Item): boolean {
  return (item.enchantment ?? 0) >= HALF_REIMBURSEMENT_ENCHANTMENT_LEVEL;
}

/**
 * Full reimbursement is the office's default: absent a clause that reduces it, a
 * damage is reimbursed in whole, less the excess. This is also what the office's
 * dragon-material clause ("damage to items made of dragon material is fully
 * reimbursed") amounts to -- it claims no more than every insured item already
 * gets, and where it meets the half-reimbursement clause the office has ruled that
 * the half-reimbursement clause wins. So dragon material earns the default and
 * overrides nothing, and the office reads no material to settle a claim.
 */
const FULL_REIMBURSEMENT_RATE = 1;

/** The share of a damage the office reimburses before it deducts its excess. */
function reimbursedShareOf(item: Item): number {
  return qualifiesForHalfReimbursement(item)
    ? HALF_REIMBURSEMENT_RATE
    : FULL_REIMBURSEMENT_RATE;
}

const DEDUCTIBLE_PER_DAMAGE = 100;

/**
 * What the office reimburses for one damaged item: the share its clauses allow,
 * less its excess on every damage event. A damage no larger than the excess is
 * absorbed by it entirely and reimbursed at nothing.
 */
function reimbursementFor(damage: Damage, item: Item): number {
  const reimbursed = damage.amount * reimbursedShareOf(item);
  return Math.max(reimbursed - DEDUCTIBLE_PER_DAMAGE, 0);
}

/**
 * The insurance sum of a list of items: what the price list says they are insured
 * for. A reading of the price list and nothing more -- premium offers and
 * surcharges do not touch it.
 */
function insuranceSumOf(items: Item[]): number {
  return items.reduce((sum, item) => sum + priceListEntryOf(item.type).insuranceValue, 0);
}

/**
 * The office will pay out at most twice the insurance sum on one policy, all
 * claims together. A statute of the office, rated on the insurance sum and on
 * nothing else -- no premium term raises or lowers it.
 */
const CAP_MULTIPLE_OF_INSURANCE_SUM = 2;

/**
 * A policy the office has written: the items it covers, and how much of its payout
 * cap is still available. The cap is the policy's own ledger -- it opens at the
 * capped amount the office's statute allows for these items, and only the policy
 * itself may draw it down -- so the office reads what remains rather than keeping
 * that figure for it.
 */
export class Policy {
  /**
   * The part of this policy's cap the office has not yet handed out. Never
   * negative: the office only ever draws off a payout its cap statute has already
   * limited to this figure, so the ledger cannot be overdrawn.
   */
  private cap: number;

  constructor(private readonly items: Item[]) {
    this.cap = CAP_MULTIPLE_OF_INSURANCE_SUM * insuranceSumOf(items);
  }

  /**
   * Settling one damage report against this policy: the office pays what its
   * statutes allow on the report, draws that off the cap, and reports both.
   */
  settle(incident: Incident): Settlement {
    const payout = this.cappedPayoutFor(incident);
    this.cap -= payout;
    return { payout, remainingCap: this.cap };
  }

  /**
   * What the office pays out on one damage report once its cap statute has had its
   * say: the clauses decide what the damage is worth, and the cap decides how much
   * of that the office is still willing to hand out under this policy. The cap is
   * a limit on the total of all claims, so what limits this one is the part of it
   * still open -- a policy already paid up to its cap pays nothing more.
   */
  private cappedPayoutFor(incident: Incident): number {
    return Math.min(this.payoutFor(incident), this.cap);
  }

  /** What the office pays out on one damage report, over all the items damaged. */
  private payoutFor(incident: Incident): number {
    refuseInadmissibleDamages(incident.damages);
    const stillCovered = [...this.items];
    const exactPayout = incident.damages.reduce(
      (payout, damage) => payout + reimbursementFor(damage, claimAgainst(stillCovered, damage)),
      0,
    );
    return payoutRoundedInMHPCOsFavour(exactPayout);
  }
}
