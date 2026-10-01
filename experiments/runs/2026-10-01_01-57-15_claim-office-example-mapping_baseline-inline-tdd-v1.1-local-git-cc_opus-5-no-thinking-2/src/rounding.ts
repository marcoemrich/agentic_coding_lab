/**
 * All amounts are rounded to whole G in the MHPCO's favour: premiums the
 * customer pays go up, payouts the MHPCO owes go down.
 */
export function roundPremium(amount: number): number {
  return Math.ceil(amount);
}

export function roundPayout(amount: number): number {
  return Math.floor(amount);
}
