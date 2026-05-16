import { Item, MainItemType } from "./types.js";

const MAIN_ITEMS: Record<MainItemType, { value: number; base: number }> = {
  sword: { value: 1000, base: 100 },
  amulet: { value: 600, base: 60 },
  staff: { value: 800, base: 80 },
  potion: { value: 400, base: 40 },
};

const COMPONENT_VALUE = 250;
const COMPONENT_BASE = 25;
const COMPONENT_BUNDLE_BASE = 60;

export function isMainItem(type: string): type is MainItemType {
  return type in MAIN_ITEMS;
}

export function itemInsuranceValue(item: Item): number {
  if (isMainItem(item.type)) {
    return MAIN_ITEMS[item.type].value;
  }
  return COMPONENT_VALUE;
}

export function totalInsuranceSum(items: Item[]): number {
  return items.reduce((sum, item) => sum + itemInsuranceValue(item), 0);
}

// Round up in MHPCO's favor.
function roundUp(n: number): number {
  return Math.ceil(n - 1e-9);
}

function itemSurcharges(item: Item): number {
  let factor = 1;
  if (item.cursed) factor += 0.5;
  if ((item.enchantment ?? 0) >= 5) factor += 0.3;
  return factor;
}

/**
 * Compute the base premium for the items, including component bundling
 * and per-item surcharges (curse, high enchantment).
 */
function itemsPremium(items: Item[]): number {
  let total = 0;

  // Split into main items and components.
  const mainItems: Item[] = [];
  const components: Item[] = [];
  for (const item of items) {
    if (isMainItem(item.type)) {
      mainItems.push(item);
    } else {
      components.push(item);
    }
  }

  // Main items: each gets its own base premium with its surcharges.
  for (const it of mainItems) {
    total += MAIN_ITEMS[it.type as MainItemType].base * itemSurcharges(it);
  }

  // Components: group by type for bundling.
  const byType = new Map<string, Item[]>();
  for (const c of components) {
    const arr = byType.get(c.type) ?? [];
    arr.push(c);
    byType.set(c.type, arr);
  }

  for (const [, group] of byType) {
    // Form bundles of 3 alike components. Within a bundle, surcharges
    // apply if any member has them — but more simply, the bundle base
    // applies and surcharges scale the bundle's bundled cost.
    // We apply each component's surcharge proportionally: the bundle
    // base 60G replaces 3 × 25G = 75G; we'll prorate per item, so
    // each component in a bundle contributes 20G + surcharges of its own.
    let i = 0;
    while (i + 3 <= group.length) {
      const trio = group.slice(i, i + 3);
      // Bundle base 60G total, split equally: each contributes
      // (60/3) * itsSurcharges.
      for (const c of trio) {
        total += (COMPONENT_BUNDLE_BASE / 3) * itemSurcharges(c);
      }
      i += 3;
    }
    // Remaining components at full base.
    for (; i < group.length; i++) {
      total += COMPONENT_BASE * itemSurcharges(group[i]);
    }
  }

  return total;
}

export interface QuoteContext {
  yearsWithMHPCO: number;
  contractIndex: number; // 0 for first contract, 1 for second, ...
}

export function computePremium(items: Item[], ctx: QuoteContext): number {
  let premium = itemsPremium(items);

  // Loyalty discount: ≥ 2 years -> 20% off.
  if (ctx.yearsWithMHPCO >= 2) {
    premium *= 0.8;
  }

  // First insurance surcharge / repeat-contract discount.
  if (ctx.contractIndex === 0) {
    premium *= 1.1;
  } else {
    premium *= 0.85;
  }

  // 5G processing fee added to every premium.
  premium += 5;

  // Round in MHPCO's favor (up).
  return roundUp(premium);
}
