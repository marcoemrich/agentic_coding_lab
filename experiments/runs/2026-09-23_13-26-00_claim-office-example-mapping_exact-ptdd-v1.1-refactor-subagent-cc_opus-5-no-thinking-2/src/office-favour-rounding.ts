/**
 * The MHPCO's rounding rule: every final amount is rounded to whole G in the
 * office's favour. Which direction that is depends on who pays — an amount the
 * office receives is rounded up, an amount it pays out is rounded down. The two
 * directions are the same rule read from the two sides of the counter, so they
 * are stated together here and change together.
 */

/** A whole-G amount the customer owes the office, rounded in the office's favour. */
export function roundAmountOfficeReceives(amount: number): number {
  return Math.ceil(amount);
}

/** A whole-G amount the office owes the customer, rounded in the office's favour. */
export function roundAmountOfficePays(amount: number): number {
  return Math.floor(amount);
}
