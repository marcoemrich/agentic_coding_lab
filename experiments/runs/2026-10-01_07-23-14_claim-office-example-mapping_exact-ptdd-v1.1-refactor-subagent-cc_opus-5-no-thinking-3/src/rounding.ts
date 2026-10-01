// The MHPCO rounds every amount it settles to whole G in its own favour. One
// office rule, two directions: the office favours itself by charging the most
// whole G it may and paying the fewest. Which direction applies follows from
// which side of the ledger the amount falls on, never from the calculation
// that produced it.
//
// Intermediate amounts stay fractional; each of these is applied once, to a
// final premium or payout.

// Money the customer owes the office.
export function roundAmountChargedInMHPCOsFavour(amount: number): number {
  return Math.ceil(amount);
}

// Money the office owes the customer.
export function roundAmountPaidInMHPCOsFavour(amount: number): number {
  return Math.floor(amount);
}
