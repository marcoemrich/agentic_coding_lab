export function roundPremiumInMHPCOsFavor(premium: number): number {
  return Math.ceil(premium);
}

export function roundPayoutInMHPCOsFavor(payout: number): number {
  return Math.floor(payout);
}
