// Floating-point arithmetic on gold amounts can produce results like
// 115.00000000000001 that should be treated as exactly 115 before rounding
// up (premiums) or down (payouts) to the nearest whole gold piece. Shared
// by quote.ts and claim.ts so both rounding directions correct for the
// same class of representation error the same way.
export const correctFloatingPointError = (amount: number): number => Number(amount.toFixed(6));
