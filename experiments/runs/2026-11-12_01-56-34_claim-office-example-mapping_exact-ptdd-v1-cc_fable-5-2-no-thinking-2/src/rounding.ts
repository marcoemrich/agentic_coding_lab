// All amounts are rounded to whole G in the MHPCO's favor:
// what the MHPCO receives is rounded up, what it pays out is rounded down.

export function premiumRoundedInFavorOfMHPCO(premium: number): number {
  return Math.ceil(premium);
}

export function payoutRoundedInFavorOfMHPCO(payout: number): number {
  return Math.floor(payout);
}
