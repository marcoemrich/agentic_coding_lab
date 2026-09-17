/**
 * MHPCO's rounding rule: every final amount is rounded in the office's own
 * favour.
 *
 * This module owns that single ruling. Which way "the office's favour" points
 * depends on which way the money flows — a premium the customer owes is rounded
 * up, an amount the office pays out is rounded down — so the direction is the
 * office's decision, not arithmetic the caller should make for itself.
 *
 * Only final amounts are rounded; intermediate amounts stay fractions.
 */

/** A premium the customer owes MHPCO is rounded up. */
export function roundPremiumInMHPCOFavour(premium: number): number {
  return Math.ceil(premium);
}

/** A payout MHPCO owes the customer is rounded down. */
export function roundPayoutInMHPCOFavour(payout: number): number {
  return Math.floor(payout);
}
