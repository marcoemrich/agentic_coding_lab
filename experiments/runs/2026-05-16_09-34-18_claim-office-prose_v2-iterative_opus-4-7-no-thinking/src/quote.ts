import type { Customer, Item } from "./types.js";
import {
  MAIN_ITEM_PRICES,
  COMPONENT_BASE_PREMIUM,
  COMPONENT_BLOCK_BASE_PREMIUM,
  PROCESSING_FEE,
  isMainItem,
} from "./pricing.js";

/**
 * Rounds in MHPCO's favor (i.e., always up to the next whole G).
 */
export function roundInFavor(amount: number): number {
  // Use a small epsilon to avoid floating-point issues like 100.00000001 -> 101
  const epsilon = 1e-9;
  return Math.ceil(amount - epsilon);
}

/**
 * Computes the per-item base premium with per-item risk surcharges
 * (cursed +50%, enchantment >= 5 +30%).
 */
function premiumForMainItem(item: Item): number {
  const base = MAIN_ITEM_PRICES[item.type].basePremium;
  return applyItemSurcharges(base, item);
}

function applyItemSurcharges(base: number, item: Item): number {
  let factor = 1;
  if (item.cursed) factor += 0.5;
  if ((item.enchantment ?? 0) >= 5) factor += 0.3;
  return base * factor;
}

/**
 * Computes the base premium contribution from a set of components,
 * grouping alike components into blocks of 3 for the 60G special rate.
 * Per-item surcharges (cursed / high enchantment) are applied to each
 * component's effective base premium (computed as that component's
 * share of its containing group's base).
 */
function premiumForComponents(items: Item[]): number {
  // Group components by their concrete type (e.g., "rune", "moonstone")
  const groups = new Map<string, Item[]>();
  for (const item of items) {
    const arr = groups.get(item.type) ?? [];
    arr.push(item);
    groups.set(item.type, arr);
  }

  let total = 0;
  for (const group of groups.values()) {
    total += premiumForComponentGroup(group);
  }
  return total;
}

function premiumForComponentGroup(group: Item[]): number {
  // Compute per-item base shares: blocks of 3 contribute 60G total
  // (20G per item), leftovers contribute 25G per item.
  const fullBlocks = Math.floor(group.length / 3);
  const remainder = group.length - fullBlocks * 3;

  // Assign a base premium to each item:
  // First (3 * fullBlocks) items are in blocks of 3 with shared 60G base -> 20G each
  // Remaining items are 25G each
  let total = 0;
  for (let i = 0; i < group.length; i++) {
    const inBlock = i < fullBlocks * 3;
    const itemBase = inBlock
      ? COMPONENT_BLOCK_BASE_PREMIUM / 3
      : COMPONENT_BASE_PREMIUM;
    total += applyItemSurcharges(itemBase, group[i]);
  }
  return total;
}

export interface QuoteContext {
  customer: Customer;
  // Number of contracts already issued in this scenario (before this quote)
  contractsSoFar: number;
}

export function computePremium(items: Item[], ctx: QuoteContext): number {
  // 1. Sum base premiums (with per-item risk surcharges)
  let premium = 0;
  for (const item of items) {
    if (isMainItem(item.type)) {
      premium += premiumForMainItem(item);
    }
  }
  premium += premiumForComponents(items.filter((i) => !isMainItem(i.type)));

  // 2. Customer-level modifiers (multiplicative)
  let factor = 1;
  if (ctx.customer.yearsWithMHPCO >= 2) factor -= 0.2; // loyalty discount
  if (ctx.contractsSoFar === 0) {
    factor += 0.1; // first insurance surcharge
  } else {
    factor -= 0.15; // subsequent-contract discount
  }
  premium *= factor;

  // 3. Processing fee
  premium += PROCESSING_FEE;

  // 4. Round in MHPCO's favor (up)
  return roundInFavor(premium);
}
