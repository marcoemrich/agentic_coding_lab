export type ItemType = 'sword' | 'amulet' | 'staff' | 'potion' | 'rune' | 'moonstone';

export interface Item {
  type: string;
  material?: string;
  enchantment?: number;
  cursed?: boolean;
}

export interface Customer {
  yearsWithMHPCO: number;
}

export interface QuoteContext {
  contractIndex: number;
}

const MAIN_ITEM_BASE: Record<string, number> = {
  sword: 100,
  amulet: 60,
  staff: 80,
  potion: 40,
};

const COMPONENT_TYPES = new Set(['rune', 'moonstone']);
const COMPONENT_SINGLE_PREMIUM = 25;
const COMPONENT_BLOCK_PREMIUM = 60;
const PROCESSING_FEE = 5;

function itemModifier(item: Item): number {
  let m = 1;
  if (item.cursed) m *= 1.5;
  if ((item.enchantment ?? 0) >= 5) m *= 1.3;
  return m;
}

function mainItemPremium(item: Item): number {
  const base = MAIN_ITEM_BASE[item.type];
  return base * itemModifier(item);
}

function componentsPremium(items: Item[]): number {
  // Group components by type to apply building-block pricing.
  const byType: Record<string, Item[]> = {};
  for (const it of items) {
    if (!COMPONENT_TYPES.has(it.type)) continue;
    (byType[it.type] ||= []).push(it);
  }

  let total = 0;
  for (const group of Object.values(byType)) {
    // Apply per-item modifiers individually; building-block discount affects the base sum.
    // Strategy: sort items so the three with the smallest modifier form a block (favors MHPCO? No - favors customer).
    // Simpler interpretation: building block of 3 alike gets premium 60 instead of 75 -> a 15 discount per block.
    // Apply per-item modifiers on individual base 25; the block discount is on the unmodified base sum.
    // Cleanest: compute per-item premium = 25 * mod, then subtract 15 per complete block of 3.
    const perItem = group.map(itemModifier).map(m => COMPONENT_SINGLE_PREMIUM * m);
    let groupTotal = perItem.reduce((a, b) => a + b, 0);
    const blocks = Math.floor(group.length / 3);
    groupTotal -= blocks * (3 * COMPONENT_SINGLE_PREMIUM - COMPONENT_BLOCK_PREMIUM);
    total += groupTotal;
  }
  return total;
}

export function quote(
  customer: Customer,
  items: Item[],
  ctx: QuoteContext
): number {
  let subtotal = 0;
  for (const item of items) {
    if (item.type in MAIN_ITEM_BASE) {
      subtotal += mainItemPremium(item);
    }
  }
  subtotal += componentsPremium(items);

  // Customer-level modifiers
  if (customer.yearsWithMHPCO >= 2) subtotal *= 0.8;
  if (ctx.contractIndex === 0) subtotal *= 1.1;
  else subtotal *= 0.85;

  subtotal += PROCESSING_FEE;

  // Use a small epsilon to absorb floating-point drift before rounding up.
  const EPS = 1e-9;
  return Math.ceil(subtotal - EPS);
}
