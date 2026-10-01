const HUNDRED_PERCENT = 100;

export function percentOf(amount: number, percent: number): number {
  return (amount * percent) / HUNDRED_PERCENT;
}
