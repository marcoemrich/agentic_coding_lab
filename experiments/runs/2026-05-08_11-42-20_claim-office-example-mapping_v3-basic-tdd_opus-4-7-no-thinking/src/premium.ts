import {
  Customer,
  Item,
  MAIN_ITEM_VALUES,
  COMPONENT_BASE_PREMIUM,
  COMPONENT_BLOCK_PREMIUM,
  isComponent,
  isMainItem,
  ItemType,
  COMPONENT_TYPES,
} from './types.js';

export const KNOWN_ITEM_TYPES: ItemType[] = [
  'sword', 'amulet', 'staff', 'potion', 'rune', 'moonstone',
];

export function isKnownItemType(t: string): t is ItemType {
  return (KNOWN_ITEM_TYPES as string[]).includes(t);
}

/**
 * Compute base premium for a single main item including its item-specific modifiers
 * (curse, high enchantment). Returns a fractional value.
 */
function mainItemPremiumWithItemModifiers(item: Item): number {
  if (!isMainItem(item)) {
    throw new Error('mainItemPremiumWithItemModifiers called for component');
  }
  const base = MAIN_ITEM_VALUES[item.type].basePremium;
  let total = base;
  if (item.cursed) {
    total += base * 0.5;
  }
  if (item.enchantment !== undefined && item.enchantment >= 5) {
    total += base * 0.3;
  }
  return total;
}

/**
 * Compute base premium for components grouped by their type.
 * "alike" means exactly the same type, and a block applies only when there are exactly 3.
 */
function componentsBasePremium(items: Item[]): number {
  let total = 0;
  for (const compType of COMPONENT_TYPES) {
    const count = items.filter((i) => i.type === compType).length;
    if (count === 0) continue;
    if (count === 3) {
      total += COMPONENT_BLOCK_PREMIUM;
    } else {
      total += count * COMPONENT_BASE_PREMIUM;
    }
  }
  return total;
}

/**
 * Compute base premium for the policy: sum of all items' base premiums (with item-specific
 * modifiers for cursed / high enchantment applied to main items, and block discount for components).
 */
export function policyBasePremiumWithItemModifiers(items: Item[]): number {
  let total = 0;
  for (const item of items) {
    if (isMainItem(item)) {
      total += mainItemPremiumWithItemModifiers(item);
    }
  }
  total += componentsBasePremium(items);
  return total;
}

/**
 * The plain base premium of all items (no modifiers at all). Used to compute policy-wide
 * percentage modifiers (loyalty, first insurance, follow-up contract).
 */
export function policyBasePremiumPlain(items: Item[]): number {
  let total = 0;
  for (const item of items) {
    if (isMainItem(item)) {
      total += MAIN_ITEM_VALUES[item.type].basePremium;
    }
  }
  total += componentsBasePremium(items);
  return total;
}

export function quotePremium(
  customer: Customer,
  items: Item[],
  contractIndex: number
): number {
  if (items.length === 0) {
    return 5;
  }

  // Item-specific modifiers (cursed, high enchantment) apply to the BASE premium of the
  // affected item. Policy-wide modifiers (loyalty, first insurance, follow-up contract) apply
  // to the policy base premium (sum of all item base premiums).
  const policyBase = policyBasePremiumPlain(items);
  const itemModified = policyBasePremiumWithItemModifiers(items);

  let total = itemModified;

  // Policy-wide modifiers, all computed against the plain policy base premium.
  if (customer.yearsWithMHPCO >= 2) {
    total -= policyBase * 0.2;
  }
  // First insurance surcharge always applies (each item is treated as first insurance).
  total += policyBase * 0.1;
  if (contractIndex >= 1) {
    total -= policyBase * 0.15;
  }

  // Processing fee at the very end.
  total += 5;

  // Round up (in MHPCO's favor for premium).
  return Math.ceil(total);
}
