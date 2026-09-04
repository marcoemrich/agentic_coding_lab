import { basePremium, itemModifierTotal, type Item } from './premium.js';

export interface Customer {
  yearsWithMHPCO: number;
}

const LOYALTY_DISCOUNT = 0.2;
const LOYALTY_THRESHOLD_YEARS = 2;
const FIRST_INSURANCE_SURCHARGE = 0.1;
const FOLLOW_UP_CONTRACT_DISCOUNT = 0.15;
const PROCESSING_FEE = 5;

/**
 * Premium for one quote. `previousContracts` is the number of quotes this
 * customer has already made in the scenario; from the second contract on a
 * follow-up discount applies.
 */
export function quotePremium(
  items: Item[],
  customer: Customer,
  previousContracts: number,
): number {
  const base = basePremium(items);

  let total = base + itemModifierTotal(items);

  if (customer.yearsWithMHPCO >= LOYALTY_THRESHOLD_YEARS) {
    total -= base * LOYALTY_DISCOUNT;
  }
  // Every item in a quote is treated as a first insurance, regardless of
  // customer history.
  total += base * FIRST_INSURANCE_SURCHARGE;
  if (previousContracts > 0) {
    total -= base * FOLLOW_UP_CONTRACT_DISCOUNT;
  }

  return Math.ceil(total + PROCESSING_FEE);
}
