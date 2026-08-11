/**
 * Binary floating point can leave a value that is mathematically whole a hair
 * off it (100 * 1.1 + 5 === 115.00000000000001), which would push a rounding a
 * whole G too far. Amounts in G never need more precision than this, so the
 * error is absorbed before rounding.
 */
const SIGNIFICANT_DECIMALS = 6;

function normalize(amount: number): number {
  return Number(amount.toFixed(SIGNIFICANT_DECIMALS));
}

/** Round a premium up — in the MHPCO's favor. */
export function roundUp(amount: number): number {
  return Math.ceil(normalize(amount));
}

/** Round a payout down — in the MHPCO's favor. */
export function roundDown(amount: number): number {
  return Math.floor(normalize(amount));
}
