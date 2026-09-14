export interface Item {
  type: string;
  material?: string;
  enchantment?: number;
  cursed?: boolean;
}

const BASE_PREMIUM: Record<string, number> = {
  sword: 100,
  amulet: 60,
  staff: 80,
  potion: 40,
};

const COMPONENT_BASE_PREMIUM = 25;
const BLOCK_SIZE = 3;
const BLOCK_BASE_PREMIUM = 60;

export function isComponent(type: string): boolean {
  return type === 'rune' || type === 'moonstone';
}

export function itemBasePremium(item: Item): number {
  if (isComponent(item.type)) return COMPONENT_BASE_PREMIUM;
  const base = BASE_PREMIUM[item.type];
  if (base === undefined) throw new Error(`unknown item type: ${item.type}`);
  return base;
}

export function policyBasePremium(items: Item[]): number {
  let total = 0;
  const componentCounts = new Map<string, number>();
  for (const item of items) {
    if (isComponent(item.type)) {
      componentCounts.set(item.type, (componentCounts.get(item.type) ?? 0) + 1);
    } else {
      total += itemBasePremium(item);
    }
  }
  for (const count of componentCounts.values()) {
    total += count === BLOCK_SIZE ? BLOCK_BASE_PREMIUM : count * COMPONENT_BASE_PREMIUM;
  }
  return total;
}

export interface Customer {
  yearsWithMHPCO: number;
}

const CURSE_SURCHARGE = 0.5;
const HIGH_ENCHANTMENT_SURCHARGE = 0.3;
const HIGH_ENCHANTMENT_THRESHOLD = 5;
const LOYALTY_DISCOUNT = 0.2;
const LOYALTY_YEARS = 2;
const FIRST_INSURANCE_SURCHARGE = 0.1;
const FOLLOW_UP_DISCOUNT = 0.15;
const PROCESSING_FEE = 5;

function itemSurcharges(items: Item[]): number {
  let surcharge = 0;
  for (const item of items) {
    const base = itemBasePremium(item);
    if (item.cursed) surcharge += base * CURSE_SURCHARGE;
    if ((item.enchantment ?? 0) >= HIGH_ENCHANTMENT_THRESHOLD) {
      surcharge += base * HIGH_ENCHANTMENT_SURCHARGE;
    }
  }
  return surcharge;
}

export function quotePremium(
  items: Item[],
  customer: Customer,
  previousContracts: number,
): number {
  const base = policyBasePremium(items);
  let total = base + itemSurcharges(items);
  if (customer.yearsWithMHPCO >= LOYALTY_YEARS) total -= base * LOYALTY_DISCOUNT;
  total += base * FIRST_INSURANCE_SURCHARGE;
  if (previousContracts > 0) total -= base * FOLLOW_UP_DISCOUNT;
  return Math.ceil(total + PROCESSING_FEE);
}
