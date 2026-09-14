export type ItemType =
  | 'sword'
  | 'amulet'
  | 'staff'
  | 'potion'
  | 'rune'
  | 'moonstone';

export interface Item {
  type: string;
  material?: string;
  enchantment?: number;
  cursed?: boolean;
}

interface PriceListEntry {
  insuranceValue: number;
  basePremium: number;
  component: boolean;
}

const PRICE_LIST: Record<ItemType, PriceListEntry> = {
  sword: { insuranceValue: 1000, basePremium: 100, component: false },
  amulet: { insuranceValue: 600, basePremium: 60, component: false },
  staff: { insuranceValue: 800, basePremium: 80, component: false },
  potion: { insuranceValue: 400, basePremium: 40, component: false },
  rune: { insuranceValue: 250, basePremium: 25, component: true },
  moonstone: { insuranceValue: 250, basePremium: 25, component: true },
};

const BLOCK_SIZE = 3;
const BLOCK_PREMIUM = 60;

export class UnknownItemTypeError extends Error {
  constructor(type: string) {
    super(`unknown item type: ${type}`);
    this.name = 'UnknownItemTypeError';
  }
}

export function priceListEntry(type: string): PriceListEntry {
  const entry = PRICE_LIST[type as ItemType];
  if (!entry) throw new UnknownItemTypeError(type);
  return entry;
}

export function insuranceValue(type: string): number {
  return priceListEntry(type).insuranceValue;
}

/**
 * Base premium of a single item, before any modifiers. Components in a
 * complete block of 3 alike ones are priced via the block, so their share is
 * spread evenly across the three items of that block.
 */
export function itemBasePremiums(items: Item[]): number[] {
  const componentCounts = new Map<string, number>();
  for (const item of items) {
    const entry = priceListEntry(item.type);
    if (entry.component) {
      componentCounts.set(item.type, (componentCounts.get(item.type) ?? 0) + 1);
    }
  }

  return items.map((item) => {
    const entry = priceListEntry(item.type);
    if (entry.component && componentCounts.get(item.type) === BLOCK_SIZE) {
      return BLOCK_PREMIUM / BLOCK_SIZE;
    }
    return entry.basePremium;
  });
}

export function policyBasePremium(items: Item[]): number {
  return itemBasePremiums(items).reduce((sum, premium) => sum + premium, 0);
}

export interface Customer {
  yearsWithMHPCO: number;
}

const CURSE_SURCHARGE = 0.5;
const HIGH_ENCHANTMENT_SURCHARGE = 0.3;
const HIGH_ENCHANTMENT_THRESHOLD = 5;
const LOYALTY_DISCOUNT = 0.2;
const LOYALTY_THRESHOLD = 2;
const FIRST_INSURANCE_SURCHARGE = 0.1;
const FOLLOW_UP_DISCOUNT = 0.15;
const PROCESSING_FEE = 5;

/** Rounds in the MHPCO's favour: premiums go up. */
export function roundPremium(amount: number): number {
  return Math.ceil(amount);
}

/**
 * Total premium of a quote.
 *
 * Item-specific modifiers (curse, high enchantment) are computed on the base
 * premium of the affected item; policy-wide modifiers (loyalty, first
 * insurance, follow-up contract) on the policy base premium. Every item in a
 * quote counts as a first insurance, regardless of customer history. The
 * processing fee is added last, and only the final amount is rounded.
 *
 * @param previousContracts number of earlier quotes in the scenario
 */
export function quotePremium(
  items: Item[],
  customer: Customer,
  previousContracts: number,
): number {
  const bases = itemBasePremiums(items);
  const policyBase = bases.reduce((sum, premium) => sum + premium, 0);

  let total = policyBase;

  items.forEach((item, index) => {
    const base = bases[index];
    if (item.cursed) total += base * CURSE_SURCHARGE;
    if ((item.enchantment ?? 0) >= HIGH_ENCHANTMENT_THRESHOLD) {
      total += base * HIGH_ENCHANTMENT_SURCHARGE;
    }
  });

  if (customer.yearsWithMHPCO >= LOYALTY_THRESHOLD) {
    total -= policyBase * LOYALTY_DISCOUNT;
  }
  total += policyBase * FIRST_INSURANCE_SURCHARGE;
  if (previousContracts > 0) {
    total -= policyBase * FOLLOW_UP_DISCOUNT;
  }

  return roundPremium(total + PROCESSING_FEE);
}
