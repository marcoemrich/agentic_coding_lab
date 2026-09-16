/**
 * All amounts are rounded to whole G in the MHPCO's favour: an amount the
 * office receives rounds up, an amount it pays out rounds down. Intermediate
 * amounts stay fractional -- only a final premium or payout is rounded.
 */

export function roundedPremium(premium: number): number {
  return Math.ceil(premium);
}

export function roundedPayout(payout: number): number {
  return Math.floor(payout);
}
