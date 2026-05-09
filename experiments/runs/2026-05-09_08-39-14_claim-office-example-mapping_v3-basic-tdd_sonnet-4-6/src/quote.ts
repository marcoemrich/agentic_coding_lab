import {
  MAIN_ITEM_DATA,
  COMPONENT_BASE_PREMIUM,
  COMPONENT_BLOCK_PREMIUM,
  PROCESSING_FEE,
  MAIN_ITEM_TYPES,
  isMainItem,
  type Item,
  type Customer,
} from './types.js';

/**
 * Computes the combined base premium for a list of component items.
 * Items are grouped by type; exactly 3 of the same type = block at 60G,
 * otherwise 25G each.
 */
export function computeComponentBasePremium(components: Item[]): number {
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
 * Returns the base premium for a single item (without item-specific modifiers).
 * For components, returns 25G.
 */
export function computeItemBasePremium(item: Item): number {
  if (isMainItem(item)) {
    return MAIN_ITEM_DATA[item.type].basePremium;
  }
  return COMPONENT_BASE_PREMIUM;
}

/**
 * Returns the adjusted premium for a single main item after applying
 * item-specific surcharges (cursed, high enchantment).
 * For components, returns 25G (no item-specific modifiers on components).
 */
export function computeItemAdjustedPremium(item: Item): number {
  const base = computeItemBasePremium(item);
  if (!isMainItem(item)) {
    return base;
  }
  let surcharge = 0;
  if (item.cursed) {
    surcharge += base * 0.5;
  }
  if ((item.enchantment ?? 0) >= 5) {
    surcharge += base * 0.3;
  }
  return base + surcharge;
}

/**
 * Computes the total premium for a quote.
 *
 * @param items - List of items to insure
 * @param customer - Customer information
 * @param quoteIndex - Zero-based index of this quote among all quotes in the scenario
 *                     (0 = first quote, 1 = second quote, etc.)
 */
export function computeQuotePremium(
  items: Item[],
  customer: Customer,
  quoteIndex: number,
): number {
  const mainItems = items.filter(isMainItem);
  const components = items.filter((i) => !MAIN_ITEM_TYPES.has(i.type));

  // Policy base = sum of unmodified item base premiums
  const componentGroupPremium = computeComponentBasePremium(components);
  const mainItemBasePremiumSum = mainItems.reduce(
    (sum, item) => sum + computeItemBasePremium(item),
    0,
  );
  const policyBase = mainItemBasePremiumSum + componentGroupPremium;

  // Item-specific adjustments: sum of surcharges for main items
  const itemSurcharges = mainItems.reduce((sum, item) => {
    return sum + (computeItemAdjustedPremium(item) - computeItemBasePremium(item));
  }, 0);

  // Policy-wide modifiers applied to policyBase
  let policyWideModifier = 0;
  if (customer.yearsWithMHPCO >= 2) {
    policyWideModifier -= policyBase * 0.2; // loyalty discount
  }
  policyWideModifier += policyBase * 0.1; // first insurance surcharge (always)
  if (quoteIndex > 0) {
    policyWideModifier -= policyBase * 0.15; // follow-up contract discount
  }

  const rawPremium = policyBase + itemSurcharges + policyWideModifier + PROCESSING_FEE;

  // Round up in MHPCO's favor
  return Math.ceil(rawPremium);
}

/**
 * Validates items for a quote, throwing if any item type is unknown.
 */
export function validateQuoteItems(items: Item[]): void {
  for (const item of items) {
    if (!isValidItemType(item.type)) {
      throw new Error(`Unknown item type: ${item.type}`);
    }
  }
}

const KNOWN_COMPONENT_TYPES = new Set(['rune', 'moonstone']);

function isValidItemType(type: string): boolean {
  return MAIN_ITEM_TYPES.has(type) || KNOWN_COMPONENT_TYPES.has(type);
}
