const ONE_HUNDRED_PERCENT = 100;

// Multiplies before dividing so that G amounts stay exact fractions.
export function percentOf(amount: number, percent: number): number {
  return (amount * percent) / ONE_HUNDRED_PERCENT;
}
