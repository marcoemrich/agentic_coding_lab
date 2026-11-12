const PERCENT = 100;

export function percentOf(amount: number, percent: number): number {
  return (amount * percent) / PERCENT;
}

export function total(amounts: number[]): number {
  return amounts.reduce((sum, amount) => sum + amount, 0);
}
