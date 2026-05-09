import { Item, Customer } from './types.js';

const MAIN_ITEMS: Record<string, { value: number; base: number }> = {
  sword: { value: 1000, base: 100 },
  amulet: { value: 600, base: 60 },
  staff: { value: 800, base: 80 },
  potion: { value: 400, base: 40 },
};

const COMPONENT_BASE = 25;
const COMPONENT_VALUE = 250;
const BLOCK_OF_THREE_BASE = 60;
const PROCESSING_FEE = 5;

function isComponent(item: Item): boolean {
  return !(item.type in MAIN_ITEMS);
}

function itemBasePremium(item: Item): number {
  if (isComponent(item)) {
    return COMPONENT_BASE;
  }
  return MAIN_ITEMS[item.type].base;
}

export function itemInsuranceValue(item: Item): number {
  if (isComponent(item)) {
    return COMPONENT_VALUE;
  }
  return MAIN_ITEMS[item.type].value;
}

function applyItemModifiers(base: number, item: Item): number {
  let p = base;
  if (item.cursed) p *= 1.5;
  if (item.enchantment >= 5) p *= 1.3;
  return p;
}

function computeComponentBase(components: Item[]): number {
  // Group by type+material to find alike components
  const groups: Map<string, Item[]> = new Map();
  for (const c of components) {
    const key = `${c.type}|${c.material}`;
    if (!groups.has(key)) groups.set(key, []);
    groups.get(key)!.push(c);
  }
  let total = 0;
  // Each item, after modifier application, contributes individually.
  // For a building block of 3 alike components: 60 G base for the whole block
  // (vs 75 G for 3 individual). We need to apply modifiers per item.
  // Approach: for each group of alike components, take groups of 3 and price as block;
  // remainder priced individually.
  for (const group of groups.values()) {
    let i = 0;
    while (i + 3 <= group.length) {
      // Block of 3: base 60, but modifiers apply per item.
      // We treat it as 60 / 3 = 20 per item (then modifiers).
      const triple = group.slice(i, i + 3);
      const baseEach = BLOCK_OF_THREE_BASE / 3;
      for (const it of triple) {
        total += applyItemModifiers(baseEach, it);
      }
      i += 3;
    }
    while (i < group.length) {
      const it = group[i];
      total += applyItemModifiers(COMPONENT_BASE, it);
      i++;
    }
  }
  return total;
}

export function quotePremium(customer: Customer, items: Item[]): number {
  // Separate components from main items
  const mainItems = items.filter((it) => !isComponent(it));
  const components = items.filter(isComponent);

  let total = 0;
  for (const it of mainItems) {
    total += applyItemModifiers(itemBasePremium(it), it);
  }
  total += computeComponentBase(components);

  // Customer modifiers
  if (customer.yearsWithMHPCO >= 2) {
    total *= 0.8; // 20% loyalty discount
  }
  if (customer.contractCount === 0) {
    total *= 1.1; // 10% initial assessment surcharge
  } else {
    total *= 0.85; // 15% subsequent-contract discount
  }

  // Round up (in MHPCO's favor) before adding fee.
  // Use a small epsilon to absorb floating-point noise (e.g. 100*1.1 = 110.00000000000001)
  total = Math.ceil(Math.round(total * 1e8) / 1e8);
  total += PROCESSING_FEE;

  return total;
}

export function totalInsuranceSum(items: Item[]): number {
  return items.reduce((sum, it) => sum + itemInsuranceValue(it), 0);
}
