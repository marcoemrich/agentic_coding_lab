// Round only the final payout, in MHPCO's favor.
export function roundFinalPayout(payout: number): number {
  return Math.floor(payout);
}
