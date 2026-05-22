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

const MAIN_BASE: Record<string, number> = {
  sword: 100,
  amulet: 60,
  staff: 80,
  potion: 40,
};

const COMPONENT_TYPES = new Set(['rune', 'moonstone']);
const COMPONENT_BASE = 25;
const COMPONENT_BLOCK_BASE = 60;
const COMPONENT_BLOCK_SIZE = 3;
const PROCESSING_FEE = 5;

function itemMultiplier(item: Item): number {
  let m = 1;
  if (item.cursed) m *= 1.5;
  if ((item.enchantment ?? 0) >= 5) m *= 1.3;
  return m;
}

function componentBaseShare(item: Item, isInBlock: boolean): number {
  // Each item in a block contributes block-base/size; singletons contribute full component base.
  return isInBlock ? COMPONENT_BLOCK_BASE / COMPONENT_BLOCK_SIZE : COMPONENT_BASE;
}

function sumItemBases(items: Item[]): number {
  // Group components by type to apply block pricing.
  const componentBuckets: Record<string, Item[]> = {};
  let total = 0;

  for (const item of items) {
    if (COMPONENT_TYPES.has(item.type)) {
      (componentBuckets[item.type] ??= []).push(item);
    } else if (MAIN_BASE[item.type] != null) {
      total += MAIN_BASE[item.type] * itemMultiplier(item);
    }
  }

  for (const bucket of Object.values(componentBuckets)) {
    const blocks = Math.floor(bucket.length / COMPONENT_BLOCK_SIZE);
    const inBlockCount = blocks * COMPONENT_BLOCK_SIZE;
    for (let i = 0; i < bucket.length; i++) {
      total += componentBaseShare(bucket[i], i < inBlockCount) * itemMultiplier(bucket[i]);
    }
  }

  return total;
}

export function quote(customer: Customer, items: Item[], ctx: QuoteContext): number {
  let amount = sumItemBases(items);

  if (customer.yearsWithMHPCO >= 2) amount *= 0.8;

  if (ctx.contractIndex === 0) {
    amount *= 1.1; // initial assessment surcharge
  } else {
    amount *= 0.85; // repeat-customer discount
  }

  amount += PROCESSING_FEE;

  // Guard against floating-point noise like 110.00000000000001 → 111 by snapping to whole G first.
  const EPS = 1e-9;
  return Math.ceil(amount - EPS);
}
