export function roundPremiumInMHPCOFavour(premium: number): number {
  return Math.ceil(premium);
}

export function roundPayoutInMHPCOFavour(payout: number): number {
  return Math.floor(payout);
}
