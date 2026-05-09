import { Item } from './types.js';

export interface ItemPricing {
  insuranceValue: number;
  basePremium: number;
}

const MAIN_ITEM_PRICING: Record<string, ItemPricing> = {
  sword: { insuranceValue: 1000, basePremium: 100 },
  amulet: { insuranceValue: 600, basePremium: 60 },
  staff: { insuranceValue: 800, basePremium: 80 },
  potion: { insuranceValue: 400, basePremium: 40 },
};

export const COMPONENT_VALUE = 250;
export const COMPONENT_BASE_PREMIUM = 25;
export const COMPONENT_BLOCK_BASE_PREMIUM = 60;
export const COMPONENT_BLOCK_SIZE = 3;

export function isMainItem(item: Item): boolean {
  return item.type in MAIN_ITEM_PRICING;
}

export function isComponent(item: Item): boolean {
  return !isMainItem(item);
}

export function getMainItemPricing(type: string): ItemPricing | undefined {
  return MAIN_ITEM_PRICING[type];
}

/**
 * Compute the insurance value of an item.
 */
export function itemInsuranceValue(item: Item): number {
  if (isMainItem(item)) {
    return MAIN_ITEM_PRICING[item.type].insuranceValue;
  }
  return COMPONENT_VALUE;
}

/**
 * Compute total insurance sum for a list of items.
 */
export function totalInsuranceSum(items: Item[]): number {
  return items.reduce((sum, item) => sum + itemInsuranceValue(item), 0);
}

/**
 * Compute the base premium contribution from main items (with surcharges
 * for cursed/highly-enchanted applied per item).
 */
function mainItemPremium(item: Item): number {
  const base = MAIN_ITEM_PRICING[item.type].basePremium;
  let factor = 1;
  if (item.cursed) factor += 0.5;
  if ((item.enchantment ?? 0) >= 5) factor += 0.3;
  return base * factor;
}

/**
 * Compute base premium for components, applying the 3-alike block rule.
 * Components of the same type are grouped into blocks of 3 with a
 * discounted base premium (60 G), with leftovers at 25 G each.
 * Per-item surcharges (cursed, high enchantment) apply to each component
 * within the group proportionally.
 */
function componentsPremium(components: Item[]): number {
  // Group by type
  const groups = new Map<string, Item[]>();
  for (const c of components) {
    if (!groups.has(c.type)) groups.set(c.type, []);
    groups.get(c.type)!.push(c);
  }

  let total = 0;
  for (const group of groups.values()) {
    // Compute base for group: blocks of 3 at 60G, leftovers at 25G each
    const blocks = Math.floor(group.length / COMPONENT_BLOCK_SIZE);
    const leftovers = group.length % COMPONENT_BLOCK_SIZE;
    const groupBase =
      blocks * COMPONENT_BLOCK_BASE_PREMIUM + leftovers * COMPONENT_BASE_PREMIUM;

    // Apply per-item surcharges as average factor across the group
    // (component-level cursed/enchantment surcharges scale the group base
    // proportionally).
    const totalFactor = group.reduce((s, item) => {
      let f = 1;
      if (item.cursed) f += 0.5;
      if ((item.enchantment ?? 0) >= 5) f += 0.3;
      return s + f;
    }, 0);
    const avgFactor = totalFactor / group.length;
    total += groupBase * avgFactor;
  }
  return total;
}

/**
 * Round in MHPCO's favor.
 * For premiums (customer pays), round UP.
 * For payouts (MHPCO pays), round DOWN.
 */
export function roundUp(n: number): number {
  return Math.ceil(n - 1e-9);
}

export function roundDown(n: number): number {
  return Math.floor(n + 1e-9);
}

export interface QuoteContext {
  yearsWithMHPCO: number;
  isFirstContract: boolean;
}

/**
 * Compute the premium for a list of items given the customer context.
 */
export function computePremium(items: Item[], ctx: QuoteContext): number {
  let premium = 0;
  for (const item of items) {
    if (isMainItem(item)) {
      premium += mainItemPremium(item);
    }
  }
  const components = items.filter(isComponent);
  premium += componentsPremium(components);

  // Customer-level modifiers
  if (ctx.yearsWithMHPCO >= 2) {
    premium *= 0.8; // 20% loyalty discount
  }
  if (ctx.isFirstContract) {
    premium *= 1.1; // 10% initial assessment surcharge
  } else {
    premium *= 0.85; // 15% repeat discount
  }

  // Processing fee
  premium += 5;

  return roundUp(premium);
}
