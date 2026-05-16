import type { Customer, Item } from "./types.js";
import { itemPremiumContributions } from "./pricing.js";

const PROCESSING_FEE = 5;

/**
 * Compute the premium for a list of items for a given customer, taking into
 * account that this is the (contractIndex+1)-th contract issued to the
 * customer (0-based: contractIndex 0 means first contract).
 */
export function computePremium(
  customer: Customer,
  items: Item[],
  contractIndex: number,
): number {
  let amount = itemPremiumContributions(items);

  // Loyalty discount (≥ 2 years)
  if (customer.yearsWithMHPCO >= 2) {
    amount *= 0.8;
  }

  // First-insurance surcharge OR repeat-contract discount
  if (contractIndex === 0) {
    amount *= 1.1;
  } else {
    amount *= 0.85;
  }

  // Processing fee
  amount += PROCESSING_FEE;

  // Round in MHPCO's favor → ceiling. Use a tiny epsilon to absorb
  // floating-point representation error (e.g. 100*1.1 = 110.00000000000001).
  const EPS = 1e-9;
  return Math.ceil(amount - EPS);
}
