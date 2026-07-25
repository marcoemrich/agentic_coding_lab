// Premiums round up so any fractional Gold favors the MHPCO, not the customer.
export const roundPremium = (amount: number): number => Math.ceil(amount);

// Payouts round down so any fractional Gold favors the MHPCO, not the customer.
export const roundPayout = (amount: number): number => Math.floor(amount);
