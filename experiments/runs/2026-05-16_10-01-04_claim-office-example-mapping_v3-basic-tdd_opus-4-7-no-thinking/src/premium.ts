import {
  Item,
  Customer,
  MAIN_ITEMS,
  COMPONENT_BASE_PREMIUM,
  BLOCK_BASE_PREMIUM,
  isMainItem,
  isComponentItem,
  MainItem,
} from './types.js';

const PROCESSING_FEE = 5;
const CURSE_SURCHARGE = 0.5;
const HIGH_ENCHANTMENT_SURCHARGE = 0.3;
const HIGH_ENCHANTMENT_THRESHOLD = 5;
const LOYALTY_DISCOUNT = 0.2;
const LOYALTY_THRESHOLD_YEARS = 2;
const FIRST_INSURANCE_SURCHARGE = 0.1;
const FOLLOW_UP_DISCOUNT = 0.15;

function validateItem(item: Item): void {
  if (!isMainItem(item) && !isComponentItem(item)) {
    throw new Error(`Unknown item type: ${item.type}`);
  }
}

function itemBasePremium(item: Item): number {
  if (isMainItem(item)) {
    return MAIN_ITEMS[item.type].basePremium;
  }
  return COMPONENT_BASE_PREMIUM;
}

/**
 * Calculate component contribution to base premium, accounting for blocks of 3 alike.
 * Returns the total base premium for the components, and items still unhandled.
 */
function componentsBasePremium(items: Item[]): number {
  // group by exact type
  const counts: Record<string, number> = {};
  for (const item of items) {
    counts[item.type] = (counts[item.type] || 0) + 1;
  }
  let total = 0;
  for (const [, count] of Object.entries(counts)) {
    // Each group of exactly 3 alike is a block. But "exactly 3" — what about 6?
    // Prompt says "3 runes + 3 moonstones → 120 G base premium (two separate blocks)".
    // So multiple blocks of 3 work across different types but within the same type?
    // "block requires exactly 3" — interpretation: any group of 3 alike yields a block.
    // Examples: 4 runes -> no block (100), 7 runes -> 175 (no block).
    // So blocks are formed only when count === 3 (exactly 3 per type).
    // What about 6 runes? Not explicitly tested. Let me interpret: blocks only when count === 3.
    if (count === 3) {
      total += BLOCK_BASE_PREMIUM;
    } else {
      total += count * COMPONENT_BASE_PREMIUM;
    }
  }
  return total;
}

function itemRiskSurcharge(item: Item): number {
  if (!isMainItem(item)) return 0;
  const base = MAIN_ITEMS[item.type].basePremium;
  let surcharge = 0;
  if (item.cursed) {
    surcharge += base * CURSE_SURCHARGE;
  }
  if ((item.enchantment ?? 0) >= HIGH_ENCHANTMENT_THRESHOLD) {
    surcharge += base * HIGH_ENCHANTMENT_SURCHARGE;
  }
  return surcharge;
}

export function calculatePremium(customer: Customer, items: Item[]): number {
  for (const item of items) validateItem(item);

  if (items.length === 0) {
    return PROCESSING_FEE;
  }

  // policy base premium = sum of all item base premiums (with block discount)
  const mainItems = items.filter(isMainItem);
  const componentItems = items.filter((i) => !isMainItem(i));

  const mainBase = mainItems.reduce((sum, it) => sum + itemBasePremium(it), 0);
  const compBase = componentsBasePremium(componentItems);
  const policyBase = mainBase + compBase;

  // item-specific surcharges
  const itemSurcharges = items.reduce((sum, it) => sum + itemRiskSurcharge(it), 0);

  // base + item-specific surcharges
  let amount = policyBase + itemSurcharges;

  // policy-wide modifiers (loyalty, first insurance, follow-up) apply to policy base
  // Per the prompt's integration example: first insurance applies to every item in a quote
  // regardless of customer history; follow-up discount applies when contractIndex > 0.
  const policyModifiers =
    (customer.yearsWithMHPCO >= LOYALTY_THRESHOLD_YEARS ? -LOYALTY_DISCOUNT : 0) +
    FIRST_INSURANCE_SURCHARGE +
    (customer.contractIndex > 0 ? -FOLLOW_UP_DISCOUNT : 0);

  amount += policyBase * policyModifiers;

  // Round up (MHPCO's favor) - add fee
  return Math.ceil(amount) + PROCESSING_FEE;
}
