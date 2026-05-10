import {
  MAIN_ITEM_TYPES,
  COMPONENT_ITEM_TYPES,
  COMPONENT_BASE_PREMIUM,
  COMPONENT_BLOCK_PREMIUM,
  getMainItemPricing,
  validateItemType,
} from './items.js';

export interface QuoteItem {
  type: string;
  material?: string;
  enchantment?: number;
  cursed?: boolean;
}

export interface Customer {
  yearsWithMHPCO: number;
}

export interface QuoteOptions {
  isFirstContract: boolean;
}

const PROCESSING_FEE = 5;

/**
 * Computes the raw base premium for a single main item (no surcharges).
 */
function itemRawBasePremium(item: QuoteItem): number {
  if (MAIN_ITEM_TYPES.has(item.type)) {
    return getMainItemPricing(item.type).basePremium;
  }
  return 0;
}

/**
 * Computes item-level surcharges (cursed + high enchantment) for a main item.
 */
function itemSurcharges(item: QuoteItem): number {
  if (!MAIN_ITEM_TYPES.has(item.type)) return 0;
  const pricing = getMainItemPricing(item.type);
  let surcharge = 0;
  if (item.cursed) {
    surcharge += pricing.basePremium * 0.5;
  }
  if ((item.enchantment ?? 0) >= 5) {
    surcharge += pricing.basePremium * 0.3;
  }
  return surcharge;
}

/**
 * Computes base premium for all components, applying the block discount rule.
 * Block discount: exactly 3 alike components → 60 G instead of 3*25 = 75 G
 */
function componentBasePremium(items: QuoteItem[]): number {
  const components = items.filter(i => COMPONENT_ITEM_TYPES.has(i.type));

  // Count by type
  const counts = new Map<string, number>();
  for (const item of components) {
    counts.set(item.type, (counts.get(item.type) ?? 0) + 1);
  }

  let total = 0;
  for (const [, count] of counts) {
    if (count === 3) {
      total += COMPONENT_BLOCK_PREMIUM;
    } else {
      total += count * COMPONENT_BASE_PREMIUM;
    }
  }
  return total;
}

/**
 * Compute the total premium for a quote.
 *
 * Modifier application order:
 * 1. Compute each item's base premium (with item-level surcharges: cursed, high enchantment)
 * 2. Sum to get policy base premium
 * 3. Apply policy-wide modifiers: loyalty discount, first insurance surcharge, follow-up discount
 * 4. Add processing fee
 * 5. Round up (ceiling) to MHPCO's favor
 */
export function computePremium(
  items: QuoteItem[],
  customer: Customer,
  opts: QuoteOptions
): number {
  // Validate all item types
  for (const item of items) {
    validateItemType(item.type);
  }

  // Compute policy base premium (raw, without item-level surcharges)
  let policyBasePremium = 0;
  for (const item of items) {
    if (MAIN_ITEM_TYPES.has(item.type)) {
      policyBasePremium += itemRawBasePremium(item);
    }
  }
  policyBasePremium += componentBasePremium(items);

  // Compute total item-level surcharges
  let totalItemSurcharges = 0;
  for (const item of items) {
    totalItemSurcharges += itemSurcharges(item);
  }

  // Policy-wide modifiers (applied to policy base premium only, not surcharges)
  let policyModifier = 0;

  // Loyalty discount: ≥2 years → -20%
  if (customer.yearsWithMHPCO >= 2) {
    policyModifier -= policyBasePremium * 0.2;
  }

  // First insurance surcharge: +10% (every item in a quote is treated as first insurance)
  policyModifier += policyBasePremium * 0.1;

  // Follow-up contract discount: -15% (only if not first contract)
  if (!opts.isFirstContract) {
    policyModifier -= policyBasePremium * 0.15;
  }

  const rawPremium = policyBasePremium + totalItemSurcharges + policyModifier + PROCESSING_FEE;

  // Round up (ceiling) in MHPCO's favor
  return Math.ceil(rawPremium);
}
