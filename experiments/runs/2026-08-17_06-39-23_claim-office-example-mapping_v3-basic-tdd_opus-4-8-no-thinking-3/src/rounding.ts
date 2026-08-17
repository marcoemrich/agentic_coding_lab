// Rounding "in the MHPCO's favor": premiums round up, payouts round down.
export function roundInFavor(amount: number, kind: 'premium' | 'payout'): number {
  return kind === 'premium' ? Math.ceil(amount) : Math.floor(amount);
}
