import {
  Item,
  Customer,
  MAIN_ITEM_PRICELIST,
  COMPONENT_BASE_PREMIUM,
  COMPONENT_BLOCK_PREMIUM,
  COMPONENT_BLOCK_SIZE,
  PROCESSING_FEE,
  isMainItem,
  isComponent,
} from './types.js';

/**
 * Compute the base premium for a single main item before any modifiers.
 */
function mainItemBase(item: Item): number {
  return MAIN_ITEM_PRICELIST[item.type].basePremium;
}

/**
 * Compute base premium for components of a given type, applying block discount.
 * Block applies for exactly N=3 alike (same type) components.
 * For >3, blocks do NOT apply (text says "block requires exactly 3").
 */
function componentTypeBase(count: number): number {
  if (count === COMPONENT_BLOCK_SIZE) return COMPONENT_BLOCK_PREMIUM;
  return count * COMPONENT_BASE_PREMIUM;
}

/**
 * Compute item-level base premium contribution and apply per-item surcharges (cursed, high enchantment).
 * Returns the modified item premium.
 * Components don't have enchantment/cursed in this kata's model.
 */
function itemPremiumWithItemMods(item: Item, base: number): number {
  let p = base;
  if (item.cursed) {
    p += 0.5 * base;
  }
  if ((item.enchantment ?? 0) >= 5) {
    p += 0.3 * base;
  }
  return p;
}

/**
 * Round up in MHPCO's favor for premiums.
 */
function roundPremium(value: number): number {
  return Math.ceil(value - 1e-9);
}

export function computePremium(
  items: Item[],
  customer: Customer,
  contractIndex: number
): number {
  if (items.length === 0) {
    return PROCESSING_FEE;
  }

  // Compute item base premiums (with block logic for components)
  // Sum policy base from item base premiums (no item-specific mods yet)
  // Then apply item-specific modifiers per item (curse, high ench)
  // Then apply policy-wide modifiers to policy base.

  // For components: group by type, compute base via componentTypeBase
  const componentCountsByType: Record<string, number> = {};
  const mainItems: Item[] = [];
  const componentItems: Item[] = [];

  for (const item of items) {
    if (isMainItem(item.type)) {
      mainItems.push(item);
    } else if (isComponent(item.type)) {
      componentCountsByType[item.type] = (componentCountsByType[item.type] ?? 0) + 1;
      componentItems.push(item);
    } else {
      throw new Error(`Unknown item type: ${item.type}`);
    }
  }

  // Item base premiums
  // For each main item: base = mainItemBase
  // For each component: base = componentTypeBase(count) / count (so it splits evenly)
  // Actually for items modifiers (cursed, ench), components don't have them per kata, so simpler:
  // Sum base premiums and apply item modifiers separately.

  let policyBase = 0;
  // Track item-specific surcharges as additional amounts to add
  let itemSurcharges = 0;

  for (const item of mainItems) {
    const base = mainItemBase(item);
    policyBase += base;
    const withMods = itemPremiumWithItemMods(item, base);
    itemSurcharges += withMods - base;
  }

  // Components: base via block logic, no item-specific mods
  for (const type of Object.keys(componentCountsByType)) {
    const count = componentCountsByType[type];
    policyBase += componentTypeBase(count);
  }

  // Apply policy-wide modifiers to policyBase
  let total = policyBase + itemSurcharges;

  // Loyalty: 2+ years, -20% of policy base
  if (customer.yearsWithMHPCO >= 2) {
    total -= 0.2 * policyBase;
  }

  // First insurance: +10% of policy base (each item is treated as first insurance regardless)
  total += 0.1 * policyBase;

  // Follow-up contract: -15% of policy base for each contract after the first
  if (contractIndex >= 1) {
    total -= 0.15 * policyBase;
  }

  total += PROCESSING_FEE;

  return roundPremium(total);
}
