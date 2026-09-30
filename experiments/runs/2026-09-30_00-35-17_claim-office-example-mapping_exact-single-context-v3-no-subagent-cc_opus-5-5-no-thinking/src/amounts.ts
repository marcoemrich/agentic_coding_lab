export const sum = (amounts: number[]): number => amounts.reduce((total, amount) => total + amount, 0);

export const percentOf = (amount: number, percent: number): number => (amount * percent) / 100;

// All amounts are rounded in the MHPCO's favor: premiums up, payouts down.
export const roundPremium = (amount: number): number => Math.ceil(amount);
export const roundPayout = (amount: number): number => Math.floor(amount);
