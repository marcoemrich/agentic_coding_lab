import type { Customer, Item } from "./types.js";
import { computeItemsPremium } from "./pricing.js";

const LOYALTY_YEARS = 2;
const LOYALTY_DISCOUNT = 0.2;
const FIRST_INSURANCE_SURCHARGE = 0.1;
const SUBSEQUENT_CONTRACT_DISCOUNT = 0.15;
const PROCESSING_FEE = 5;

/**
 * Round in MHPCO's favor: always ceiling for amounts the customer pays.
 * Uses a small epsilon to absorb floating-point representation error so
 * that values like 110.00000000000001 don't round up to 111.
 */
export function roundInMHPCOFavor(amount: number): number {
  const EPSILON = 1e-9;
  return Math.ceil(amount - EPSILON);
}

export interface QuoteOptions {
  /** Number of contracts the customer already has before this quote. */
  priorContracts: number;
}

export function computePremium(
  customer: Customer,
  items: Item[],
  options: QuoteOptions,
): number {
  let premium = computeItemsPremium(items);

  // Loyalty discount
  if (customer.yearsWithMHPCO >= LOYALTY_YEARS) {
    premium *= 1 - LOYALTY_DISCOUNT;
  }

  // First insurance vs subsequent contract.
  if (options.priorContracts === 0) {
    premium *= 1 + FIRST_INSURANCE_SURCHARGE;
  } else {
    premium *= 1 - SUBSEQUENT_CONTRACT_DISCOUNT;
  }

  // Processing fee
  premium += PROCESSING_FEE;

  return roundInMHPCOFavor(premium);
}
