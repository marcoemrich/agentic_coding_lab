const PERCENT = 100;

// Intermediate amounts are kept as fractions; only final amounts are rounded.
export const percentOf = (amount: number, percent: number): number => (amount * percent) / PERCENT;

// All amounts are rounded to whole G in the MHPCO's favor.
export const roundPremiumInMhpcoFavor = (premium: number): number => Math.ceil(premium);
export const roundPayoutInMhpcoFavor = (payout: number): number => Math.floor(payout);
