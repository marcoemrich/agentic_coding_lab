// Money is always rounded in the MHPCO's favour: premiums (what the customer
// pays) go up, payouts (what the MHPCO pays out) go down.

// Percentage arithmetic leaves values like 71.00000000000001, which would
// otherwise round up to 72. Settle the float noise before rounding.
const FLOAT_NOISE_DIGITS = 6;
const withoutFloatNoise = (amount: number): number =>
  Number(amount.toFixed(FLOAT_NOISE_DIGITS));

// Both directions are the same two steps — settle the noise, then round — and
// differ only in which way. Naming the shared shape once is what keeps the
// noise handling from being something each direction has to remember to do.
const roundingBy =
  (towards: (amount: number) => number) =>
  (amount: number): number =>
    towards(withoutFloatNoise(amount));

// Premiums (what the customer pays) go up; payouts (what the MHPCO pays out)
// go down. Both favour the MHPCO — the direction is the only difference.
export const roundUpInFavourOfMHPCO = roundingBy(Math.ceil);
export const roundDownInFavourOfMHPCO = roundingBy(Math.floor);
