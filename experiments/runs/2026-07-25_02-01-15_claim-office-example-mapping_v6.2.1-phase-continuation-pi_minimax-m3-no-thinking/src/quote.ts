/**
 * Fixed processing fee charged for every quote, regardless of contents.
 * Per spec: the empty-item-list quote reduces to this fee alone.
 */
const PROCESSING_FEE = 5;

/**
 * Rate of the first-insurance surcharge applied per item (10 % of the item's base premium).
 * Per spec: "each item in a quote is treated as a first insurance, regardless of customer history."
 */
const FIRST_INSURANCE_RATE = 0.1;

/**
 * Rate of the high-enchantment surcharge (30 % of the item's base premium).
 * Per spec: items with enchantment level >= HIGH_ENCHANTMENT_PREMIUM_THRESHOLD
 * add this risk surcharge.
 */
const HIGH_ENCHANTMENT_RATE = 0.3;

/**
 * Rate of the cursed-item surcharge (50 % of the item's base premium).
 * Per spec: cursed items add a 50 % risk surcharge.
 */
const CURSE_RATE = 0.5;

/**
 * Rate of the loyalty discount (20 % of the item's base premium).
 * Per spec: long-standing customers (>= LOYALTY_THRESHOLD years with MHPCO) receive
 * a 20 % loyalty discount applied per item.
 */
const LOYALTY_RATE = 0.2;

/**
 * Rate of the follow-up contract discount (15 % of the base premium).
 * Per spec: "Customers receive a 15 % discount on each contract after their first."
 */
const FOLLOWUP_RATE = 0.15;

/**
 * Minimum years with MHPCO for a customer to qualify for the loyalty discount.
 * Per spec: "Long-standing customers (>= 2 years of business with MHPCO) receive
 * a 20 % loyalty discount."
 */
const LOYALTY_THRESHOLD = 2;

/**
 * Enchantment level at which the high-enchantment premium surcharge kicks in.
 * Per spec: items with enchantment level >= 5 add a 30 % risk surcharge.
 * This threshold is deliberately lower than the damage-side clause threshold
 * (8): even moderately enchanted items are charged extra premium risk, while
 * only exceptionally enchanted items trigger the 50 % reimbursement clause.
 */
const HIGH_ENCHANTMENT_PREMIUM_THRESHOLD = 5;

/**
 * Base premium looked up by item type. Per spec:
 *   sword=100, amulet=60, staff=80, potion=40;
 *   rune/moonstone=25 (components; all components share this base, regardless of material).
 * Item types not in this table cause `basePremiumFor` to throw.
 */
const BASE_PREMIUMS: Record<string, number> = {
  sword: 100,
  amulet: 60,
  staff: 80,
  potion: 40,
  rune: 25,
  moonstone: 25,
};

/**
 * Look up a base premium by item type. Throws if the type is not one of the
 * recognised MHPCO item types.
 */
function basePremiumFor(type: string): number {
  if (!(type in BASE_PREMIUMS)) {
    throw new Error(`Unknown item type: ${type}`);
  }
  return BASE_PREMIUMS[type];
}

export type QuoteItem = {
  type: string;
  material?: string;
  enchantment?: number;
  cursed?: boolean;
};

export type Customer = {
  yearsWithMHPCO: number;
};

export type QuoteOptions = {
  isFollowup?: boolean;
};

const COMPONENT_TYPES = new Set(["rune", "moonstone"]);

/**
 * Number of identical components that form a "block" eligible for the discount rate.
 * Per spec: "block requires exactly 3" — only multiples of this size get the block price.
 */
const COMPONENTS_PER_BLOCK = 3;

/**
 * Premium for one block of COMPONENTS_PER_BLOCK identical components.
 * Per spec: a full block costs 60 G regardless of which component type fills it.
 */
const BLOCK_RATE = 60;

/**
 * Premium for a batch of `count` components sharing `base`, with the building-block
 * discount applied. If `count` is a multiple of COMPONENTS_PER_BLOCK, the block rate
 * of BLOCK_RATE replaces the per-component rate. Otherwise each component is priced
 * individually at `base`.
 * Per spec: "block requires exactly 3" — the discount applies only when count is a
 * multiple of COMPONENTS_PER_BLOCK; non-multiples pay count × base.
 */
function componentPremium(base: number, count: number): number {
  if (count % COMPONENTS_PER_BLOCK === 0) {
    return (count / COMPONENTS_PER_BLOCK) * BLOCK_RATE;
  }
  return count * base;
}

/**
 * Risk surcharges for an item: the high-enchantment surcharge (when enchantment
 * is at or above HIGH_ENCHANTMENT_PREMIUM_THRESHOLD) plus the cursed-item surcharge
 * (when the item is flagged cursed). Both are fractions of `base`.
 */
function riskSurcharge(base: number, item: QuoteItem): number {
  const enchant = (item.enchantment ?? 0) >= HIGH_ENCHANTMENT_PREMIUM_THRESHOLD
    ? base * HIGH_ENCHANTMENT_RATE
    : 0;
  const curse = item.cursed ? base * CURSE_RATE : 0;
  return enchant + curse;
}

/**
 * Net per-item adjustment for `count` items at `base`: the first-insurance
 * surcharge (always applies) minus the loyalty discount (applies for customers
 * with >= LOYALTY_THRESHOLD years with MHPCO) minus the follow-up discount
 * (applies when this quote is a follow-up contract for the customer).
 * Each adjustment is `base * count * RATE`, so they combine into one formula.
 */
function perItemAdjustments(
  base: number,
  count: number,
  customer: Customer,
  isFollowup: boolean,
): number {
  const loyaltyRate = customer.yearsWithMHPCO >= LOYALTY_THRESHOLD ? LOYALTY_RATE : 0;
  const followupRate = isFollowup ? FOLLOWUP_RATE : 0;
  return base * count * (FIRST_INSURANCE_RATE - loyaltyRate - followupRate);
}

export function quotePremium(
  items: QuoteItem[],
  customer: Customer,
  options?: QuoteOptions,
): number {
  let total = PROCESSING_FEE;
  const componentCounts = new Map<string, number>();
  for (const item of items) {
    if (COMPONENT_TYPES.has(item.type)) {
      componentCounts.set(item.type, (componentCounts.get(item.type) ?? 0) + 1);
    } else {
      const base = basePremiumFor(item.type);
      total += base + riskSurcharge(base, item) + perItemAdjustments(base, 1, customer, options?.isFollowup ?? false);
    }
  }
  for (const [type, count] of componentCounts) {
    const base = basePremiumFor(type);
    total += componentPremium(base, count) + perItemAdjustments(base, count, customer, options?.isFollowup ?? false);
  }
  return Math.ceil(total);
}
