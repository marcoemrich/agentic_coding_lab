/**
 * The MHPCO rounds every amount in its own favour, which means opposite
 * directions on the two sides of the business: a premium is what the
 * customer pays, so it rounds up; a payout is what the MHPCO pays out, so
 * it rounds down.
 *
 * Only a final amount is rounded; every intermediate amount in a
 * calculation stays a fraction.
 */
export function premiumRoundedInMHPCOsFavour(premium: number): number {
  return Math.ceil(premium);
}

export function payoutRoundedInMHPCOsFavour(payout: number): number {
  return Math.floor(payout);
}
