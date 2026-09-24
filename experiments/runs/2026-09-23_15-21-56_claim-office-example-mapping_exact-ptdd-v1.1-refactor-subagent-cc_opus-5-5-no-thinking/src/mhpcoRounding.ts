// All final amounts are rounded to whole G in the MHPCO's favor:
// what the customer pays is rounded up, what the MHPCO pays out is rounded down.

export function roundPremiumInMhpcoFavor(premium: number): number {
  return Math.ceil(premium);
}

export function roundPayoutInMhpcoFavor(payout: number): number {
  return Math.floor(payout);
}
