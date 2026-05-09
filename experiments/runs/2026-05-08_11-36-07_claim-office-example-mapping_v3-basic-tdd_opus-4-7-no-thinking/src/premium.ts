import {
  Customer,
  Item,
  MainItem,
  COMPONENT_BASE_PREMIUM,
  COMPONENT_BLOCK_OF_3_BASE_PREMIUM,
  COMPONENT_TYPES,
  MAIN_ITEM_BASE_PREMIUM,
  isComponent,
  isMainItem,
} from './types.js';

export interface PremiumInput {
  items: Item[];
  customer: Customer;
  isFollowUp: boolean;
}

interface ItemBreakdown {
  baseTotal: number; // base premium for this item (or block) before item-specific surcharges
  itemSurcharge: number; // cursed, high enchantment additions
}

function itemBasePremium(item: MainItem): number {
  return MAIN_ITEM_BASE_PREMIUM[item.type];
}

function itemSurcharges(item: MainItem, basePremium: number): number {
  let surcharge = 0;
  if (item.cursed) surcharge += basePremium * 0.5;
  if ((item.enchantment ?? 0) >= 5) surcharge += basePremium * 0.3;
  return surcharge;
}

/**
 * Compute the policy base premium (sum of all item base premiums)
 * and item-specific surcharge total. Components in groups of exactly 3
 * alike receive a discounted block premium.
 */
function computeBaseAndSurcharges(items: Item[]): { policyBase: number; itemSurchargeTotal: number } {
  let policyBase = 0;
  let itemSurchargeTotal = 0;

  // Component grouping: group by type, treat blocks of exactly 3
  const componentCounts: Record<string, number> = {};
  for (const item of items) {
    if (isComponent(item)) {
      componentCounts[item.type] = (componentCounts[item.type] || 0) + 1;
    } else if (isMainItem(item)) {
      const base = itemBasePremium(item);
      policyBase += base;
      itemSurchargeTotal += itemSurcharges(item, base);
    } else {
      throw new Error(`Unknown item type: ${(item as any).type}`);
    }
  }

  for (const [type, count] of Object.entries(componentCounts)) {
    if (!COMPONENT_TYPES.has(type)) {
      throw new Error(`Unknown component type: ${type}`);
    }
    // Block requires exactly 3 alike. Per examples:
    //   2 → 50, 3 → 60, 4 → 100, 7 → 175.
    // So block ONLY applies if the count is exactly 3.
    if (count === 3) {
      policyBase += COMPONENT_BLOCK_OF_3_BASE_PREMIUM;
    } else {
      policyBase += count * COMPONENT_BASE_PREMIUM;
    }
  }

  return { policyBase, itemSurchargeTotal };
}

export function computePremium(input: PremiumInput): number {
  // Validate item types
  for (const item of input.items) {
    if (!isComponent(item) && !isMainItem(item)) {
      throw new Error(`Unknown item type: ${(item as any).type}`);
    }
  }

  const { policyBase, itemSurchargeTotal } = computeBaseAndSurcharges(input.items);

  // Policy-wide modifiers apply to the policy base premium.
  let policyMods = 0;
  // First insurance: each quote always carries the +10% surcharge (each item is "first insurance" for that item).
  policyMods += policyBase * 0.1;
  if (input.customer.yearsWithMHPCO >= 2) {
    policyMods -= policyBase * 0.2;
  }
  if (input.isFollowUp) {
    policyMods -= policyBase * 0.15;
  }

  const total = policyBase + itemSurchargeTotal + policyMods + 5;
  // Round in MHPCO's favor (premium → up)
  return Math.ceil(total - 1e-9);
}
