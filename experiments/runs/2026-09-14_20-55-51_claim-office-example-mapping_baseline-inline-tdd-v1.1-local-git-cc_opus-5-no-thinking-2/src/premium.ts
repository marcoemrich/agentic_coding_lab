import { lookup } from './catalog.js';

export interface Customer {
  yearsWithMHPCO: number;
}

export interface Item {
  type: string;
  material?: string;
  enchantment?: number;
  cursed?: boolean;
}

const PROCESSING_FEE = 5;
const BLOCK_SIZE = 3;
const BLOCK_PREMIUM = 60;

const CURSE_SURCHARGE = 0.5;
const HIGH_ENCHANTMENT_SURCHARGE = 0.3;
const HIGH_ENCHANTMENT_LEVEL = 5;
const LOYALTY_DISCOUNT = 0.2;
const LOYALTY_YEARS = 2;
const FIRST_INSURANCE_SURCHARGE = 0.1;
const FOLLOW_UP_DISCOUNT = 0.15;

/** Premiums are rounded up: ties and fractions go to the MHPCO. */
export function roundPremium(amount: number): number {
  return Math.ceil(amount);
}

/**
 * A building block applies only when a type appears exactly BLOCK_SIZE times.
 * Confirmed by the price list: 3 runes -> 60 G, but 4 runes -> 100 G and
 * 7 runes -> 175 G, i.e. the block does not repeat for each complete group.
 */
function componentBasePremium(count: number, unitPremium: number): number {
  if (count === BLOCK_SIZE) return BLOCK_PREMIUM;
  return count * unitPremium;
}

/** Base premium of the policy, before any modifier, grouping components by type. */
export function policyBasePremium(items: Item[]): number {
  const componentCounts = new Map<string, number>();
  let total = 0;

  for (const item of items) {
    const spec = lookup(item.type);
    if (spec.component) {
      componentCounts.set(item.type, (componentCounts.get(item.type) ?? 0) + 1);
    } else {
      total += spec.basePremium;
    }
  }

  for (const [type, count] of componentCounts) {
    total += componentBasePremium(count, lookup(type).basePremium);
  }

  return total;
}

/**
 * Item-specific surcharges, each measured against that item's own base
 * premium rather than the policy total.
 */
export function itemSurcharges(items: Item[]): number {
  let total = 0;
  for (const item of items) {
    const base = lookup(item.type).basePremium;
    if (item.cursed) total += base * CURSE_SURCHARGE;
    if ((item.enchantment ?? 0) >= HIGH_ENCHANTMENT_LEVEL) {
      total += base * HIGH_ENCHANTMENT_SURCHARGE;
    }
  }
  return total;
}

/**
 * Policy-wide modifiers, measured against the policy base premium.
 * Every item in a quote counts as a first insurance regardless of customer
 * history, so the initial assessment surcharge scales with the whole policy.
 */
function policyModifiers(customer: Customer, base: number, contractIndex: number): number {
  let total = base * FIRST_INSURANCE_SURCHARGE;
  if (customer.yearsWithMHPCO >= LOYALTY_YEARS) total -= base * LOYALTY_DISCOUNT;
  if (contractIndex > 0) total -= base * FOLLOW_UP_DISCOUNT;
  return total;
}

/**
 * Total premium for a policy. `contractIndex` is the zero-based position of
 * this quote among the customer's contracts in the scenario.
 */
export function quotePremium(customer: Customer, items: Item[], contractIndex: number): number {
  const base = policyBasePremium(items);
  const exact =
    base + itemSurcharges(items) + policyModifiers(customer, base, contractIndex) + PROCESSING_FEE;
  return roundPremium(exact);
}
