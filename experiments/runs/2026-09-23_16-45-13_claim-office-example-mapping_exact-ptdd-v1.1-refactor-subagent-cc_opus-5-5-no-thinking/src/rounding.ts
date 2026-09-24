// All amounts are rounded to whole G in the MHPCO's favor.

export function roundPremiumInMHPCOsFavor(premium: number): number {
  return Math.ceil(premium);
}

export function roundPayoutInMHPCOsFavor(payout: number): number {
  return Math.floor(payout);
}
