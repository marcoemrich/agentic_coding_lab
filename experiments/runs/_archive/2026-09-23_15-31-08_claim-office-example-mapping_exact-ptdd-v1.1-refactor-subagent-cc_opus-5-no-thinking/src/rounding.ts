/** How the MHPCO resolves a fraction of a G.
 *
 *  The office's tradition is one rule, not two: *every fraction falls in the
 *  MHPCO's favour*. What favours the office depends on which way the money is
 *  moving -- a fraction of a premium it collects is rounded up, a fraction of a
 *  payout it pays is rounded down -- but the decision behind both is the same
 *  one, and the office would revise it in one act. Keeping the two directions
 *  side by side here is what lets the asymmetry be read as deliberate rather
 *  than met twice, as an accident, in the tariff and in the handbook. */

/** An amount the customer owes the MHPCO, rounded to the whole G in the
 *  office's favour: upwards. */
export function amountCollectedInMHPCOsFavour(amount: number): number {
  return Math.ceil(amount);
}

/** An amount the MHPCO owes the customer, rounded to the whole G in the
 *  office's favour: downwards. */
export function amountPaidInMHPCOsFavour(amount: number): number {
  return Math.floor(amount);
}
