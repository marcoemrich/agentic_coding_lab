export interface Item {
  type: string;
  material?: string;
  enchantment?: number;
  cursed?: boolean;
}

export interface Customer {
  yearsWithMHPCO: number;
}

const MAIN_ITEMS: Record<string, { insurance: number; base: number }> = {
  sword: { insurance: 1000, base: 100 },
  amulet: { insurance: 600, base: 60 },
  staff: { insurance: 800, base: 80 },
  potion: { insurance: 400, base: 40 },
};

const COMPONENT_INSURANCE = 250;
const COMPONENT_BASE = 25;
const COMPONENT_BLOCK_BASE = 60; // for a block of 3 alike
const PROCESSING_FEE = 5;

export function isComponent(type: string): boolean {
  return !(type in MAIN_ITEMS);
}

export function itemInsuranceValue(item: Item): number {
  if (item.type in MAIN_ITEMS) {
    return MAIN_ITEMS[item.type].insurance;
  }
  return COMPONENT_INSURANCE;
}

export function policyInsuranceSum(items: Item[]): number {
  return items.reduce((sum, it) => sum + itemInsuranceValue(it), 0);
}

/**
 * Compute the item-level base premium, before customer-level modifiers.
 * Item modifiers (cursed, high enchantment) apply per item.
 * Component blocks of 3 alike use the special base premium of 60 G instead of 75 G.
 */
function itemBasePremium(item: Item): number {
  if (item.type in MAIN_ITEMS) {
    return MAIN_ITEMS[item.type].base;
  }
  return COMPONENT_BASE;
}

function applyItemSurcharges(base: number, item: Item): number {
  let factor = 1;
  if (item.cursed) factor += 0.5;
  if ((item.enchantment ?? 0) >= 5) factor += 0.3;
  return base * factor;
}

/**
 * Group components into blocks of 3 alike, and return the
 * adjusted total base premium contribution including item-level
 * surcharges. Cursed/enchanted surcharges apply per item.
 */
function componentsPremium(components: Item[]): number {
  // group by type
  const byType: Record<string, Item[]> = {};
  for (const c of components) {
    (byType[c.type] ||= []).push(c);
  }
  let total = 0;
  for (const type of Object.keys(byType)) {
    const list = byType[type];
    // form blocks of 3
    const blocks = Math.floor(list.length / 3);
    const leftover = list.length % 3;
    let idx = 0;
    for (let b = 0; b < blocks; b++) {
      // The block of 3 has a base premium of 60 G total, but item-level
      // surcharges still apply per item. Distribute the block base across
      // the 3 items evenly (20 G each) so item-specific surcharges apply.
      const perItemBase = COMPONENT_BLOCK_BASE / 3;
      for (let j = 0; j < 3; j++) {
        total += applyItemSurcharges(perItemBase, list[idx]);
        idx++;
      }
    }
    for (let l = 0; l < leftover; l++) {
      total += applyItemSurcharges(COMPONENT_BASE, list[idx]);
      idx++;
    }
  }
  return total;
}

/**
 * Compute the premium for a list of items, given the customer and
 * the index of this contract (0 = first contract).
 */
export function computePremium(
  items: Item[],
  customer: Customer,
  contractIndex: number,
): number {
  // Separate main items vs components
  const mains: Item[] = [];
  const comps: Item[] = [];
  for (const it of items) {
    if (it.type in MAIN_ITEMS) mains.push(it);
    else comps.push(it);
  }

  let total = 0;
  for (const m of mains) {
    total += applyItemSurcharges(itemBasePremium(m), m);
  }
  total += componentsPremium(comps);

  // Customer-level modifiers
  let factor = 1;
  if (customer.yearsWithMHPCO >= 2) factor -= 0.2; // loyalty discount
  if (contractIndex === 0) {
    factor += 0.1; // first insurance: initial assessment surcharge
  } else {
    factor -= 0.15; // discount on each contract after the first
  }

  total = total * factor;
  total += PROCESSING_FEE;

  // Round up (MHPCO's favor), but neutralize floating-point noise first.
  // Multiply by 1e6, round, divide back, then ceil.
  const neutralized = Math.round(total * 1e6) / 1e6;
  return Math.ceil(neutralized);
}
