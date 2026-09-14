export interface Customer {
  yearsWithMHPCO: number;
}

export interface Item {
  type: string;
  material?: string;
  enchantment?: number;
  cursed?: boolean;
}

const BASE_PREMIUMS: Record<string, number> = {
  sword: 100,
  amulet: 60,
  staff: 80,
  potion: 40,
  rune: 25,
  moonstone: 25,
};

const PROCESSING_FEE = 5;
const FIRST_INSURANCE_SURCHARGE = 0.1;
const CURSE_SURCHARGE = 0.5;
const HIGH_ENCHANTMENT_SURCHARGE = 0.3;
const HIGH_ENCHANTMENT_THRESHOLD = 5;
const LOYALTY_DISCOUNT = 0.2;
const LOYALTY_THRESHOLD = 2;
const FOLLOW_UP_DISCOUNT = 0.15;

const COMPONENT_TYPES = new Set(['rune', 'moonstone']);
const BLOCK_SIZE = 3;
const BLOCK_PREMIUM = 60;

const INSURANCE_VALUES: Record<string, number> = {
  sword: 1000,
  amulet: 600,
  staff: 800,
  potion: 400,
  rune: 250,
  moonstone: 250,
};

/** Throws if the type is not on the MHPCO price list. */
export function assertKnownType(type: string): void {
  if (!(type in BASE_PREMIUMS)) {
    throw new Error(`unknown item type: ${type}`);
  }
}

/** Total insured value of a policy's items; block discounts do not apply. */
export function insuranceSum(items: Item[]): number {
  return items.reduce((sum, item) => sum + INSURANCE_VALUES[item.type], 0);
}

/**
 * Base premium for each item, in input order. Components of the same type form
 * a block of exactly 3 at a special rate; the discount is spread evenly over
 * the block's members so item-level modifiers still attach to single items.
 */
function itemBasePremiums(items: Item[]): number[] {
  const bases = items.map((item) => BASE_PREMIUMS[item.type]);
  const byType = new Map<string, number[]>();
  items.forEach((item, index) => {
    if (!COMPONENT_TYPES.has(item.type)) return;
    const group = byType.get(item.type) ?? [];
    group.push(index);
    byType.set(item.type, group);
  });
  for (const indices of byType.values()) {
    if (indices.length !== BLOCK_SIZE) continue;
    for (const index of indices) bases[index] = BLOCK_PREMIUM / BLOCK_SIZE;
  }
  return bases;
}

export function quotePremium(
  items: Item[],
  customer: Customer,
  previousContracts: number,
): number {
  for (const item of items) assertKnownType(item.type);
  const bases = itemBasePremiums(items);
  let policyBase = 0;
  let total = 0;
  items.forEach((item, index) => {
    const base = bases[index];
    policyBase += base;
    total += base + base * FIRST_INSURANCE_SURCHARGE;
    if (item.cursed) total += base * CURSE_SURCHARGE;
    if ((item.enchantment ?? 0) >= HIGH_ENCHANTMENT_THRESHOLD) {
      total += base * HIGH_ENCHANTMENT_SURCHARGE;
    }
  });
  if (customer.yearsWithMHPCO >= LOYALTY_THRESHOLD) {
    total -= policyBase * LOYALTY_DISCOUNT;
  }
  if (previousContracts > 0) {
    total -= policyBase * FOLLOW_UP_DISCOUNT;
  }
  return Math.ceil(total + PROCESSING_FEE);
}
