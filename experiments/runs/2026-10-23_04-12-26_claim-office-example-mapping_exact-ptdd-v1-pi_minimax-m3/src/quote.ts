// MHPCO price list and policy constants — single source of truth for the item
// catalog. Adding or adjusting an item only touches this file.

export interface QuoteItem {
  type: string;
  material?: string;
  enchantment?: number;
  cursed?: boolean;
}

export interface Customer {
  yearsWithMHPCO: number;
}

export interface QuotePolicy {
  premium: number;
  insuranceSum: number;
}

// Per-item base premium (the "price list" premium). Components share the same
// per-piece base premium; the block-of-three rule is computed elsewhere because
// it depends on the whole item list, not a single item.
export const ITEM_BASE_PREMIUM: Readonly<Record<string, number>> = {
  sword: 100,
  amulet: 60,
  staff: 80,
  potion: 40,
  rune: 25,
  moonstone: 25,
};

// Per-item insurance value (the cap is 2 × sum of these values, irrespective
// of premium modifiers). Premium modifiers do not raise the cap.
export const ITEM_INSURANCE_VALUE: Readonly<Record<string, number>> = {
  sword: 1000,
  amulet: 600,
  staff: 800,
  potion: 400,
  rune: 250,
  moonstone: 250,
};

export const PROCESSING_FEE_G = 5;
export const CAP_MULTIPLIER = 2;

// A building block of exactly 3 alike components has a special base premium
// of 60 G (instead of 3 × 25 = 75 G). Mixed types or different counts do not
// form a block.
const COMPONENT_BLOCK_SIZE = 3;
const COMPONENT_BLOCK_PREMIUM = 60;
const COMPONENTS = new Set(["rune", "moonstone"]);

// Premium modifier rates (applied to the relevant base before fees).
const CURSE_SURCHARGE_RATE = 0.5;
const HIGH_ENCHANTMENT_THRESHOLD = 5;
const HIGH_ENCHANTMENT_SURCHARGE_RATE = 0.3;
const FIRST_INSURANCE_RATE = 0.1;
const LOYALTY_YEARS_THRESHOLD = 2;
const LOYALTY_DISCOUNT_RATE = 0.2;
const FOLLOW_UP_DISCOUNT_RATE = 0.15;

function componentBasePremium(items: QuoteItem[]): number {
  const counts = new Map<string, number>();
  for (const item of items) {
    if (COMPONENTS.has(item.type)) {
      counts.set(item.type, (counts.get(item.type) ?? 0) + 1);
    }
  }
  let total = 0;
  for (const [type, count] of counts) {
    if (count === COMPONENT_BLOCK_SIZE) {
      total += COMPONENT_BLOCK_PREMIUM;
    } else {
      total += count * (ITEM_BASE_PREMIUM[type] ?? 0);
    }
  }
  return total;
}

function otherBasePremium(items: QuoteItem[]): number {
  return items
    .filter((i) => !COMPONENTS.has(i.type))
    .reduce<number>((sum, item) => sum + (ITEM_BASE_PREMIUM[item.type] ?? 0), 0);
}

function itemSurcharges(items: QuoteItem[]): number {
  let surcharge = 0;
  for (const item of items) {
    const base = ITEM_BASE_PREMIUM[item.type] ?? 0;
    if (item.cursed) surcharge += base * CURSE_SURCHARGE_RATE;
    if ((item.enchantment ?? 0) >= HIGH_ENCHANTMENT_THRESHOLD) {
      surcharge += base * HIGH_ENCHANTMENT_SURCHARGE_RATE;
    }
  }
  return surcharge;
}

function policyWideModifiers(
  policyBase: number,
  customer: Customer,
  contractIndex: number,
): number {
  let modifier = 0;
  if (customer.yearsWithMHPCO >= LOYALTY_YEARS_THRESHOLD) {
    modifier -= policyBase * LOYALTY_DISCOUNT_RATE;
  }
  if (contractIndex > 0) {
    modifier -= policyBase * FOLLOW_UP_DISCOUNT_RATE;
  }
  return modifier;
}

export function insuranceSum(items: QuoteItem[]): number {
  return items.reduce<number>(
    (sum, item) => sum + (ITEM_INSURANCE_VALUE[item.type] ?? 0),
    0,
  );
}

function premiumBeforeRounding(
  items: QuoteItem[],
  customer: Customer,
  contractIndex: number,
): number {
  const base = componentBasePremium(items) + otherBasePremium(items);
  const surcharges = itemSurcharges(items);
  const firstInsurance = base * FIRST_INSURANCE_RATE;
  const wideModifiers = policyWideModifiers(base, customer, contractIndex);
  return base + surcharges + firstInsurance + wideModifiers + PROCESSING_FEE_G;
}

export function quotePolicy(
  items: QuoteItem[],
  customer: Customer,
  contractIndex: number,
): QuotePolicy {
  for (const item of items) {
    if (ITEM_BASE_PREMIUM[item.type] === undefined) {
      throw new Error(`unknown item type: ${item.type}`);
    }
  }
  const premium = Math.ceil(premiumBeforeRounding(items, customer, contractIndex));
  return { premium, insuranceSum: insuranceSum(items) };
}

export function quotePremium(
  items: QuoteItem[],
  customer: Customer,
  contractIndex: number,
): number {
  return quotePolicy(items, customer, contractIndex).premium;
}
