import { policyBasePremium, itemSurcharges, Item } from './premium.js';
import { specFor } from './catalog.js';

const LOYALTY_DISCOUNT = 0.2;
const LOYALTY_YEARS = 2;
const FIRST_INSURANCE_SURCHARGE = 0.1;
const FOLLOW_UP_DISCOUNT = 0.15;
const PROCESSING_FEE = 5;

export interface Customer {
  yearsWithMHPCO: number;
}

export function quotePremium(items: Item[], customer: Customer, contractIndex: number): number {
  const base = policyBasePremium(items);
  let total = base;
  for (const item of items) {
    total += itemSurcharges(item);
  }
  if (customer.yearsWithMHPCO >= LOYALTY_YEARS) {
    total -= base * LOYALTY_DISCOUNT;
  }
  total += base * FIRST_INSURANCE_SURCHARGE;
  if (contractIndex > 0) {
    total -= base * FOLLOW_UP_DISCOUNT;
  }
  total += PROCESSING_FEE;
  return Math.ceil(total);
}

export function insuranceSum(items: Item[]): number {
  let sum = 0;
  for (const item of items) {
    const spec = specFor(item.type);
    if (!spec) {
      throw new Error(`unknown item type: ${item.type}`);
    }
    sum += spec.insuranceValue;
  }
  return sum;
}
