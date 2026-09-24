/**
 * Rounding in the MHPCO's favour: a single editorial rule of the office, stated
 * once and applied in both directions of money flow. Whichever way an amount
 * travels, the office keeps the fraction -- so what the customer owes rises to
 * the whole G and what the office owes falls to it. The two functions below are
 * the two directions of that one rule, which is why they are carried together:
 * should the office ever restate what "in our favour" means, it restates both
 * in one act.
 *
 * Only a final premium or payout is rounded; intermediate amounts stay fractions.
 */

/** What the customer owes the office. The office keeps the fraction, so it rises. */
export function amountOwedToMHPCO(amount: number): number {
  return Math.ceil(amount);
}

/** What the office owes the customer. The office keeps the fraction, so it falls. */
export function amountOwedByMHPCO(amount: number): number {
  return Math.floor(amount);
}
