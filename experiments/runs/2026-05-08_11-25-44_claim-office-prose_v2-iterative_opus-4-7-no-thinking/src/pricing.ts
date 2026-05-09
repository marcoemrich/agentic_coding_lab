import type { Item } from './types.js';

const MAIN_ITEMS: Record<string, { insurance: number; base: number }> = {
  sword: { insurance: 1000, base: 100 },
  amulet: { insurance: 600, base: 60 },
  staff: { insurance: 800, base: 80 },
  potion: { insurance: 400, base: 40 },
};

const COMPONENT_TYPES = new Set(['rune', 'moonstone']);
const COMPONENT_INSURANCE = 250;
const COMPONENT_BASE = 25;
const COMPONENT_BLOCK_BASE = 60; // for 3 alike components

export function isComponent(itemType: string): boolean {
  return COMPONENT_TYPES.has(itemType);
}

export function isMainItem(itemType: string): boolean {
  return itemType in MAIN_ITEMS;
}

export function getInsuranceValue(item: Item): number {
  if (isMainItem(item.type)) {
    return MAIN_ITEMS[item.type].insurance;
  }
  if (isComponent(item.type)) {
    return COMPONENT_INSURANCE;
  }
  // Unknown items — treat insurance as 0 (or could throw); be lenient
  return 0;
}

export function totalInsuranceSum(items: Item[]): number {
  return items.reduce((sum, item) => sum + getInsuranceValue(item), 0);
}

/**
 * Compute per-item base premium with risk surcharges (cursed, high enchantment).
 * For components, we group them into building-blocks of 3 alike components for
 * the base price, then apply risk surcharges per individual component.
 */
function itemRiskMultiplier(item: Item): number {
  let mult = 1;
  if (item.cursed) mult *= 1.5;
  if ((item.enchantment ?? 0) >= 5) mult *= 1.3;
  return mult;
}

function computeMainItemPremium(item: Item): number {
  const base = MAIN_ITEMS[item.type].base;
  return base * itemRiskMultiplier(item);
}

/**
 * For components: group alike components (by type) into buckets of 3 → 60G; remainder → 25G each.
 * Risk multipliers (cursed, enchantment) are applied per individual component, distributing
 * the bucket base across the components in the bucket equally.
 */
function computeComponentsPremium(components: Item[]): number {
  // Group by type
  const groups = new Map<string, Item[]>();
  for (const c of components) {
    if (!groups.has(c.type)) groups.set(c.type, []);
    groups.get(c.type)!.push(c);
  }
  let total = 0;
  for (const group of groups.values()) {
    // Form buckets of 3
    let i = 0;
    while (i + 3 <= group.length) {
      const bucket = group.slice(i, i + 3);
      // base is 60G for the whole bucket; distribute as 20G per component
      const perItemBase = COMPONENT_BLOCK_BASE / 3;
      for (const item of bucket) {
        total += perItemBase * itemRiskMultiplier(item);
      }
      i += 3;
    }
    // Remainder at 25G each
    for (; i < group.length; i++) {
      total += COMPONENT_BASE * itemRiskMultiplier(group[i]);
    }
  }
  return total;
}

export interface QuoteContext {
  yearsWithMHPCO: number;
  contractIndex: number; // 0 = first contract, 1+ = subsequent
}

/**
 * Round in the MHPCO's favor (i.e., round up).
 */
function roundFavor(amount: number): number {
  return Math.ceil(amount - 1e-9);
}

export function computePremium(items: Item[], ctx: QuoteContext): number {
  const mains = items.filter((i) => isMainItem(i.type));
  const components = items.filter((i) => isComponent(i.type));

  let subtotal = 0;
  for (const m of mains) {
    subtotal += computeMainItemPremium(m);
  }
  subtotal += computeComponentsPremium(components);

  // Apply policy-level modifiers
  // Loyalty discount: ≥2 years
  if (ctx.yearsWithMHPCO >= 2) {
    subtotal *= 0.8;
  }
  // First insurance surcharge or subsequent contract discount
  if (ctx.contractIndex === 0) {
    subtotal *= 1.1;
  } else {
    subtotal *= 0.85;
  }

  // Processing fee
  subtotal += 5;

  return roundFavor(subtotal);
}
