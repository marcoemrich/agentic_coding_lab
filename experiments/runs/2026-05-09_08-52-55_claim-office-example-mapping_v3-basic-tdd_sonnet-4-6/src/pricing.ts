import type { ItemInput, Customer } from "./types.js";

const MAIN_ITEM_PREMIUMS: Record<string, number> = {
  sword: 100,
  amulet: 60,
  staff: 80,
  potion: 40,
};

const COMPONENT_TYPES = new Set(["rune", "moonstone"]);
const COMPONENT_BASE_PREMIUM = 25;
const COMPONENT_BLOCK_PREMIUM = 60;
const PROCESSING_FEE = 5;

function isKnownItemType(type: string): boolean {
  return type in MAIN_ITEM_PREMIUMS || COMPONENT_TYPES.has(type);
}

/**
 * Compute the base premium for all items, applying block discounts for components.
 * Returns the sum of all item base premiums (before item-specific surcharges).
 * Also returns item-specific surcharges separately.
 */
function computeItemPremiums(items: ItemInput[]): {
  policyBasePremium: number;
  itemSurcharges: number;
} {
  // Validate all item types
  for (const item of items) {
    if (!isKnownItemType(item.type)) {
      throw new Error(`Unknown item type: ${item.type}`);
    }
  }

  // Count components by type
  const componentCounts = new Map<string, number>();
  for (const item of items) {
    if (COMPONENT_TYPES.has(item.type)) {
      componentCounts.set(item.type, (componentCounts.get(item.type) ?? 0) + 1);
    }
  }

  // Compute base premium for each item
  let policyBasePremium = 0;
  let itemSurcharges = 0;

  // Handle main items
  for (const item of items) {
    if (COMPONENT_TYPES.has(item.type)) continue;

    const basePremium = MAIN_ITEM_PREMIUMS[item.type]!;
    policyBasePremium += basePremium;

    // Item-specific surcharges
    let surcharge = 0;
    if (item.cursed) {
      surcharge += basePremium * 0.5;
    }
    if (item.enchantment !== undefined && item.enchantment >= 5) {
      surcharge += basePremium * 0.3;
    }
    itemSurcharges += surcharge;
  }

  // Handle components (grouped by type)
  for (const [, count] of componentCounts) {
    let basePremium: number;
    if (count === 3) {
      basePremium = COMPONENT_BLOCK_PREMIUM;
    } else {
      basePremium = count * COMPONENT_BASE_PREMIUM;
    }
    policyBasePremium += basePremium;
    // Components have no cursed/enchantment, so no item surcharges
  }

  return { policyBasePremium, itemSurcharges };
}

/**
 * Compute the quote (premium) for a list of items.
 * @param items - list of items to insure
 * @param customer - customer data
 * @param isFirstContract - true if this is the customer's first quote in the scenario
 */
export function computeQuote(
  items: ItemInput[],
  customer: Customer,
  isFirstContract: boolean
): number {
  const { policyBasePremium, itemSurcharges } = computeItemPremiums(items);

  // Policy-wide modifiers applied to policyBasePremium
  let policyWideAdjustment = 0;

  // Loyalty discount: customer with >= 2 years
  if (customer.yearsWithMHPCO >= 2) {
    policyWideAdjustment -= policyBasePremium * 0.2;
  }

  // First insurance surcharge: always applies (each item is a first insurance)
  policyWideAdjustment += policyBasePremium * 0.1;

  // Follow-up contract discount: applies on subsequent contracts
  if (!isFirstContract) {
    policyWideAdjustment -= policyBasePremium * 0.15;
  }

  const total = policyBasePremium + itemSurcharges + policyWideAdjustment + PROCESSING_FEE;

  // Round up (ceiling) in MHPCO's favor
  return Math.ceil(total);
}
