export interface Item {
  type: string;
  material?: string;
  enchantment?: number;
  cursed?: boolean;
}

export interface Customer {
  yearsWithMHPCO: number;
}

export interface ItemBasePremium {
  item: Item;
  basePremium: number;
}

const PROCESSING_FEE = 5;
const FIRST_INSURANCE_SURCHARGE = 0.1;
const CURSE_SURCHARGE = 0.5;
const HIGH_ENCHANTMENT_SURCHARGE = 0.3;
const HIGH_ENCHANTMENT_THRESHOLD = 5;
const LOYALTY_DISCOUNT = 0.2;
const LOYALTY_THRESHOLD_YEARS = 2;
const FOLLOW_UP_DISCOUNT = 0.15;

const COMPONENT_VALUE = 250;
const COMPONENT_PREMIUM = 25;
const BLOCK_SIZE = 3;
const BLOCK_PREMIUM = 60;

const MAIN_ITEMS: Record<string, { value: number; premium: number }> = {
  sword: { value: 1000, premium: 100 },
  amulet: { value: 600, premium: 60 },
  staff: { value: 800, premium: 80 },
  potion: { value: 400, premium: 40 },
};

const COMPONENT_TYPES = new Set(['rune', 'moonstone']);

export class UnknownItemTypeError extends Error {
  constructor(type: string) {
    super(`Unknown item type: ${type}`);
  }
}

export function insuranceValueOf(item: Item): number {
  const main = MAIN_ITEMS[item.type];
  if (main) return main.value;
  if (COMPONENT_TYPES.has(item.type)) return COMPONENT_VALUE;
  throw new UnknownItemTypeError(item.type);
}

function countByType(items: Item[]): Map<string, number> {
  const counts = new Map<string, number>();
  for (const item of items) {
    counts.set(item.type, (counts.get(item.type) ?? 0) + 1);
  }
  return counts;
}

/**
 * Base premium per item. A block of exactly BLOCK_SIZE alike components is
 * charged at BLOCK_PREMIUM; the discount is spread evenly over the block so
 * that item-specific modifiers keep a per-item base to apply to.
 */
export function itemBasePremiums(items: Item[]): ItemBasePremium[] {
  const counts = countByType(items);
  return items.map((item) => {
    const main = MAIN_ITEMS[item.type];
    if (main) return { item, basePremium: main.premium };
    if (!COMPONENT_TYPES.has(item.type)) throw new UnknownItemTypeError(item.type);
    const isBlock = counts.get(item.type) === BLOCK_SIZE;
    return { item, basePremium: isBlock ? BLOCK_PREMIUM / BLOCK_SIZE : COMPONENT_PREMIUM };
  });
}

/** Surcharges that attach to a single item's own base premium. */
function itemSurcharges({ item, basePremium }: ItemBasePremium): number {
  let surcharge = 0;
  if (item.cursed) surcharge += basePremium * CURSE_SURCHARGE;
  if ((item.enchantment ?? 0) >= HIGH_ENCHANTMENT_THRESHOLD) {
    surcharge += basePremium * HIGH_ENCHANTMENT_SURCHARGE;
  }
  return surcharge;
}

export function quotePremium(
  items: Item[],
  customer: Customer,
  previousContracts: number,
): number {
  const entries = itemBasePremiums(items);
  const policyBase = entries.reduce((sum, entry) => sum + entry.basePremium, 0);

  let premium = policyBase;
  for (const entry of entries) {
    premium += itemSurcharges(entry);
    // Each item in a quote counts as a first insurance, regardless of history.
    premium += entry.basePremium * FIRST_INSURANCE_SURCHARGE;
  }

  if (customer.yearsWithMHPCO >= LOYALTY_THRESHOLD_YEARS) {
    premium -= policyBase * LOYALTY_DISCOUNT;
  }
  if (previousContracts > 0) {
    premium -= policyBase * FOLLOW_UP_DISCOUNT;
  }

  return Math.ceil(premium + PROCESSING_FEE);
}
