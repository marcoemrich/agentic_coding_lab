// "All amounts are rounded to whole G in the MHPCO's favor" is one MHPCO
// policy with two directions, because the MHPCO stands on opposite sides of
// the two amounts: a premium is money owed to it, so a fraction is rounded up;
// a payout is money owed by it, so a fraction is rounded down. Both directions
// live here so the policy -- and the asymmetry that defines it -- has one home.
export function amountOwedToMhpco(amount: number): number {
  return Math.ceil(amount);
}

export function amountOwedByMhpco(amount: number): number {
  return Math.floor(amount);
}
