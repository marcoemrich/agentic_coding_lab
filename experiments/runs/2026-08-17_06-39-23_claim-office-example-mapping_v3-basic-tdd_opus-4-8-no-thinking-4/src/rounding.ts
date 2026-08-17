export type AmountKind = 'premium' | 'payout';

// The office always rounds in its own favor: it charges the higher premium
// and pays out the lower amount.
export function roundInOfficeFavor(amount: number, kind: AmountKind): number {
  return kind === 'premium' ? Math.ceil(amount) : Math.floor(amount);
}
