import { lookup } from './catalog.js';

export interface Item {
  type: string;
  material?: string;
  enchantment?: number;
  cursed?: boolean;
}

export interface Customer {
  yearsWithMHPCO: number;
}

const PROCESSING_FEE = 5;
const FIRST_INSURANCE_SURCHARGE = 0.1;
const CURSE_SURCHARGE = 0.5;
const HIGH_ENCHANTMENT_SURCHARGE = 0.3;
const HIGH_ENCHANTMENT_THRESHOLD = 5;
const LOYALTY_DISCOUNT = 0.2;
const LOYALTY_THRESHOLD_YEARS = 2;
const FOLLOW_UP_DISCOUNT = 0.15;
const BLOCK_SIZE = 3;
const BLOCK_PREMIUM = 60;

/**
 * Base premium of the components of one type. The block rate is offered only
 * for a group of exactly 3 alike components; any other count is billed at the
 * per-component rate (4 runes cost 100 G, not 85 G).
 */
function componentBasePremium(count: number, perComponent: number): number {
  return count === BLOCK_SIZE ? BLOCK_PREMIUM : count * perComponent;
}

/**
 * Per-item base premiums. Components of the same type are pooled so that
 * blocks can be formed; the block discount is spread back over the items so
 * that item-specific surcharges still have a base to apply to.
 */
function itemBasePremiums(items: Item[]): number[] {
  const componentCounts = new Map<string, number>();
  for (const item of items) {
    if (lookup(item.type).component) {
      componentCounts.set(item.type, (componentCounts.get(item.type) ?? 0) + 1);
    }
  }

  const blockedShare = new Map<string, number>();
  for (const [type, count] of componentCounts) {
    const entry = lookup(type);
    blockedShare.set(type, componentBasePremium(count, entry.basePremium) / count);
  }

  return items.map((item) => {
    const entry = lookup(item.type);
    return entry.component ? blockedShare.get(item.type)! : entry.basePremium;
  });
}

function itemSurcharges(item: Item, base: number): number {
  let surcharge = 0;
  if (item.cursed) surcharge += base * CURSE_SURCHARGE;
  if ((item.enchantment ?? 0) >= HIGH_ENCHANTMENT_THRESHOLD) {
    surcharge += base * HIGH_ENCHANTMENT_SURCHARGE;
  }
  return surcharge;
}

/**
 * @param contractNumber 1-based index of this quote among the customer's
 *   contracts in the scenario; contracts after the first get a discount.
 */
export function quotePremium(items: Item[], customer: Customer, contractNumber: number): number {
  const bases = itemBasePremiums(items);
  const policyBase = bases.reduce((sum, base) => sum + base, 0);

  let total = policyBase;
  items.forEach((item, i) => {
    total += itemSurcharges(item, bases[i]);
  });

  // Policy-wide modifiers are all measured against the policy base premium.
  if (customer.yearsWithMHPCO >= LOYALTY_THRESHOLD_YEARS) total -= policyBase * LOYALTY_DISCOUNT;
  // Every item in a quote is treated as a first insurance, regardless of
  // customer history (see the spec's integration examples).
  total += policyBase * FIRST_INSURANCE_SURCHARGE;
  if (contractNumber > 1) total -= policyBase * FOLLOW_UP_DISCOUNT;

  return Math.ceil(total + PROCESSING_FEE);
}

/** Insurance sum of a policy: the catalog values, unaffected by block discounts. */
export function insuranceSum(items: Item[]): number {
  return items.reduce((sum, item) => sum + lookup(item.type).insuranceValue, 0);
}
