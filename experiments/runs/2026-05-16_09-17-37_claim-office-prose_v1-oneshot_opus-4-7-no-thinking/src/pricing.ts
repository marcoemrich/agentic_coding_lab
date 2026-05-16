import type { Item } from "./types.js";

export interface PriceEntry {
  insured: number;
  base: number;
}

export const MAIN_ITEM_PRICES: Record<string, PriceEntry> = {
  sword: { insured: 1000, base: 100 },
  amulet: { insured: 600, base: 60 },
  staff: { insured: 800, base: 80 },
  potion: { insured: 400, base: 40 },
};

export const COMPONENT_INSURED = 250;
export const COMPONENT_BASE = 25;
export const COMPONENT_BLOCK_BASE = 60;
export const COMPONENT_BLOCK_SIZE = 3;

export const PROCESSING_FEE = 5;

export function isComponent(item: Item): boolean {
  return !(item.type in MAIN_ITEM_PRICES);
}

export function insuredValue(item: Item): number {
  if (isComponent(item)) return COMPONENT_INSURED;
  return MAIN_ITEM_PRICES[item.type].insured;
}

export function totalInsuredSum(items: Item[]): number {
  return items.reduce((acc, it) => acc + insuredValue(it), 0);
}

/**
 * Compute base premium for the items, accounting for component-block special
 * pricing (3 alike components get a 60 G base block, replacing 3 × 25 G).
 * Per-item cursed/enchantment surcharges are applied to each item's base
 * (for component blocks, applied per the block's members).
 */
export function itemPremiums(items: Item[]): number {
  // Separate main items from components by exact type.
  const main: Item[] = [];
  const components: Map<string, Item[]> = new Map();

  for (const it of items) {
    if (isComponent(it)) {
      const arr = components.get(it.type) ?? [];
      arr.push(it);
      components.set(it.type, arr);
    } else {
      main.push(it);
    }
  }

  let total = 0;

  for (const it of main) {
    total += applyItemModifiers(MAIN_ITEM_PRICES[it.type].base, it);
  }

  for (const [, group] of components) {
    // Form blocks of 3 alike components. Within each block, surcharges from
    // individual components apply additively to the block's base (a cursed
    // member adds 50% on its share, an enchanted member 30%).
    let i = 0;
    while (i + COMPONENT_BLOCK_SIZE <= group.length) {
      const block = group.slice(i, i + COMPONENT_BLOCK_SIZE);
      total += applyBlockModifiers(COMPONENT_BLOCK_BASE, block);
      i += COMPONENT_BLOCK_SIZE;
    }
    // Remaining components individually.
    for (; i < group.length; i++) {
      total += applyItemModifiers(COMPONENT_BASE, group[i]);
    }
  }

  return total;
}

function itemSurchargeFactor(item: Item): number {
  let f = 1;
  if (item.cursed) f += 0.5;
  if ((item.enchantment ?? 0) >= 5) f += 0.3;
  return f;
}

function applyItemModifiers(base: number, item: Item): number {
  return base * itemSurchargeFactor(item);
}

function applyBlockModifiers(base: number, block: Item[]): number {
  // Apply each member's surcharge to its 1/N share of the block base.
  const share = base / block.length;
  let sum = 0;
  for (const item of block) {
    sum += share * itemSurchargeFactor(item);
  }
  return sum;
}

/** Round in MHPCO's favor: round up to the next whole G. */
export function roundInFavor(x: number): number {
  // Use a tiny epsilon to avoid float artefacts pushing whole numbers up.
  const eps = 1e-9;
  return Math.ceil(x - eps);
}

export interface QuoteContext {
  yearsWithMHPCO: number;
  /** Number of quotes that were issued BEFORE this one in the scenario. */
  prevQuoteCount: number;
}

export function computePremium(items: Item[], ctx: QuoteContext): number {
  let premium = itemPremiums(items);

  // Customer-level modifiers (multiplicative).
  let factor = 1;
  if (ctx.yearsWithMHPCO >= 2) factor -= 0.2;
  if (ctx.prevQuoteCount === 0) {
    factor += 0.1; // initial assessment
  } else {
    factor -= 0.15; // discount on each contract after first
  }

  premium *= factor;
  premium += PROCESSING_FEE;

  return roundInFavor(premium);
}
