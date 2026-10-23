// Amounts are kept exact as integers scaled by PERCENT (G times percent) until the final rounding.
export const PERCENT = 100;

export function roundUpToWholeG(scaledAmount: number): number {
  return Math.ceil(scaledAmount / PERCENT);
}

export function roundDownToWholeG(scaledAmount: number): number {
  return Math.floor(scaledAmount / PERCENT);
}
